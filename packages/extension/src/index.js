import React from 'react'
import ReactDOM from 'react-dom'
import { message, LocaleProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import { replaceAllFields, expandBlocks } from '@replayweb/utils'

import App from './app'
import { Provider, createStore } from './redux'
import { combineReducers } from 'redux'
import csIpc from './common/ipc/ipc_cs'
import { commandWithoutBaseUrl } from './models/test_case_model'
import projectModel from './models/project_model'
import storage from './common/storage'
import { getPlayer, MODE } from './common/player'
import { updateIn } from './common/utils'
import * as C from './common/constant'
import log from './common/log'
import { collapseExpandedTestCase } from './common/blocks'
import appReducer from './reducers/app'
import editorReducer from './reducers/editor'
import playerReducer from './reducers/player'
import filesReducer from './reducers/files'
import dropdownsReducer from './reducers/dropdowns'
import modalsReducer from './reducers/modals'
import projectSetupReducer from './reducers/projectSetup'
import {
  changeModalState,
  setEditing,
  setPlayerState,
  updateConfig,
  addLog,
  addScreenshot,
  startPlaying,
  stopPlaying,
  readBlockShareConfig,
  updateTestCasePlayStatus,
  updateBlockPlayStatus,
  addPlayerErrorCommandIndex,
  doneInspecting,
  updateSelectedCommand,
  appendCommand,
  selectProject,
  listProjects,
  setContext,
  clearContext,
  getUser,
  reloadProjectFiles
} from './actions'
import { setEditorStatus } from './actions/editor'
import { nativeMessage } from './actions/utilities'
import config from './config'

const rootReducer = combineReducers({
  app: appReducer,
  editor: editorReducer,
  player: playerReducer,
  files: filesReducer,
  dropdowns: dropdownsReducer,
  modals: modalsReducer,
  projectSetup: projectSetupReducer
})

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const rootEl = document.getElementById('root')
const render = Component =>
  ReactDOM.render(
    <LocaleProvider locale={enUS}>
      <Provider store={store}>
        <App />
      </Provider>
    </LocaleProvider>,
    rootEl
  )

// Note: listen to any db changes and restore all data from db to redux store
// All test cases are stored in indexeddb (dexie)
const bindDB = () => {
  function restoreProjects() {
    return projectModel.list().then(projects => {
      store.dispatch(listProjects(projects))
      store.dispatch(
        selectProject(
          projects.find(p => store.getState().editor.project.id === p.id)
        )
      )
    })
  }

  ;['updating', 'creating', 'deleting'].forEach(evt => {
    projectModel.table.hook(evt, () => {
      setTimeout(restoreProjects, 50)
    })
  })

  restoreProjects()

  return storage
    .get('project')
    .then(projectId => {
      if (projectId) {
        return projectModel.get(projectId)
      } else {
        return projectModel.list().then(projects => {
          return projects[0]
        })
      }
    })
    .then(project => {
      if (project) {
        store.dispatch(selectProject(project))
      } else {
        store.dispatch(changeModalState('projectSetup', true))
      }
    })
}

// Note: editing is stored in localstorage
const restoreEditing = () => {
  return storage.get('editing').then(editing => {
    if (editing) {
      let finalEditing = { ...editing, filterCommands: [] }
      if (editing && editing.baseUrl) {
        finalEditing = { ...editing, filterCommands: [] }
        finalEditing.commands = finalEditing.commands.map(
          commandWithoutBaseUrl(editing.baseUrl)
        )
        delete finalEditing.baseUrl
      }
      store.dispatch(setEditing(finalEditing))
    }
  })
}

const restoreStatus = () => {
  return storage.get('status').then(status => {
    if (status) {
      store.dispatch(setEditorStatus(status))
    }
  })
}

const restoreConfig = () => {
  return storage.get('config').then(config => {
    const cfg = {
      showSidebar: true,
      sidebarWidth: 300,
      playScrollElementsIntoView: true,
      playHighlightElements: true,
      playCommandInterval: 0,
      recordNotification: true,
      // timeout in seconds
      timeoutPageLoad: 60,
      timeoutElement: 10,
      ignorePatterns: [],
      ...config
    }
    store.dispatch(updateConfig(cfg))
    store.dispatch(getUser())
    const interval = cfg.filesystemInterval || 15000
    setInterval(() => {
      store.dispatch(reloadProjectFiles())
    }, interval)
  })
}

class TimeTracker {
  constructor() {
    this.reset()
  }

  reset() {
    this.startTime = new Date()
  }

  elapsed() {
    return new Date() - this.startTime
  }

  elapsedInSeconds() {
    const diff = this.elapsed()
    return (diff / 1000).toFixed(2) + 's'
  }
}

// Note: initialize the player, and listen to all events it emits
const bindPlayer = () => {
  const runBlockPreprocessor = ({ resources, config }) => {
    try {
      const originalStartIndex = config.startIndex || 0
      const blocks = store.getState().editor.blocks
      const resourcesResult = expandBlocks(resources, blocks)

      // Find the actual start Index from the original Start index
      const result = collapseExpandedTestCase(resourcesResult)
      // after collapsing the test case, we have a field key called "expanded Index" which is the index after expanding all the blocks
      const { expandedIndex: foundIndex } = result[originalStartIndex]

      // IF we're trying to run a block, then switch it to a STRAIGHT mode and run until endIndex
      if (
        config.mode === MODE.SINGLE &&
        resources[originalStartIndex].command === 'runBlock'
      ) {
        const foundBlock = blocks.find(
          ({ name }) => name === resources[originalStartIndex].value
        )
        return {
          resources: resourcesResult,
          startIndex: foundIndex,
          nextIndex: foundIndex,
          endIndex: foundIndex + foundBlock.data.commands.length - 1,
          mode: MODE.STRAIGHT
        }
      }
      return {
        resources: resourcesResult,
        endIndex: resourcesResult.length - 1,
        startIndex: foundIndex,
        nextIndex: foundIndex
      }
    } catch (e) {
      if (e.message.indexOf('does not exist') !== -1) {
        message.error(e.message, 3)
        store.dispatch(addLog('error', e.message))
        throw e
      } else {
        store.dispatch(addLog('error', 'Unknown Error during playback'))
        throw e
      }
    }
  }

  const tracker = new TimeTracker()
  const player = getPlayer(
    {
      prepare(state) {
        tracker.reset()

        const opts = state.partial ? {} : { url: state.startUrl }
        return csIpc.ask('PANEL_START_PLAYING', opts)
      },
      preprocessors: [runBlockPreprocessor],
      run(command, state) {
        if (command.command === 'open') {
          command = { ...command, href: state.startUrl }
        }

        // add timeout info to each command's extra
        // Please note that we must set the timeout info at runtime for each command,
        // so that timeout could be modified by some 'store' commands and affect
        // the rest of commands
        command = updateIn(
          ['extra'],
          extra => ({
            ...(extra || {}),
            timeoutPageLoad: 60,
            timeoutElement: 10,
            errorIgnore: false
          }),
          command
        )
        return replaceAllFields(
          command.parameters,
          store.getState().player.context
        ).then(finalParameters => {
          const com = {
            command: command.command,
            parameters: finalParameters,
            context: store.getState().player.context,
            extra: command.extra
          }
          return csIpc.ask('PANEL_RUN_COMMAND', { command: com })
        })
      },
      handleResult(result, command, state) {
        if (result && result.context && result.context.forEach) {
          result.context.forEach(({ key, value }) =>
            store.dispatch(setContext(key, value))
          )
        }

        let hasError = false

        if (result && result.log) {
          if (result.log.info) store.dispatch(addLog('info', result.log.info))
          if (result.log.error) {
            store.dispatch(addPlayerErrorCommandIndex(state.nextIndex))
            store.dispatch(addLog('error', result.log.error))
            hasError = true
          }
        }

        if (result && result.screenshot) {
          store.dispatch(addLog('info', 'a new screenshot captured'))
          store.dispatch(addScreenshot(result.screenshot))
        }

        return Promise.resolve(state.nextIndex + 1)
      }
    },
    {
      preDelay: 0
    }
  )

  player.on('LOOP_RESTART', ({ currentLoop }) => {
    csIpc.ask('PANEL_STOP_PLAYING', {})
    csIpc.ask('PANEL_START_PLAYING', {})
    store.dispatch(addLog('info', `Current loop: ${currentLoop}`))
  })

  player.on('START', ({ title }) => {
    log('START')
    store.dispatch(clearContext())
    store.dispatch(startPlaying())

    store.dispatch(
      setPlayerState({
        status: C.PLAYER_STATUS.PLAYING,
        nextCommandIndex: null,
        errorCommandIndices: [],
        doneCommandIndices: []
      })
    )

    store.dispatch(addLog('info', `Playing test case ${title}`))
  })

  player.on('PAUSED', () => {
    log('PAUSED')
    store.dispatch(
      setPlayerState({
        status: C.PLAYER_STATUS.PAUSED
      })
    )

    store.dispatch(addLog('info', `Test case paused`))
  })

  player.on('RESUMED', () => {
    log('RESUMED')
    store.dispatch(
      setPlayerState({
        status: C.PLAYER_STATUS.PLAYING
      })
    )

    store.dispatch(addLog('info', `Test case resumed`))
  })

  player.on('END', obj => {
    const { status } = store.getState().editor
    const isTestCase = status === C.EDITOR_STATUS.TESTS
    log('END', obj)
    csIpc.ask('PANEL_STOP_PLAYING', {})

    store.dispatch(stopPlaying())

    store.dispatch(
      setPlayerState({
        status: C.PLAYER_STATUS.STOPPED,
        stopReason: obj.reason,
        nextCommandIndex: null,
        timeoutStatus: null
      })
    )

    const id = obj.extra && obj.extra.id

    switch (obj.reason) {
      case player.C.END_REASON.COMPLETE:
        if (id)
          store.dispatch(
            isTestCase
              ? updateTestCasePlayStatus(id, C.TEST_CASE_STATUS.SUCCESS)
              : updateBlockPlayStatus(id, C.TEST_CASE_STATUS.SUCCESS)
          )
        message.success('Test case completed running', 1.5)
        break

      case player.C.END_REASON.ERROR:
        if (id)
          store.dispatch(
            isTestCase
              ? updateTestCasePlayStatus(id, C.TEST_CASE_STATUS.ERROR)
              : updateBlockPlayStatus(id, C.TEST_CASE_STATUS.ERROR)
          )
        message.error('Test case encountered some error', 1.5)
        break
    }

    const logMsg = {
      [player.C.END_REASON.COMPLETE]: 'Test case completed',
      [player.C.END_REASON.ERROR]: 'Test case failed',
      [player.C.END_REASON.MANUAL]: 'Test case was stopped manually'
    }

    store.dispatch(
      addLog(
        'info',
        logMsg[obj.reason] + ` (Runtime ${tracker.elapsedInSeconds()})`
      )
    )

    // Note: show in badage the play result
    if (
      obj.reason === player.C.END_REASON.COMPLETE ||
      obj.reason === player.C.END_REASON.ERROR
    ) {
      csIpc.ask('PANEL_UPDATE_BADGE', {
        type: 'play',
        blink: 5000,
        text: obj.reason === player.C.END_REASON.COMPLETE ? 'done' : 'err',
        ...(obj.reason === player.C.END_REASON.COMPLETE
          ? {}
          : { color: 'orange' })
      })
    }
  })

  player.on(
    'TO_PLAY',
    ({ index, currentLoop, loops, resource, playedCommands }) => {
      const collapsedTestCase = collapseExpandedTestCase(playedCommands)
      const testCaseIndex = collapsedTestCase.length - 1
      log('TO_PLAYER', testCaseIndex)
      store.dispatch(
        setPlayerState({
          timeoutStatus: null,
          nextCommandIndex: testCaseIndex,
          currentLoop,
          loops
        })
      )

      const triple = [resource.command, JSON.stringify(resource.parameters)]
      const str = ['', ...triple, ''].join(' | ')
      store.dispatch(addLog('info', `Executing: ${str}`))

      // Note: show in badage the current command index (start from 1)
      csIpc.ask('PANEL_UPDATE_BADGE', {
        type: 'play',
        text: '' + (index + 1)
      })
    }
  )

  player.on('PLAYED_LIST', ({ indices, playedCommands }) => {
    log('PLAYED_LIST', { indices, playedCommands })
    const collapsedTestCase = collapseExpandedTestCase(playedCommands)
    const newIndices = collapsedTestCase.map((_, index) => index)
    store.dispatch(
      setPlayerState({
        doneCommandIndices: newIndices
      })
    )
  })

  player.on('ERROR', ({ msg, playedCommands }) => {
    const nonBlockPlayedCommandIndex =
      playedCommands.filter(({ isBlock }) => !isBlock).length + 1
    log.error(`command index: ${nonBlockPlayedCommandIndex}, Error: ${msg}`)
    store.dispatch(addPlayerErrorCommandIndex(nonBlockPlayedCommandIndex))
    store.dispatch(addLog('error', msg))
  })

  player.on('DELAY', ({ total, past }) => {
    store.dispatch(
      setPlayerState({
        timeoutStatus: {
          type: 'delay',
          total,
          past
        }
      })
    )
  })
}

const bindIpcEvent = () => {
  if (!csIpc) return
  csIpc.onAsk((cmd, args) => {
    switch (cmd) {
      case 'INSPECT_RESULT':
        store.dispatch(doneInspecting())
        const { inspectTarget } = store.getState().editor
        store.dispatch(
          updateSelectedCommand({ parameters: { [inspectTarget]: args.xpath } })
        )
        return true

      case 'RECORD_ADD_COMMAND':
        if (
          args.command === 'clickAndWait' ||
          args.command === 'selectAndWait'
        ) {
          store.dispatch(
            appendCommand(
              Object.assign({}, args, {
                command: args.command.replace('AndWait', '') // strip off AndWait
              }),
              true
            )
          )
          // Then add a pause
          store.dispatch(
            appendCommand(
              {
                command: 'pause',
                parameters: {
                  millis: '1000'
                }
              },
              true
            )
          )
        } else {
          store.dispatch(appendCommand(args, true))
        }
        return true

      case 'TIMEOUT_STATUS':
        if (store.getState().app.status !== C.APP_STATUS.PLAYER) return false

        store.dispatch(
          setPlayerState({
            timeoutStatus: args
          })
        )

        // Note: show in badge the timeout left
        csIpc.ask('PANEL_UPDATE_BADGE', {
          type: 'play',
          text: (args.total - args.past) / 1000 + 's'
        })
        return true
    }
  })
}

const bindWindowEvents = () => {
  // reset status to normal when panel closed
  window.addEventListener('beforeunload', () => {
    csIpc.ask('PANEL_STOP_RECORDING', {})
    csIpc.ask('PANEL_STOP_PLAYING', {})
  })

  window.addEventListener('resize', () => {
    const size = {
      width: window.outerWidth,
      height: window.outerHeight
    }
    store.dispatch(
      updateConfig({
        size: {
          ...size
        }
      })
    )
  })

  window.setLogging = state =>
    store.dispatch(updateConfig({ logging: state === true }))
}

const updateNativeHost = () => {
  return nativeMessage({
    type: 'version'
  })
    .then(version => {
      if (version !== config.hostVersion) {
        return nativeMessage({
          type: 'update',
          tag: config.hostVersion
        })
      }
      return Promise.resolve()
    })
    .catch(e => console.error(`Error Updating Native Host: ${e}`))
}

bindDB()
bindPlayer()
bindIpcEvent()
bindWindowEvents()
restoreStatus()
restoreEditing()
restoreConfig()
updateNativeHost()

// register the tab ID with the background script
if (csIpc && csIpc.ask) csIpc.ask('I_AM_PANEL', {})

render(App)

if (module.hot) module.hot.accept('./app', () => render(App))
