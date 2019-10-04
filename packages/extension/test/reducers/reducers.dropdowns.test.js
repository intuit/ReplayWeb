import reducer, { initialState } from '../../src/reducers/dropdowns'

import { types } from '../../src/actions/action_types'

describe('dropdowns reducer', () => {
  it('should do nothing if invalid action', () => {
    const action = {
      type: 'INVALID'
    }
    const expected = Object.assign({}, initialState)
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should close testcase dropdown', () => {
    const action = {
      type: types.DROPDOWN_STATE,
      dropdown: 'testcase',
      state: true
    }
    const expected = Object.assign({}, initialState, {
      testcase: true
    })
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should open testcase dropdown', () => {
    const init = Object.assign({}, initialState, { testcase: true })
    const action = {
      type: types.DROPDOWN_STATE,
      dropdown: 'testcase',
      state: false
    }
    const expected = Object.assign({}, init, {
      testcase: false
    })
    expect(reducer(init, action)).toEqual(expected)
  })
})
