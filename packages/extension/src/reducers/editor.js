import isEqual from 'lodash.isequal'
import { types } from '../actions/action_types'
import { setIn, updateIn, pick, filtering } from '../common/utils'
import { normalizeCommand } from '../models/test_case_model'
import * as C from '../common/constant'
import { compose } from 'redux'
import { newCommand } from '../common/commands'

const T = types // so that auto complete in webstorm doesn't go crazy

const newTestCaseEditing = {
  commands: [newCommand],
  filterCommands: [],
  meta: {
    src: null,
    hasUnsaved: true,
    isNewSave: true,
    selectedIndex: -1
  }
}
const newBlockEditing = {
  commands: [newCommand],
  meta: {
    src: null,
    hasUnsaved: true,
    isNewSave: true,
    selectedIndex: -1
  }
}

const newSuiteEditing = {
  tests: [],
  meta: {
    src: null,
    hasUnsaved: true,
    isNewSave: true
  }
}

const doCommandFilter = nextState =>
  setIn(
    ['editing', 'filterCommands'],
    filtering(nextState.editing.commands, nextState.searchText),
    nextState
  )

// * editor
//    * testCases:          all test cases stored in indexedDB
//    * editing:            the current test cases being edited
//    * clipbard            for copy / cut / paste
//
// * player                 the state for player
//    * nextCommandIndex    the current command beging executed
//    * errorCommandIndices commands that encounters some error
//    * doneCommandIndices  commands that have been executed
//    * currentLoop         the current round
//    * loops               how many rounds to run totally
// * files                  the state for the filesystem native host
//    * modalVisible        whether or not the add folder modal is visible
//    * folder              the current selected folder in the modal
//    * contents            the files in the currently selected folder

//    * activeFolder        the folder being used for saving
//    * activeContents      contents of the active folder
//    * folderList          the saved local folders

const initialState = {
  nextTest: null,
  nextBlock: null,
  nextSuite: null,
  inspectTarget: null,
  project: null,
  searchText: '',
  projects: [],
  selectedCmds: [],
  env: {
    session: {},
    localStorage: {},
    ius: null
  },
  testCases: [],
  blocks: [],
  suites: [],
  editing: {
    ...newTestCaseEditing
  },
  clipboard: {
    commands: []
  },
  contextMenu: {
    x: null,
    y: null,
    isShown: false
  },
  status: C.EDITOR_STATUS.TESTS
}

export { initialState }

// Note: for update the `hasUnsaved` status in editing.meta
export const updateHasUnSaved = state => {
  const { status } = state
  const { meta, ...data } = state.editing
  const id = meta.src && meta.src.id
  if (!id) return state

  const tc = state.testCases.find(tc => tc.id === id)
  const block = state.blocks.find(block => block.id === id)
  const suite = state.suites.find(suite => suite.id === id)
  if (!block && !tc && !suite) return state

  switch (status) {
    case C.EDITOR_STATUS.TESTS:
      return setIn(
        ['editing', 'meta', 'hasUnsaved', 'commands'],
        !isEqual(tc.data, data),
        state
      )
    case C.EDITOR_STATUS.BLOCKS:
      return setIn(
        ['editing', 'meta', 'hasUnsaved', 'commands'],
        !isEqual(block.data, data),
        state
      )
    case C.EDITOR_STATUS.SUITES:
      return setIn(
        ['editing', 'meta', 'hasUnsaved', 'tests'],
        !isEqual(suite.data, data),
        state
      )
  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case T.APPEND_COMMAND: {
      const cmds = state.editing.commands
      if (cmds.length === 1 && cmds[0].command === '') {
        return updateHasUnSaved(
          compose(
            doCommandFilter,
            nextState =>
              setIn(['editing', 'commands'], [action.data.command], nextState)
          )(state)
        )
      } else {
        return updateHasUnSaved(
          compose(
            doCommandFilter,
            nextState =>
              updateIn(
                ['editing', 'commands'],
                commands => [...commands, action.data.command],
                nextState
              )
          )(state)
        )
      }
    }

    case T.DUPLICATE_COMMAND:
      return updateHasUnSaved(
        compose(
          doCommandFilter,
          nextState =>
            setIn(
              ['editing', 'meta', 'selectedIndex'],
              action.data.index + 1,
              nextState
            ),
          nextState =>
            updateIn(
              ['editing', 'commands'],
              commands => {
                const { index } = action.data
                commands.splice(index + 1, 0, commands[index])
                return [...commands]
              },
              nextState
            )
        )(state)
      )

    case T.REORDER_COMMAND:
      return updateHasUnSaved(
        compose(
          doCommandFilter,
          nextState =>
            setIn(
              ['editing', 'meta', 'selectedIndex'],
              action.data.newIndex,
              nextState
            ),
          nextState =>
            updateIn(
              ['editing', 'commands'],
              commands => {
                const { oldIndex, newIndex } = action.data
                const commandsWithoutOld = [
                  ...commands.slice(0, oldIndex),
                  ...commands.slice(oldIndex + 1, commands.length)
                ]
                return [
                  ...commandsWithoutOld.slice(0, newIndex),
                  commands[oldIndex],
                  ...commandsWithoutOld.slice(
                    newIndex,
                    commandsWithoutOld.length
                  )
                ]
              },
              nextState
            )
        )(state)
      )

    case T.INSERT_COMMAND:
      return updateHasUnSaved(
        compose(
          doCommandFilter,
          nextState =>
            setIn(
              ['editing', 'meta', 'selectedIndex'],
              action.data.index,
              nextState
            ),
          nextState =>
            updateIn(
              ['editing', 'commands'],
              commands => {
                const { index, command } = action.data
                commands.splice(index, 0, command)
                return [...commands]
              },
              nextState
            )
        )(state)
      )
    case T.UPDATE_COMMAND:
      return updateHasUnSaved(
        compose(
          doCommandFilter,
          nextState =>
            setIn(
              ['editing', 'commands', action.data.index],
              {
                command: action.data.command.command,
                parameters: action.data.command.parameters
              },
              nextState
            )
        )(state)
      )
    case T.REMOVE_COMMAND:
      return updateHasUnSaved(
        compose(
          doCommandFilter,
          nextState =>
            updateIn(
              ['editing', 'commands'],
              commands => {
                const { index } = action.data
                const newCmds = [...commands]
                const cmds = state.editing.commands
                if (cmds.length === 1) {
                  return [newCommand]
                } else {
                  newCmds.splice(index, 1)
                  return [...newCmds]
                }
              },
              nextState
            )
        )(state)
      )
    case T.SELECT_COMMAND:
      return compose(
        doCommandFilter,
        nextState =>
          setIn(
            ['editing', 'meta', 'selectedIndex'],
            action.data.forceClick ||
              state.editing.meta.selectedIndex !== action.data.index
              ? action.data.index
              : -1,
            nextState
          )
      )(state)

    case T.CUT_COMMAND: {
      const commands = action.data.indices.map(i => state.editing.commands[i])
      return updateHasUnSaved(
        compose(
          doCommandFilter,
          nextState => setIn(['clipboard', 'commands'], commands, nextState),
          nextState =>
            updateIn(
              ['editing', 'commands'],
              commands =>
                commands.filter(
                  (c, i) => action.data.indices.indexOf(i) === -1
                ),
              nextState
            )
        )(state)
      )
    }

    case T.COPY_COMMAND: {
      const commands = action.data.indices.map(i => state.editing.commands[i])
      return compose(
        doCommandFilter,
        nextState => setIn(['clipboard', 'commands'], commands, nextState)
      )(state)
    }

    case T.PASTE_COMMAND: {
      const { commands } = state.clipboard

      return updateHasUnSaved(
        compose(
          doCommandFilter,
          nextState =>
            updateIn(
              ['editing', 'commands'],
              cmds => {
                cmds.splice(action.data.index + 1, 0, ...commands)
                return [...cmds]
              },
              nextState
            )
        )(state)
      )
    }

    case T.NORMALIZE_COMMANDS:
      return compose(
        doCommandFilter,
        nextState =>
          updateIn(
            ['editing', 'commands'],
            cmds => cmds.map(normalizeCommand),
            nextState
          )
      )(state)

    case T.UPDATE_SELECTED_COMMAND: {
      return updateHasUnSaved(
        compose(
          doCommandFilter,
          nextState =>
            updateIn(
              [
                'editing',
                'commands',
                state.editing.filterCommands[state.editing.meta.selectedIndex]
                  .index
              ],
              cmdObj => ({
                ...cmdObj,
                ...action.data,
                parameters: action.overwrite
                  ? action.data.parameters
                  : {
                      ...cmdObj.parameters,
                      ...action.data.parameters
                    }
              }),
              nextState
            )
        )(state)
      )
    }

    case T.ADD_SUITE_TEST:
      return updateHasUnSaved(
        updateIn(
          ['editing', 'tests'],
          tests => tests.concat(action.test),
          state
        )
      )

    case T.REMOVE_SUITE_TEST:
      return updateHasUnSaved(
        updateIn(
          ['editing', 'tests'],
          tests => tests.filter(t => t !== action.test),
          state
        )
      )

    case T.SAVE_EDITING_AS_EXISTED:
      return compose(
        doCommandFilter,
        nextState => setIn(['editing', 'meta', 'hasUnsaved'], false, nextState),
        nextState => setIn(['testCases'], action.data, nextState)
      )(state)

    case T.SHARE_BLOCK:
      return compose(
        doCommandFilter,
        nextState => setIn(['editing', 'meta', 'hasUnsaved'], false, nextState),
        nextState => setIn(['shared'], true, nextState)
      )(state)

    case T.UPDATE_SHARE_LINKS: {
      const { shareLink } = action
      return compose(
        setIn(['editing', 'shareLink'], shareLink),
        updateIn(['project', 'shareLinks'], links =>
          links ? links.concat(shareLink) : [shareLink]
        )
      )(state)
    }

    case T.SAVE_EDITING_AS_NEW: {
      const { list, testCase } = action.data
      return compose(
        doCommandFilter,
        nextState => setIn(['testCases'], list, nextState),
        nextState =>
          updateIn(
            ['editing', 'meta'],
            meta => ({
              ...meta,
              hasUnsaved: false,
              isNewSave: true,
              src: pick(['id', 'name'], testCase)
            }),
            nextState
          )
      )(state)
    }

    case T.SAVE_EDITING_BLOCK_AS_EXISTED:
      return compose(
        setIn(['editing', 'meta', 'hasUnsaved'], false),
        setIn(['blocks'], action.data)
      )(state)

    case T.SAVE_EDITING_BLOCK_AS_NEW: {
      const { list: blocksList, block } = action.data
      return compose(
        doCommandFilter,
        nextState => setIn(['blocks'], blocksList, nextState),
        nextState =>
          updateIn(
            ['editing', 'meta'],
            meta => ({
              ...meta,
              hasUnsaved: false,
              isNewSave: true,
              src: pick(['id', 'name'], block)
            }),
            nextState
          )
      )(state)
    }

    case T.SAVE_EDITING_SUITE_AS_EXISTED:
      return compose(
        setIn(['editing', 'meta', 'hasUnsaved'], false),
        setIn(['suites'], action.data)
      )(state)

    case T.SAVE_EDITING_SUITE_AS_NEW: {
      const { list: suiteList, suite } = action.data
      return compose(
        nextState => setIn(['suites'], suiteList, nextState),
        nextState =>
          updateIn(
            ['editing', 'meta'],
            meta => ({
              ...meta,
              hasUnsaved: false,
              isNewSave: true,
              src: pick(['id', 'name'], suite)
            }),
            nextState
          )
      )(state)
    }

    case T.SET_TEST_CASES:
      // need to check if current testcase is already in
      if (action.data.length === 0 && state.status === C.EDITOR_STATUS.TESTS) {
        return compose(
          doCommandFilter,
          nextState => setIn(['testCases'], action.data, nextState),
          nextState =>
            nextState.editing.commands.length !== 0
              ? nextState
              : setIn(['editing'], { ...newTestCaseEditing }, nextState)
        )(state)
      } else {
        return setIn(['testCases'], action.data, state)
      }

    case T.SET_BLOCKS:
      // TODO: need to check if current block is already in
      // This doesn't required the same logic as SET_TEST_CASES..
      // since it will default to Test in case there is no Block
      return setIn(['blocks'], action.data, state)

    case T.SET_SUITES:
      return setIn(['suites'], action.data, state)

    case T.SET_EDITING:
      if (!action.data) return state
      return state.status === C.EDITOR_STATUS.SUITES
        ? setIn(['editing'], action.data, state)
        : updateHasUnSaved(
            compose(
              doCommandFilter,
              nextState => setIn(['editing'], action.data, nextState)
            )(state)
          )

    case T.EDIT_TEST_CASE: {
      const { testCases } = state
      const tc = testCases.find(tc => tc.id === action.data)

      if (!tc) return state

      return compose(
        doCommandFilter,
        nextState =>
          setIn(
            ['editing'],
            {
              ...tc.data,
              meta: {
                selectedIndex: -1,
                hasUnsaved: false,
                isNewSave: nextState.editing.meta.isNewSave,
                src: pick(['id', 'name'], tc)
              }
            },
            nextState
          ),
        nextState => setIn(['status'], C.EDITOR_STATUS.TESTS, nextState)
      )(state)
    }
    case T.EDIT_BLOCK: {
      const { blocks } = state
      const block = blocks.find(({ id }) => id === action.data)

      if (!block) return state

      return compose(
        doCommandFilter,
        nextState =>
          setIn(
            ['editing'],
            {
              ...block.data,
              meta: {
                selectedIndex: -1,
                hasUnsaved: false,
                isNewSave: nextState.editing.meta.isNewSave,
                src: pick(['id', 'name'], block)
              }
            },
            nextState
          ),
        nextState => setIn(['status'], C.EDITOR_STATUS.BLOCKS, nextState)
      )(state)
    }
    case T.EDIT_SUITE: {
      const { suites } = state
      const suite = suites.find(({ id }) => id === action.data)

      if (!suite) return state

      return compose(
        nextState =>
          setIn(
            ['editing'],
            {
              ...suite.data,
              meta: {
                hasUnsaved: false,
                isNewSave: nextState.editing.meta.isNewSave,
                src: pick(['id', 'name'], suite)
              }
            },
            nextState
          ),
        nextState => setIn(['status'], C.EDITOR_STATUS.SUITES, nextState)
      )(state)
    }

    case T.UPDATE_TEST_CASE_STATUS: {
      const { id, status } = action.data
      if (!id) return state

      const { testCases } = state
      const index = testCases.findIndex(tc => tc.id === id)
      if (index === -1) return state

      return compose(
        doCommandFilter,
        nextState => setIn(['testCases', index, 'status'], status, nextState)
      )(state)
    }

    case T.UPDATE_BLOCK_STATUS: {
      const { id, status } = action.data
      if (!id) return state

      const { blocks } = state
      const index = blocks.findIndex(tc => tc.id === id)
      if (index === -1) return state

      return setIn(['blocks', index, 'status'], status, state)
    }

    case T.SET_EDITOR_STATUS:
      return updateIn(['status'], () => action.data, state)

    case T.RENAME_TEST_CASE:
      return compose(
        updateIn(['suites'], suites =>
          suites.map(suite =>
            updateIn(
              ['data', 'tests'],
              tests => {
                const index = tests.indexOf(action.oldName)
                // immutably replace the test name in the same place to minimize git diff
                return index !== -1
                  ? [].concat(
                      tests.slice(0, index),
                      action.data,
                      tests.slice(index + 1)
                    )
                  : tests
              },
              suite
            )
          )
        ),
        setIn(['editing', 'meta', 'src', 'name'], action.data),
        setIn(['testCases'], action.tests)
      )(state)

    case T.RENAME_BLOCK:
      return compose(
        setIn(['editing', 'meta', 'src', 'name'], action.data),
        setIn(['blocks'], action.blocks)
      )(state)

    case T.RENAME_SUITE:
      return compose(
        setIn(['editing', 'meta', 'src', 'name'], action.data),
        setIn(['suites'], action.suites)
      )(state)

    case T.REMOVE_CURRENT_TEST_CASE: {
      const { id } = state.editing.meta.src
      const candidates = state.testCases.filter(tc => tc.id !== id)
      const lastIndex = state.testCases.findIndex(tc => tc.id === id)
      let editing

      if (candidates.length === 0) {
        editing = { ...newTestCaseEditing }
      } else {
        const index =
          lastIndex === -1
            ? 0
            : lastIndex < candidates.length
            ? lastIndex
            : lastIndex - 1
        const tc = candidates[index]

        editing = {
          commands: [newCommand],
          ...tc.data,
          meta: {
            src: pick(['id', 'name'], tc),
            hasUnsaved: false,
            selectedIndex: index
          }
        }
      }
      const newState = {
        ...state,
        editing,
        testCases: [...candidates]
      }
      return doCommandFilter(newState)
    }

    case T.REMOVE_CURRENT_BLOCK: {
      const { id } = state.editing.meta.src
      const candidates = state.blocks.filter(block => block.id !== id)
      const lastIndex = state.blocks.findIndex(block => block.id === id)
      let editing

      if (candidates.length === 0) {
        editing = { ...newBlockEditing }
      } else {
        const index =
          lastIndex === -1
            ? 0
            : lastIndex < candidates.length
            ? lastIndex
            : lastIndex - 1
        const block = candidates[index]

        editing = {
          ...block.data,
          meta: {
            src: pick(['id', 'name'], block),
            hasUnsaved: false,
            selectedIndex: index
          }
        }
      }
      const newState = {
        ...state,
        editing,
        blocks: [...candidates]
      }

      return doCommandFilter(newState)
    }
    case T.REMOVE_CURRENT_SUITE: {
      const { id } = state.editing.meta.src
      const candidates = state.suites.filter(block => block.id !== id)
      const lastIndex = state.suites.findIndex(block => block.id === id)
      let editing

      if (candidates.length === 0) {
        editing = { ...newSuiteEditing }
      } else {
        const index =
          lastIndex === -1
            ? 0
            : lastIndex < candidates.length
            ? lastIndex
            : lastIndex - 1
        const suite = candidates[index]

        editing = {
          ...suite.data,
          meta: {
            src: pick(['id', 'name'], suite),
            hasUnsaved: false
          }
        }
      }
      const newState = {
        ...state,
        editing,
        suites: [...candidates]
      }

      return newState
    }

    case T.EDIT_NEW_TEST_CASE: {
      return compose(
        nextState => setIn(['editing'], { ...newTestCaseEditing }, nextState),
        nextState => setIn(['status'], C.EDITOR_STATUS.TESTS, nextState)
      )(state)
    }

    case T.EDIT_NEW_BLOCK:
      return compose(
        nextState => setIn(['editing'], { ...newBlockEditing }, nextState),
        nextState => setIn(['status'], C.EDITOR_STATUS.BLOCKS, nextState)
      )(state)

    case T.EDIT_NEW_SUITE:
      return compose(
        nextState => setIn(['editing'], { ...newSuiteEditing }, nextState),
        nextState => setIn(['status'], C.EDITOR_STATUS.SUITES, nextState)
      )(state)

    case T.NEXT_TEST:
      return setIn(['nextTest'], action.id, state)
    case T.NEXT_BLOCK:
      return setIn(['nextBlock'], action.id, state)
    case T.NEXT_SUITE:
      return setIn(['nextSuite'], action.id, state)
    case T.SELECT_PROJECT:
      return compose(
        nextState => setIn(['searchText'], '', nextState),
        nextState => setIn(['project'], action.data, nextState)
      )(state)
    case T.LIST_PROJECTS:
      return setIn(['projects'], action.data, state)
    case T.SEARCH_WORD: {
      return setIn(['searchText'], action.value, state)
    }
    case T.FILTER_COMMANDS: {
      return setIn(['editing', 'filterCommands'], action.payload, state)
    }
    case T.MULTI_SELECT: {
      return updateIn(
        ['selectedCmds'],
        selectedCmds =>
          selectedCmds.includes(action.data.index)
            ? selectedCmds.filter(i => i !== action.data.index)
            : [...selectedCmds, action.data.index],
        state
      )
    }
    case T.GROUP_SELECT: {
      return compose(
        updateIn(['selectedCmds'], selectedCmds => {
          const indexMin = Math.min(...selectedCmds)
          const indexMax = Math.max(...selectedCmds)
          const inbetween = state.editing.filterCommands.map(
            (_, index) => index
          )
          return inbetween.slice(indexMin, indexMax + 1)
        }),
        updateIn(['selectedCmds'], selectedCmds => [
          ...selectedCmds,
          action.data.index
        ]),
        updateIn(['selectedCmds'], selectedCmds => [
          ...selectedCmds,
          state.editing.meta.selectedIndex
        ])
      )(state)
    }
    case T.EMPTY_ARRAY: {
      return setIn(['selectedCmds'], [], state)
    }
    case T.INSPECT_TARGET:
      return {
        ...state,
        inspectTarget: action.target
      }
    case T.SHOW_CONTEXT_MENU:
      return {
        ...state,
        contextMenu: action.data
      }
    case T.HIDE_CONTEXT_MENU:
      return updateIn(
        ['contextMenu'],
        ctx => ({ ...ctx, isShown: false }),
        state
      )
    default:
      return state
  }
}
