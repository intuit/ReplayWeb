import reducer, { initialState } from '../../src/reducers/player'
import { types } from '../../src/actions/action_types'
import * as C from '../../src/common/constant'

describe('player reducer', () => {
  it('should do nothing if invalid action', () => {
    const action = {
      type: 'INVALID'
    }
    const expected = Object.assign({},
      initialState
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should edit test case', () => {
    const action = {
      type: types.EDIT_TEST_CASE
    }
    const expected = Object.assign({},
      initialState, {
        status: C.PLAYER_STATUS.STOPPED,
        stopReason: null,
        nextCommandIndex: null,
        errorCommandIndices: [],
        doneCommandIndices: []
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should edit block', () => {
    const action = {
      type: types.EDIT_BLOCK
    }
    const expected = Object.assign({},
      initialState, {
        status: C.PLAYER_STATUS.STOPPED,
        stopReason: null,
        nextCommandIndex: null,
        errorCommandIndices: [],
        doneCommandIndices: []
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should edit new test case', () => {
    const action = {
      type: types.EDIT_NEW_TEST_CASE
    }
    const expected = Object.assign({},
      initialState, {
        nextCommandIndex: null,
        errorCommandIndices: [],
        doneCommandIndices: []
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should edit new block', () => {
    const action = {
      type: types.EDIT_NEW_BLOCK
    }
    const expected = Object.assign({},
      initialState, {
        nextCommandIndex: null,
        errorCommandIndices: [],
        doneCommandIndices: []
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should set player state', () => {
    const action = {
      type: types.SET_PLAYER_STATE,
      data: {
        status: C.PLAYER_STATUS.STOPPED
      }
    }
    const expected = Object.assign({},
      initialState, {
        status: C.PLAYER_STATUS.STOPPED
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should add error index', () => {
    const action = {
      type: types.PLAYER_ADD_ERROR_COMMAND_INDEX,
      data: 3
    }
    const expected = Object.assign({},
      initialState, {
        errorCommandIndices: [3]
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should set context', () => {
    const action = {
      type: types.SET_CONTEXT,
      key: 'potato',
      value: 'tomato'
    }
    const expected = Object.assign({},
      initialState, {
        context: {
          potato: 'tomato'
        }
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should clear context', () => {
    const action = {
      type: types.CLEAR_CONTEXT
    }
    const expected = Object.assign({},
      initialState, {
        context: {
        }
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
})
