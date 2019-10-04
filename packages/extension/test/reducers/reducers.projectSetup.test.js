import reducer, { initialState } from '../../src/reducers/projectSetup'
import { types } from '../../src/actions/action_types'
import * as C from '../../src/common/constant'

describe('files reducer', () => {
  it('should do nothing if invalid action', () => {
    const action = {
      type: 'INVALID'
    }
    const expected = Object.assign({},
      initialState
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('clear state', () => {
    const action = {
      type: types.CLEAR_PROJECT_SETUP
    }
    const expected = Object.assign({},
      initialState
    )
    expect(reducer({ potato: 'pancakes' }, action)).toEqual(expected)
  })
  it('should set project when editing', () => {
    const action = {
      type: types.EDIT_PROJECT,
      project: {
        id: 123456,
        testPath: './tests',
        blockPath: './blocks',
        projectPath: '~'
      }
    }
    const expected = Object.assign({},
      initialState, {
        id: 123456,
        testPath: './tests',
        blockPath: './blocks',
        projectPath: '~'
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should set existingConfig', () => {
    const action = {
      type: types.EXISTING_CONFIG,
      exists: true
    }
    const expected = Object.assign({},
      initialState, {
        existingConfig: true
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should unset existingConfig', () => {
    const action = {
      type: types.EXISTING_CONFIG,
      exists: false
    }
    const expected = Object.assign({},
      initialState, {
        existingConfig: false
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should set purpose', () => {
    const action = {
      type: types.SET_PURPOSE,
      purpose: types.PROJECT_PATH
    }
    const expected = Object.assign({},
      initialState, {
        purpose: types.PROJECT_PATH
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should set project path', () => {
    const action = {
      type: types.PROJECT_PATH,
      path: '~/'
    }
    const expected = Object.assign({},
      initialState, {
        projectPath: '~/'
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should set test path', () => {
    const action = {
      type: types.TEST_PATH,
      path: '~/tests'
    }
    const init = Object.assign({},
      initialState,
      {
        projectPath: '~'
      }
    )
    const expected = Object.assign({},
      initialState, {
        testPath: './tests',
        projectPath: '~'
      }
    )
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should set block path', () => {
    const action = {
      type: types.BLOCK_PATH,
      path: '~/blocks'
    }
    const init = Object.assign({},
      initialState,
      {
        projectPath: '~'
      }
    )
    const expected = Object.assign({},
      initialState, {
        blockPath: './blocks',
        projectPath: '~'
      }
    )
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should set suites', () => {
    const action = {
      type: types.EXISTING_SUITES,
      suites: {
        suiteA: [
          'test1'
        ]
      }
    }
    const expected = Object.assign({},
      initialState, {
        suites: {
          suiteA: [
            'test1'
          ]
        }
      }
    )
    expect(reducer(initialState, action)).toEqual(expected)
  })
})
