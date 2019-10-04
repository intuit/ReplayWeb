import { type3, types as T } from './action_types'
import { pick, updateIn, setIn } from '../common/utils'
import csIpc from '../common/ipc/ipc_cs'
import storage from '../common/storage'
import testCaseModel, { normalizeCommand } from '../models/test_case_model'
import blockModel from '../models/block-model'
import suiteModel from '../models/suite_model'
import log from '../common/log'
import * as C from '../common/constant'
import {
  allRepos,
  getGithubRepoFromBlockShareConfig,
  logMessage
} from './utilities'
import { saveFile, deleteFile, saveAllFiles } from './filesystem'
import { writeProjectConfig } from './project'
import { setNextTest, setNextBlock, setNextSuite } from './app'
import { message } from 'antd'
let recordedCount = 0

const R = allRepos

const saveEditing = ({ dispatch, getState }) => {
  const { editor } = getState()
  const { editing } = editor
  storage.set('editing', editing)
  saveStatus({ dispatch, getState })
}

const saveStatus = ({ dispatch, getState }) => {
  const state = getState()
  const status = state.editor.status
  storage.set('status', status)
}

export function startRecording() {
  recordedCount = 0

  return {
    types: type3('START_RECORDING'),
    promise: () => {
      return csIpc.ask('PANEL_START_RECORDING', {})
    }
  }
}

export function stopRecording() {
  return {
    types: type3('STOP_RECORDING'),
    promise: () => {
      return csIpc.ask('PANEL_STOP_RECORDING', {})
    }
  }
}

export function startInspecting() {
  return {
    types: type3('START_INSPECTING'),
    promise: () => {
      return csIpc.ask('PANEL_START_INSPECTING', {})
    }
  }
}

export function stopInspecting() {
  return {
    types: type3('STOP_INSPECTING'),
    promise: () => {
      return csIpc.ask('PANEL_STOP_INSPECTING', {})
    }
  }
}

export function doneInspecting() {
  return {
    type: T.DONE_INSPECTING,
    data: {}
  }
}

export function setInspectTarget(target) {
  return {
    type: T.INSPECT_TARGET,
    target
  }
}

export function showContextMenu(data) {
  return {
    type: T.SHOW_CONTEXT_MENU,
    data
  }
}

export function hideContextMenu() {
  return {
    type: T.HIDE_CONTEXT_MENU
  }
}

export function appendCommand(cmdObj, fromRecord = false) {
  if (fromRecord) {
    recordedCount += 1
    // Note: show in badge the recorded count
    csIpc.ask('PANEL_UPDATE_BADGE', {
      type: 'record',
      text: '' + recordedCount
    })
  }

  return {
    type: T.APPEND_COMMAND,
    data: { command: cmdObj },
    post: saveEditing
  }
}

export function duplicateCommand(index) {
  return {
    type: T.DUPLICATE_COMMAND,
    data: { index },
    post: saveEditing
  }
}

export function reorderCommand(oldIndex, newIndex) {
  return {
    type: T.REORDER_COMMAND,
    data: { oldIndex, newIndex },
    post: saveEditing
  }
}

export function insertCommand(cmdObj, index) {
  return {
    type: T.INSERT_COMMAND,
    data: {
      command: cmdObj,
      index: index
    },
    post: saveEditing
  }
}

export function updateCommand(cmdObj, index) {
  return {
    type: T.UPDATE_COMMAND,
    data: {
      command: cmdObj,
      index: index
    },
    post: saveEditing
  }
}

export function removeCommand(index) {
  return {
    type: T.REMOVE_COMMAND,
    data: { index },
    post: saveEditing
  }
}

export function selectCommand(index, forceClick) {
  return {
    type: T.SELECT_COMMAND,
    data: { index, forceClick },
    post: saveEditing
  }
}

export function cutCommand(index) {
  return {
    type: T.CUT_COMMAND,
    data: { indices: [index] },
    post: saveEditing
  }
}

export function copyCommand(index) {
  return {
    type: T.COPY_COMMAND,
    data: { indices: [index] }
  }
}

export function pasteCommand(index) {
  return {
    type: T.PASTE_COMMAND,
    data: { index },
    post: saveEditing
  }
}

export function normalizeCommands() {
  return {
    type: T.NORMALIZE_COMMANDS,
    data: {},
    post: saveEditing
  }
}

export function updateSelectedCommand(obj, overwrite = false) {
  return {
    type: T.UPDATE_SELECTED_COMMAND,
    data: obj,
    post: saveEditing,
    overwrite
  }
}

// In the form of redux-thunnk, it saves current editing test case to local storage
export function saveEditingAsExisted() {
  return (dispatch, getState) => {
    const state = getState()
    const src = state.editor.editing.meta.src
    const tc = state.editor.testCases.find(tc => tc.id === src.id)
    const data = pick(['commands'], state.editor.editing)

    // Make sure, only 'cmd', 'value', 'target' are saved in storage
    data.commands = data.commands.map(normalizeCommand)

    return testCaseModel
      .update(src.id, { ...tc, data })
      .then(() => testCaseModel.listByProject(state.editor.project))
      .then(list => {
        dispatch({
          type: T.SAVE_EDITING_AS_EXISTED,
          data: list,
          post: saveEditing
        })
      })
      .then(() => {
        dispatch(saveFile(tc.name, { commands: data.commands }, true))
      })
      .then(() => dispatch(logMessage({ type: 'Save Existing Test' })))
  }
}
export function saveEditingSuiteAsExisted() {
  return (dispatch, getState) => {
    const state = getState()
    const src = state.editor.editing.meta.src
    const suite = state.editor.suites.find(s => s.id === src.id)
    const data = pick(['tests'], state.editor.editing)

    return suiteModel
      .update(src.id, { ...suite, data })
      .then(() => suiteModel.listByProject(state.editor.project))
      .then(list => {
        dispatch({
          type: T.SAVE_EDITING_SUITE_AS_EXISTED,
          data: list,
          post: saveEditing
        })
      })
      .then(() => {
        dispatch(
          writeProjectConfig(
            getState().editor.project,
            'Saved suite in replay.config.json'
          )
        )
      })
      .then(() => dispatch(logMessage({ type: 'Save Existing Suite' })))
  }
}

// In the form of redux-thunnk, it saves the current editing test case as a new named test case
export function saveEditingSuiteAsNew(name) {
  return (dispatch, getState) => {
    const state = getState()
    const projectId = state.editor.project.id
    const sameName = state.editor.suites.find(s => s.name === name)
    const data = pick(['tests'], state.editor.editing)

    if (sameName) {
      return Promise.reject(new Error('The test case name already exists!'))
    }

    return suiteModel.insert({ name, data, projectId }).then(id =>
      suiteModel
        .listByProject(state.editor.project)
        .then(suites => {
          dispatch({
            type: T.SAVE_EDITING_SUITE_AS_NEW,
            data: {
              suite: {
                id,
                name
              },
              list: suites
            },
            post: saveEditing
          })
        })
        .then(() => {
          if (!state.nextTest) {
            dispatch(setNextSuite(id))
          }
          return dispatch(logMessage({ type: 'Save New Suite' }))
        })
        .then(() =>
          dispatch(
            writeProjectConfig(
              getState().editor.project,
              'Saved new suite in replay.config.json'
            )
          )
        )
        .then(() => dispatch(editSuite(id)))
    )
  }
}
// Share a Block
export function shareEditingBlock() {
  return (dispatch, getState) => {
    const state = getState()
    const src = state.editor.editing.meta.src
    const foundBlock = state.editor.blocks.find(({ id }) => id === src.id)
    const data = pick(['commands'], state.editor.editing)

    data.commands = data.commands.map(normalizeCommand)

    let version = 'v1'

    try {
      // This is safer than it looks, but wrapping it in a try/catch just in case
      if (state.editor.editing.shareLink) {
        const curVerNum = parseInt(
          state.editor.editing.shareLink
            .split('/v')
            .pop()
            .split('.json')[0]
            .split('.json')[0]
        )
        if (isNaN(curVerNum))
          throw new Error('Current Version Number was not a number')
        version = 'v' + (curVerNum + 1)
      }
    } catch (e) {
      console.error(
        'Problem parsing share link, defaulting to V1 (MAY BE OVERWRITING)',
        e
      )
    }

    const link = `sharedBlocks/reply.${src.name.replace(/ /g, '')}.en.${
      src.id
    }/${version}.json`

    console.log('Sending request for repo with: ' + R.BLOCK_STORE)
    const repo = getGithubRepoFromBlockShareConfig(state.app.blockShareConfig)

    return repo
      .writeFile(
        'master',
        link,
        JSON.stringify(state.editor.editing.commands),
        'Adding a block, from Replay extension',
        console.log
      )
      .then(() => dispatch(updateShareLinks(link)))
      .then(() => {
        return blockModel
          .update(src.id, { ...foundBlock, data })
          .then(() => blockModel.listByProject(state.editor.project))
          .then(list => {
            dispatch({
              type: T.SHARE_BLOCK,
              data: list,
              post: saveEditing
            })
          })
          .then(() => {
            dispatch(
              saveFile(
                foundBlock.name,
                { commands: data.commands, shareLink: link },
                false
              )
            )
          })
          .then(() => {
            dispatch(
              writeProjectConfig(
                state.editor.project,
                'Saved suite in replay.config.json'
              )
            )
          })
          .then(() => dispatch(logMessage({ type: 'Save Existing Block' })))
      })
      .then(() => {
        return link
      }) // is caught in ShareModal
  }
}

// In the form of redux-thunnk, it saves the current editing test case as a new named test case
export function saveEditingAsNew(name) {
  return (dispatch, getState) => {
    const state = getState()
    const data = pick(['commands'], state.editor.editing)
    const projectId = state.editor.project.id
    const sameName = state.editor.testCases.find(tc => tc.name === name)

    if (sameName) {
      return Promise.reject(new Error('The test case name already exists!'))
    }

    return testCaseModel.insert({ name, data, projectId }).then(id => {
      return testCaseModel
        .listByProject(state.editor.project)
        .then(testCases => {
          dispatch({
            type: T.SAVE_EDITING_AS_NEW,
            data: {
              testCase: {
                id,
                name
              },
              list: testCases
            },
            post: saveEditing
          })
        })
        .then(() => {
          if (!state.nextTest) {
            dispatch(setNextTest(id))
          }
          dispatch(logMessage({ type: 'Save New Test' }))
        })
        .then(() => {
          dispatch(saveFile(name, { commands: data.commands }, true))
        })
        .then(() => {
          dispatch(editTestCase(id))
        })
    })
  }
}

export function saveEditingBlockAsExisted() {
  return (dispatch, getState) => {
    const state = getState()
    const src = state.editor.editing.meta.src
    const link = state.editor.editing.shareLink
    const isImported = state.editor.editing.isImported
    const foundBlock = state.editor.blocks.find(({ id }) => id === src.id)
    const data = pick(['commands'], state.editor.editing)

    // Make sure, only 'cmd', 'value', 'target' are saved in storage
    data.commands = data.commands.map(normalizeCommand)

    return blockModel
      .update(src.id, { ...foundBlock, data })
      .then(() => blockModel.listByProject(state.editor.project))
      .then(list => {
        dispatch({
          type: T.SAVE_EDITING_BLOCK_AS_EXISTED,
          data: list,
          post: saveEditing
        })
      })
      .then(() => {
        dispatch(
          saveFile(
            foundBlock.name,
            {
              commands: data.commands,
              shareLink: link,
              isImported: isImported
            },
            false
          )
        )
      })
      .then(() => dispatch(logMessage({ type: 'Save Existing Block' })))
  }
}

export function saveEditingBlockAsNew(name) {
  return (dispatch, getState) => {
    const state = getState()
    const data = pick(['commands'], state.editor.editing)
    const projectId = state.editor.project.id
    const sameName = state.editor.blocks.find(
      ({ name: blockName }) => blockName === name
    )
    if (sameName) {
      return Promise.reject(new Error('The test case name already exists!'))
    }

    return blockModel.insert({ name, data, projectId }).then(id => {
      return blockModel
        .listByProject(state.editor.project)
        .then(blocks => {
          dispatch({
            type: T.SAVE_EDITING_BLOCK_AS_NEW,
            data: {
              block: {
                id,
                name
              },
              list: blocks
            },
            post: saveEditing
          })
        })
        .then(() => {
          if (!state.nextBlock) {
            dispatch(setNextBlock(id))
          }
          dispatch(logMessage({ type: 'Save New Block' }))
        })
        .then(() => {
          dispatch(saveFile(name, { commands: data.commands }, false))
        })
        .then(() => {
          dispatch(editBlock(id))
        })
    })
  }
}

export function saveMultiSelectAsNewBlock(name) {
  return (dispatch, getState) => {
    const state = getState()
    const commands = state.editor.selectedCmds.map(
      i => state.editor.editing.filterCommands[i]
    )
    const projectId = state.editor.project.id
    const sameName = state.editor.blocks.find(
      ({ name: blockName }) => blockName === name
    )
    if (sameName) {
      return Promise.reject(new Error('The Block name already exists!'))
    }

    return blockModel
      .insert({ name, data: { commands }, projectId })
      .then(id => {
        return blockModel
          .listByProject(state.editor.project)
          .then(blocks => {
            dispatch({
              type: T.SAVE_EDITING_BLOCK_AS_NEW,
              data: {
                block: {
                  id,
                  name
                },
                list: blocks
              }
            })
          })
          .then(() =>
            dispatch(logMessage({ type: 'Save MultiSelected As New Block' }))
          )
          .then(() => {
            dispatch(saveFile(name, { commands }, false))
          })
      })
  }
}

export function editNext() {
  return (dispatch, getState) => {
    const state = getState()
    const type =
      state.editor.nextSuite !== null
        ? C.EDITOR_STATUS.SUITES
        : state.editor.nextBlock !== null
        ? C.EDITOR_STATUS.BLOCKS
        : C.EDITOR_STATUS.TESTS

    switch (type) {
      case C.EDITOR_STATUS.TESTS:
        return dispatch(editNextTest())
      case C.EDITOR_STATUS.BLOCKS:
        return dispatch(editNextBlock())
      case C.EDITOR_STATUS.SUITES:
        return dispatch(editNextSuite())
    }
  }
}

export function clearNext() {
  return (dispatch, getState) => {
    const state = getState()
    const type =
      state.editor.nextSuite !== null
        ? C.EDITOR_STATUS.SUITES
        : state.editor.nextBlock !== null
        ? C.EDITOR_STATUS.BLOCKS
        : C.EDITOR_STATUS.TESTS
    switch (type) {
      case C.EDITOR_STATUS.TESTS:
        dispatch(setNextTest(null))
        break
      case C.EDITOR_STATUS.BLOCKS:
        dispatch(setNextBlock(null))
        break
      case C.EDITOR_STATUS.SUITES:
        dispatch(setNextSuite(null))
        break
    }
  }
}

export function editNextTest() {
  return (dispatch, getState) => {
    const state = getState()
    if (state.editor.nextTest) {
      dispatch(editTestCase(state.editor.nextTest))
    } else {
      dispatch(editNewTestCase())
    }
  }
}
export function editNextBlock() {
  return (dispatch, getState) => {
    const state = getState()
    if (state.editor.nextBlock) {
      dispatch(editBlock(state.editor.nextBlock))
    } else {
      dispatch(editNewBlock())
    }
  }
}
export function editNextSuite() {
  return (dispatch, getState) => {
    const state = getState()
    if (state.editor.nextSuite) {
      dispatch(editSuite(state.editor.nextSuite))
    } else {
      dispatch(editNewSuite())
    }
  }
}

export function setTestCases(tcs) {
  return {
    type: T.SET_TEST_CASES,
    data: tcs
  }
}

export function setSuites(suites) {
  return {
    type: T.SET_SUITES,
    data: suites
  }
}

export function setBlocks(blocks) {
  return {
    type: T.SET_BLOCKS,
    data: blocks
  }
}

export function setEditing(editing) {
  return {
    type: T.SET_EDITING,
    data: editing
  }
}

export function editTestCase(id) {
  return {
    type: T.EDIT_TEST_CASE,
    data: id,
    post: saveEditing
  }
}

export function editBlock(id) {
  return {
    type: T.EDIT_BLOCK,
    data: id,
    post: saveEditing
  }
}

export function editSuite(id) {
  return {
    type: T.EDIT_SUITE,
    data: id,
    post: saveEditing
  }
}

export function editNewTestCase() {
  return {
    type: T.EDIT_NEW_TEST_CASE,
    data: null,
    post: saveEditing
  }
}

export function editNewBlock() {
  return {
    type: T.EDIT_NEW_BLOCK,
    data: null,
    post: saveEditing
  }
}

export function editNewSuite() {
  return {
    type: T.EDIT_NEW_SUITE
  }
}

export const updateShareLinks = shareLink => ({
  type: T.UPDATE_SHARE_LINKS,
  shareLink
})

export function importBlockFromLink(linkData) {
  return (dispatch, getState) => {
    const state = getState()
    const blocks = state.editor.blocks
    const block = blocks.find(block => block.data.shareLink === linkData.path)
    if (block) {
      message.error('Could not import block - Already imported')
      return Promise.resolve()
    }

    const projectId = state.editor.project.id

    console.log('Sending request for repo with: ' + R.BLOCK_STORE)
    const repo = getGithubRepoFromBlockShareConfig(state.app.blockShareConfig)

    return repo.getContents('master', './' + linkData.path, true).then(resp => {
      const blockData = {
        commands: resp.data,
        isImported: true,
        shareLink: linkData.path
      }
      return blockModel
        .insert({
          name: linkData.name + ' - ' + linkData.version,
          data: blockData,
          projectId
        })
        .then(() =>
          dispatch(logMessage({ type: 'Save Imported Block As New Block' }))
        )
        .then(() =>
          dispatch(
            saveFile(linkData.name + ' - ' + linkData.version, blockData, false)
          )
        )
        .then(() => blockModel.listByProject(state.editor.project))
        .then(list => dispatch(setBlocks(list)))
        .then(() => dispatch(editBlock(linkData.id)))
    })
  }
}

export function addTestCases(tcs) {
  return (dispatch, getState) => {
    const state = getState()
    const testCases = state.editor.testCases
    const validTcs = tcs
      .filter(tc => !testCases.find(tcc => tcc.name === tc.name))
      .map(tc => Object.assign({}, tc, { projectId: state.editor.project.id }))
    const failTcs = tcs.filter(tc =>
      testCases.find(tcc => tcc.name === tc.name)
    )

    const passCount = validTcs.length
    const failCount = tcs.length - passCount

    if (passCount === 0) {
      return Promise.resolve({ passCount, failCount, failTcs })
    }

    return testCaseModel
      .bulkInsert(validTcs)
      .then(() => ({ passCount, failCount, failTcs }))
      .then(() => testCaseModel.listByProject(state.editor.project))
      .then(list => dispatch(setTestCases(list)))
  }
}
export function addBlocks(blocksToAdd) {
  return (dispatch, getState) => {
    const state = getState()
    const blocks = state.editor.blocks
    const validBlocksToAdd = blocksToAdd
      .filter(block => !blocks.find(({ name }) => name === block.name))
      .map(block =>
        Object.assign({}, block, { projectId: state.editor.project.id })
      )
    const failBlocks = blocksToAdd.filter(({ name }) =>
      blocks.find(block => block.name === name)
    )

    const passCount = validBlocksToAdd.length
    const failCount = blocksToAdd.length - passCount

    if (passCount === 0) {
      return Promise.resolve({ passCount, failCount, failBlocks })
    }

    return blockModel
      .bulkInsert(validBlocksToAdd)
      .then(() => ({ passCount, failCount, failBlocks }))
      .then(() => blockModel.listByProject(state.editor.project))
      .then(list => dispatch(setBlocks(list)))
  }
}

export function importTestCases(tcs) {
  return (dispatch, getState) => {
    const state = getState()
    const testCases = state.editor.testCases
    const newTcs = tcs
      .filter(tc => !testCases.find(tcc => tcc.name === tc.name))
      .map(tc => Object.assign({}, tc, { projectId: state.editor.project.id }))
    const existingTcs = tcs.filter(tc =>
      testCases.find(tcc => tcc.name === tc.name)
    )
    const removedTcs = testCases.filter(
      t => !tcs.map(tc => tc.name).includes(t.name)
    )

    return testCaseModel
      .listByProject(state.editor.project)
      .then(stored => {
        const updateCases = existingTcs
          .map(tc => {
            const storedTests = stored.filter(t => t.name === tc.name)
            const storedTest = storedTests[0]
            const duplicates = storedTests.slice(1)
            const { id, projectId, status } = storedTest
            return {
              update: { ...tc, projectId, id, status },
              duplicates
            }
          })
          .reduce(
            (acc, cv) => ({
              update: acc.update.concat(cv.update),
              duplicates: acc.duplicates.concat(cv.duplicates)
            }),
            { update: [], duplicates: [] }
          )
        return testCaseModel
          .bulkUpdate(updateCases.update)
          .then(() => testCaseModel.bulkRemove(updateCases.duplicates))
      })
      .then(() => testCaseModel.bulkRemove(removedTcs))
      .then(() => testCaseModel.bulkInsert(newTcs))
      .then(() => testCaseModel.listByProject(state.editor.project))
      .then(list => dispatch(setTestCases(list)))
  }
}
export function importSuites(suites) {
  return (dispatch, getState) => {
    const state = getState()
    const currentSuites = state.editor.suites
    const newSuites = suites
      .filter(s => !currentSuites.find(suite => suite.name === s.name))
      .map(s => ({ ...s, projectId: state.editor.project.id }))
    const existingSuites = suites.filter(s =>
      currentSuites.find(suite => suite.name === s.name)
    )
    const removedSuites = currentSuites.filter(
      s => !suites.map(su => su.name).includes(s.name)
    )

    return suiteModel
      .listByProject(state.editor.project)
      .then(stored => {
        const updateSuites = existingSuites
          .map(suite => {
            const storedSuites = stored.filter(s => s.name === suite.name)
            const storedSuite = storedSuites[0]
            const duplicates = storedSuites.slice(1)
            const { id, projectId } = storedSuite
            return {
              update: { ...suite, id, projectId },
              duplicates
            }
          })
          .reduce(
            (acc, cv) => ({
              update: acc.update.concat(cv.update),
              duplicates: acc.duplicates.concat(cv.duplicates)
            }),
            { update: [], duplicates: [] }
          )
        return suiteModel
          .bulkUpdate(updateSuites.update)
          .then(() => suiteModel.bulkRemove(updateSuites.duplicates))
      })
      .then(() => suiteModel.bulkRemove(removedSuites))
      .then(() => suiteModel.bulkInsert(newSuites))
      .then(() => suiteModel.listByProject(state.editor.project))
      .then(list => dispatch(setSuites(list)))
  }
}

export function importBlocks(blocksToImport) {
  return (dispatch, getState) => {
    const state = getState()
    const currentBlocks = state.editor.blocks
    const newBlocks = blocksToImport
      .filter(block => !currentBlocks.find(({ name }) => name === block.name))
      .map(block =>
        Object.assign({}, block, { projectId: state.editor.project.id })
      )

    const existingBlocksToUpdate = blocksToImport.filter(({ name }) =>
      currentBlocks.find(currentBlock => currentBlock.name === name)
    )

    const removedBlocks = currentBlocks.filter(
      b => !blocksToImport.map(blk => blk.name).includes(b.name)
    )

    return blockModel
      .listByProject(state.editor.project)
      .then(stored => {
        const updatedBlocks = existingBlocksToUpdate
          .map(block => {
            const storedBlocks = stored.filter(
              ({ name }) => name === block.name
            )
            const storedBlock = storedBlocks[0]
            const duplicates = storedBlocks.slice(1)
            const { id, projectId } = storedBlock
            return {
              update: { ...block, projectId, id },
              duplicates
            }
          })
          .reduce(
            (acc, cv) => ({
              update: acc.update.concat(cv.update),
              duplicates: acc.duplicates.concat(cv.duplicates)
            }),
            { update: [], duplicates: [] }
          )
        return blockModel
          .bulkUpdate(updatedBlocks.update)
          .then(() => blockModel.bulkRemove(updatedBlocks.duplicates))
      })
      .then(() => blockModel.bulkRemove(removedBlocks))
      .then(() => blockModel.bulkInsert(newBlocks))
      .then(() => blockModel.listByProject(state.editor.project))
      .then(list => dispatch(setBlocks(list)))
  }
}

export function renameTestCase(name) {
  return (dispatch, getState) => {
    const state = getState()
    const id = state.editor.editing.meta.src.id
    const oldName = state.editor.editing.meta.src.name
    const tc = state.editor.testCases.find(tc => tc.id === id)
    const sameName = state.editor.testCases.find(
      tc => tc.id !== id && tc.name === name
    )

    if (sameName) {
      return Promise.reject(new Error('The test case name already exists!'))
    }

    return testCaseModel
      .update(id, { ...tc, name })
      .then(() =>
        dispatch(saveFile(name, { commands: tc.data.commands }, true))
      )
      .then(() => dispatch(deleteFile(oldName, true)))
      .then(() => testCaseModel.listByProject(state.editor.project))
      .then(tests =>
        dispatch({
          type: T.RENAME_TEST_CASE,
          data: name,
          post: saveEditing,
          oldName,
          tests
        })
      )
      .then(() => suiteModel.bulkUpdate(getState().editor.suites))
      .then(() =>
        dispatch(writeProjectConfig(getState().editor.project, false))
      )
  }
}

export function renameBlock(name) {
  return (dispatch, getState) => {
    const state = getState()
    const id = state.editor.editing.meta.src.id
    const oldName = state.editor.editing.meta.src.name
    const block = state.editor.blocks.find(block => block.id === id)
    const sameName = state.editor.blocks.find(
      block => block.id !== id && block.name === name
    )

    if (sameName) {
      return Promise.reject(new Error('The block name already exists!'))
    }

    const containsCommand = (commandName, paramName, value) => commands =>
      commands &&
      commands.find(
        ({ command, parameters }) =>
          command === commandName && parameters[paramName] === value
      )
    const updateParameterInCommands = (
      commandName,
      paramName,
      oldValue,
      newValue
    ) => commands =>
      commands &&
      commands.map(command => {
        if (
          command.command === commandName &&
          command.parameters[paramName] === oldValue
        ) {
          return setIn(['parameters', paramName], newValue, command)
        } else {
          return command
        }
      })

    return blockModel
      .update(id, { ...block, name })
      .then(() =>
        dispatch(saveFile(name, { commands: block.data.commands }, false))
      )
      .then(() => dispatch(deleteFile(oldName, false)))
      .then(() => blockModel.listByProject(state.editor.project))
      .then(blocks =>
        dispatch({
          type: T.RENAME_BLOCK,
          data: name,
          post: saveEditing,
          blocks
        })
      )
      .then(() => {
        const containsOldBlock = containsCommand('runBlock', 'block', oldName)
        const replaceBlockInCommand = updateParameterInCommands(
          'runBlock',
          'block',
          oldName,
          name
        )
        const updatedTests = getState()
          .editor.testCases.filter(({ data }) =>
            containsOldBlock(data.commands)
          )
          .map(updateIn(['data', 'commands'], replaceBlockInCommand))

        const updatedBlocks = getState()
          .editor.blocks.filter(({ data }) => containsOldBlock(data.commands))
          .map(updateIn(['data', 'commands'], replaceBlockInCommand))
        return Promise.all([
          testCaseModel
            .bulkUpdate(updatedTests)
            .then(() => dispatch(saveAllFiles(updatedTests))),
          blockModel
            .bulkUpdate(updatedBlocks)
            .then(() => dispatch(saveAllFiles(updatedBlocks, false)))
        ])
      })
  }
}

export function renameSuite(name) {
  return (dispatch, getState) => {
    const state = getState()
    const id = state.editor.editing.meta.src.id
    const suite = state.editor.suites.find(suite => suite.id === id)
    const sameName = state.editor.suites.find(
      suite => suite.id !== id && suite.name === name
    )

    if (sameName) {
      return Promise.reject(new Error('The suite name already exists!'))
    }

    return suiteModel
      .update(id, { ...suite, name })
      .then(() => suiteModel.listByProject(state.editor.project))
      .then(suites => {
        dispatch({
          type: T.RENAME_SUITE,
          data: name,
          post: saveEditing,
          suites
        })
      })
      .then(() =>
        dispatch(
          writeProjectConfig(
            state.editor.project,
            'Renamed suite in replay.config.json'
          )
        )
      )
  }
}

export function removeCurrentTestCase() {
  return (dispatch, getState) => {
    const state = getState()
    const id = state.editor.editing.meta.src.id
    const name = state.editor.editing.meta.src.name

    return testCaseModel
      .remove(id)
      .then(() => {
        dispatch({
          type: T.REMOVE_CURRENT_TEST_CASE,
          data: null,
          post: saveEditing
        })
      })
      .then(() => dispatch(logMessage({ type: 'Delete Test' })))
      .then(() => dispatch(deleteFile(name, true)))
      .catch(e => log.error(e.stack))
  }
}

export function removeCurrentBlock() {
  return (dispatch, getState) => {
    const state = getState()
    const id = state.editor.editing.meta.src.id
    const name = state.editor.editing.meta.src.name

    return blockModel
      .remove(id)
      .then(() => {
        dispatch({
          type: T.REMOVE_CURRENT_BLOCK,
          data: null,
          post: saveEditing
        })
      })
      .then(() => dispatch(logMessage({ type: 'Delete Block' })))
      .then(() => dispatch(deleteFile(name, false)))
      .catch(e => log.error(e.stack))
  }
}
export function removeCurrentSuite() {
  return (dispatch, getState) => {
    const state = getState()
    const id = state.editor.editing.meta.src.id

    return suiteModel
      .remove(id)
      .then(() => {
        dispatch({
          type: T.REMOVE_CURRENT_SUITE,
          data: null,
          post: saveEditing
        })
      })
      .then(() => dispatch(logMessage({ type: 'Delete Suite' })))
      .then(() =>
        dispatch(
          writeProjectConfig(
            state.editor.project,
            'Removed suite from replay.config.json'
          )
        )
      )
      .catch(e => log.error(e.stack))
  }
}
export function duplicate(newName) {
  return (dispatch, getState) => {
    switch (getState().editor.status) {
      case C.EDITOR_STATUS.TESTS:
        return dispatch(duplicateTestCase(newName))
      case C.EDITOR_STATUS.BLOCKS:
        return dispatch(duplicateBlock(newName))
      case C.EDITOR_STATUS.SUITES:
        return dispatch(duplicateSuite(newName))
    }
  }
}
// Note: duplicate current editing and save to another
export function duplicateTestCase(newTestCaseName) {
  return saveEditingAsNew(newTestCaseName)
}
// Note: duplicate current editing and save to another
export function duplicateBlock(newBlockName) {
  return saveEditingBlockAsNew(newBlockName)
}
// Note: duplicate current editing and save to another
export function duplicateSuite(newSuiteName) {
  return saveEditingSuiteAsNew(newSuiteName)
}

export function setEditorStatus(status) {
  return {
    type: T.SET_EDITOR_STATUS,
    data: status,
    post: saveStatus
  }
}
