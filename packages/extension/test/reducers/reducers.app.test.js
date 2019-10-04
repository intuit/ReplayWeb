import reducer, { initialState } from '../../src/reducers/app'
import { types } from '../../src/actions/action_types'
import * as C from '../../src/common/constant'

describe('app reducer', () => {
  it('should do nothing if invalid action', () => {
    const action = {
      type: 'INVALID'
    }
    const expected = Object.assign({},
      initialState
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should update state for successful recording start', () => {
    const action = {
      type: types.START_RECORDING_SUCCESS
    }
    const expected = Object.assign({},
      initialState, {
        status: C.APP_STATUS.RECORDER,
        recorderStatus: C.APP_STATUS.PENDING
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should update state for successful recording stop', () => {
    const action = {
      type: types.STOP_RECORDING_SUCCESS
    }
    const expected = Object.assign({},
      initialState, {
        status: C.APP_STATUS.NORMAL,
        recorderStatus: C.RECORDER_STATUS.STOPPED
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should update state for successful inspecting start', () => {
    const action = {
      type: types.START_INSPECTING_SUCCESS
    }
    const expected = Object.assign({},
      initialState, {
        status: C.APP_STATUS.INSPECTOR,
        inspectorStatus: C.INSPECTOR_STATUS.PENDING
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should update state for successful inspecting stop', () => {
    const action = {
      type: types.STOP_INSPECTING_SUCCESS
    }
    const expected = Object.assign({},
      initialState, {
        status: C.APP_STATUS.NORMAL,
        recorderStatus: C.INSPECTOR_STATUS.STOPPED
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should update state for successful inspecting done', () => {
    const action = {
      type: types.DONE_INSPECTING
    }
    const expected = Object.assign({},
      initialState, {
        status: C.APP_STATUS.NORMAL,
        recorderStatus: C.INSPECTOR_STATUS.STOPPED
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should update state for successful start playing', () => {
    const action = {
      type: types.START_PLAYING
    }
    const expected = Object.assign({},
      initialState, {
        status: C.APP_STATUS.PLAYER
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should update state for successful stop playing', () => {
    const action = {
      type: types.STOP_PLAYING
    }
    const expected = Object.assign({},
      initialState, {
        status: C.APP_STATUS.NORMAL
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should update state for successful reading of blockStoreConfig from filesystem', () => {
    const blockShareConfig = { someKey: 'SomeData'}
    const action = {
      type: types.READ_BLOCK_SHARE_CONFIG_SUCCESS,
      data: blockShareConfig
    }
    const expected = Object.assign({},
      initialState, {
        blockShareConfig: blockShareConfig,
        blockShareConfigError: false,
        blockShareConfigErrorMessage: ''
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should update state for failed reading of blockStoreConfig from filesystem', () => {
    const error = 'This is an error'
    const action = {
      type: types.READ_BLOCK_SHARE_CONFIG_FAIL,
      err: error
    }
    const expected = Object.assign({},
      initialState, {
        blockShareConfig: {},
        blockShareConfigError: true,
        blockShareConfigErrorMessage: error.toString()
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should add logs', () => {
    const action = {
      type: types.ADD_LOGS,
      data: [
        'potato'
      ]
    }
    const expected = Object.assign({},
      initialState, {
        logs: [
          'potato'
        ]
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should clear logs', () => {
    const action = {
      type: types.CLEAR_LOGS
    }
    const expected = Object.assign({},
      initialState, {
        logs: []
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should add screenshot', () => {
    const action = {
      type: types.ADD_SCREENSHOT,
      data: 'potato.jpg'
    }
    const expected = Object.assign({},
      initialState, {
        screenshots: [
          'potato.jpg'
        ]
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should clear logs', () => {
    const action = {
      type: types.CLEAR_SCREENSHOTS
    }
    const expected = Object.assign({},
      initialState, {
        screenshots: []
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should update config', () => {
    const action = {
      type: types.UPDATE_CONFIG,
      data: {
        showSidebar: false
      }
    }
    const expected = Object.assign({},
      initialState, {
        config: {
          showSidebar: false
        }
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should set userName', () => {
    const action = {
      type: types.USER_NAME,
      name: 'potato'
    }
    const expected = Object.assign({},
      initialState, {
        userName: 'potato'
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
})
