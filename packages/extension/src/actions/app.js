import { type3, types as T } from './action_types'
import { until, filtering } from '../common/utils'
import csIpc from '../common/ipc/ipc_cs'
import storage from '../common/storage'
import log from '../common/log'
import { nativeMessage, logMessage, getBlockShareConfig } from './utilities'

const saveConfig = (function () {
  let lastSize = {}

  return ({ dispatch, getState }) => {
    let { config } = getState().app
    config = config || {}

    storage.set('config', config)

    const savedSize = config.size
    const finalSize =
      savedSize || {
        width: 1400,
        height: 1000
      }

    if (
      finalSize.width !== lastSize.width ||
      finalSize.height !== lastSize.height
    ) {
      until(
        'find app dom',
        () => {
          const $app = document.querySelector('.app')
          return {
            pass: !!$app,
            result: $app
          }
        },
        100
      )

      if (
        finalSize.width !== window.outerWidth ||
        finalSize.height !== window.outerHeight
      ) {
        if (csIpc) csIpc.ask('PANEL_RESIZE_WINDOW', { size: finalSize })
      }

      lastSize = finalSize
    }
  }
})()

export function readBlockShareConfig () {
  return {
    types: type3('READ_BLOCK_SHARE_CONFIG'),
    promise: () => {
      return getBlockShareConfig()
    }
  }
}

export function addLog (type, text) {
  return {
    type: T.ADD_LOGS,
    data: [
      {
        type,
        text,
        createTime: new Date()
      }
    ]
  }
}

export function clearLogs () {
  return {
    type: T.CLEAR_LOGS,
    data: null
  }
}

export function addScreenshot (screenshot) {
  return {
    type: T.ADD_SCREENSHOT,
    data: {
      ...screenshot,
      createTime: new Date()
    }
  }
}

export function clearScreenshots () {
  return {
    type: T.CLEAR_SCREENSHOTS,
    data: null
  }
}

export function updateConfig (data) {
  return {
    type: T.UPDATE_CONFIG,
    data: data,
    post: saveConfig
  }
}

function searchText (value) {
  return {
    type: T.SEARCH_WORD,
    value
  }
}

const newList = filterCommands => {
  return {
    type: T.FILTER_COMMANDS,
    payload: filterCommands
  }
}
export function filterCommands (text) {
  return (dispatch, getState) => {
    const state = getState()
    const commands = state.editor.editing.commands
    const newCommands = filtering(commands, text)
    dispatch(searchText(text))
    dispatch(newList(newCommands))
    if (text && text !== '') {
      dispatch(logMessage({ type: 'Searching Word', text }))
    }
  }
}

export function changeModalState (modal, state) {
  return {
    type: T.MODAL_STATE,
    modal,
    state
  }
}

export function changeDropdownState (dropdown, state) {
  return {
    type: T.DROPDOWN_STATE,
    dropdown,
    state
  }
}

export function setNextTest (id) {
  return {
    type: T.NEXT_TEST,
    id
  }
}
export function setNextBlock (id) {
  return {
    type: T.NEXT_BLOCK,
    id
  }
}
export function setNextSuite (id) {
  return {
    type: T.NEXT_SUITE,
    id
  }
}

export function setContext (key, value) {
  return {
    type: T.SET_CONTEXT,
    key,
    value
  }
}

export function clearContext () {
  return {
    type: T.CLEAR_CONTEXT
  }
}

export function userName (name) {
  return {
    type: T.USER_NAME,
    name
  }
}

export function getUser () {
  return (dispatch, getState) => {
    nativeMessage({
      type: 'whoami'
    })
      .then(user => {
        dispatch(userName(user.output.trim()))
        dispatch(logMessage({ type: 'App Launch' }))
      })
      .catch(e => dispatch(userName(null)))
  }
}

export function multiSelect (index) {
  return (dispatch) => {
    dispatch({
      type: T.MULTI_SELECT,
      data: { index }
    })
    dispatch(logMessage({ type: 'Multi-Selection' }))
  }
}

export function groupSelect (index) {
  return (dispatch) => {
    dispatch({
      type: T.GROUP_SELECT,
      data: { index }
    })
    dispatch(logMessage({ type: 'Group-Selection' }))
  }
}

export function removeSelected () {
  return {
    type: T.EMPTY_ARRAY
  }
}
