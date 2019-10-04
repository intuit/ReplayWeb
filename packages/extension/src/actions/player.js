import { types as T } from './action_types'
import { pick, on, compose, map } from '../common/utils'
import testCaseModel from '../models/test_case_model'
import blockModel from '../models/block-model'
import { getPlayer } from '../common/player'
import { logMessage } from './utilities'
export function setPlayerState (obj) {
  return {
    type: T.SET_PLAYER_STATE,
    data: obj
  }
}

export function startPlaying () {
  return {
    type: T.START_PLAYING,
    data: null
  }
}

export function stopPlaying () {
  return {
    type: T.STOP_PLAYING,
    data: null
  }
}

export function addPlayerErrorCommandIndex (index) {
  return {
    type: T.PLAYER_ADD_ERROR_COMMAND_INDEX,
    data: index
  }
}

export function updateTestCasePlayStatus (id, status) {
  return (dispatch, getState) => {
    const state = getState()
    const tc = state.editor.testCases.find(tc => tc.id === id)

    return testCaseModel.update(id, { ...tc, status }).then(() => {
      dispatch({
        type: T.UPDATE_TEST_CASE_STATUS,
        data: { id, status }
      })
    })
  }
}

export function updateBlockPlayStatus (id, status) {
  return (dispatch, getState) => {
    const state = getState()
    const block = state.editor.blocks.find(block => block.id === id)

    return blockModel.update(id, { ...block, status }).then(() => {
      dispatch({
        type: T.UPDATE_BLOCK_STATUS,
        data: { id, status }
      })
    })
  }
}

export function playerPlay (options) {
  return (dispatch, getState) => {
    const state = getState()
    const { config } = state.app
    const cfg = pick(
      ['playHighlightElements', 'playScrollElementsIntoView'],
      config
    )
    const macroName = state.editor.editing.meta.src
      ? state.editor.editing.meta.src.name
      : 'Untitled'
    const scope = {
      '!MACRONAME': macroName,
      '!TIMEOUT_PAGELOAD': parseInt(config.timeoutPageLoad, 10),
      '!TIMEOUT_WAIT': parseInt(config.timeoutElement, 10),
      '!REPLAYSPEED': {
        0: 'FAST',
        0.3: 'MEDIUM',
        2: 'SLOW'
      }[options.postDelay]
    }

    const opts = compose(on('resources'), map, on('extra'))((extra = {}) => ({
      ...extra,
      ...cfg
    }))(options)
    dispatch(logMessage({ type: 'Run Test' }))
    getPlayer().play({
      ...opts,
      public: {
        ...(opts.public || {}),
        scope
      }
    })
  }
}
