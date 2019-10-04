import reducer, { initialState } from '../../src/reducers/editor'

import { types } from '../../src/actions/action_types'
import { newCommand } from '../../src/common/commands'

describe('editor reducer', () => {
  it('should save suite editing as existed', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        tests: ['test1'],
        meta: {
          src: null,
          hasUnsaved: true
        }
      }
    })
    const action = {
      type: types.SAVE_EDITING_SUITE_AS_EXISTED,
      data: [
        {
          id: 1,
          name: 'newSuite'
        }
      ]
    }
    const expected = Object.assign({}, initialState, {
      suites: [
        {
          id: 1,
          name: 'newSuite'
        }
      ],
      editing: {
        tests: ['test1'],
        meta: {
          src: null,
          hasUnsaved: false
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should save suite editing as new', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        tests: ['test1'],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: 0
        }
      }
    })
    const action = {
      type: types.SAVE_EDITING_SUITE_AS_NEW,
      data: {
        list: [
          {
            id: 1,
            name: 'newSuite'
          }
        ],
        suite: {
          id: 1,
          name: 'newSuite'
        }
      }
    }
    const expected = Object.assign({}, initialState, {
      suites: [
        {
          id: 1,
          name: 'newSuite'
        }
      ],
      editing: {
        tests: ['test1'],
        meta: {
          src: {
            id: 1,
            name: 'newSuite'
          },
          hasUnsaved: false,
          isNewSave: true,
          selectedIndex: 0
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should set suite', () => {
    const action = {
      type: types.SET_SUITES,
      data: [
        {
          id: 1,
          name: 'newSuite'
        }
      ]
    }
    const expected = Object.assign({}, initialState, {
      suites: [
        {
          id: 1,
          name: 'newSuite'
        }
      ],
      editing: {
        commands: [newCommand],
        filterCommands: [],
        meta: {
          src: null,
          hasUnsaved: true,
          isNewSave: true,
          selectedIndex: -1
        }
      }
    })
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should edit suite', () => {
    const suites = [
      {
        id: 1,
        name: 'newSuite',
        data: {
          tests: ['test1']
        }
      },
      {
        id: 2,
        name: 'another suite',
        data: {
          tests: ['test2']
        }
      }
    ]
    const init = Object.assign({}, initialState, {
      suites: suites,
      editing: {
        commands: [newCommand],
        meta: {
          src: null,
          hasUnsaved: false,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.EDIT_SUITE,
      data: 2
    }
    const expected = Object.assign({}, initialState, {
      suites: suites,
      status: 'SUITES',
      editing: {
        tests: ['test2'],
        meta: {
          src: {
            id: 2,
            name: 'another suite'
          },
          hasUnsaved: false
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('edit suite should return default if empty', () => {
    const init = Object.assign({}, initialState, {
      status: 'SUITES',
      editing: {
        commands: [newCommand],
        meta: {
          src: null,
          hasUnsaved: false,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.EDIT_SUITE,
      data: undefined
    }
    const expected = Object.assign({}, initialState, {
      status: 'SUITES',
      editing: {
        commands: [newCommand],
        meta: {
          src: null,
          hasUnsaved: false,
          selectedIndex: -1
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should rename suite', () => {
    const suites = [
      {
        id: 1,
        name: 'newSuite',
        data: {
          tests: ['test1']
        }
      },
      {
        id: 2,
        name: 'another suite',
        data: {
          tests: ['test2']
        }
      }
    ]
    const init = Object.assign({}, initialState, {
      suites: suites,
      editing: {
        tests: ['test2'],
        meta: {
          src: {
            id: 2,
            name: 'another suite'
          },
          hasUnsaved: false
        }
      }
    })
    const action = {
      type: types.RENAME_SUITE,
      data: 'renamed suite',
      suites: suites.map(t =>
        t.id === 2 ? Object.assign({}, t, { name: 'renamed suite' }) : t
      )
    }
    const expected = Object.assign({}, initialState, {
      suites: suites.map(b =>
        b.id === 2 ? Object.assign({}, b, { name: 'renamed suite' }) : b
      ),
      editing: {
        tests: ['test2'],
        meta: {
          src: {
            id: 2,
            name: 'renamed suite'
          },
          hasUnsaved: false
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })

  it('should remove current suite', () => {
    const suites = [
      {
        id: 1,
        name: 'newSuite',
        data: {
          tests: ['test1']
        }
      },
      {
        id: 2,
        name: 'another suite',
        data: {
          tests: ['test2']
        }
      }
    ]
    const init = Object.assign({}, initialState, {
      suites: suites,
      editing: {
        tests: ['test2'],
        meta: {
          src: {
            id: 2,
            name: 'another suite'
          },
          hasUnsaved: false
        }
      }
    })
    const action = {
      type: types.REMOVE_CURRENT_SUITE
    }
    const expected = Object.assign({}, initialState, {
      suites: [suites[0]],
      editing: {
        tests: ['test1'],
        meta: {
          src: {
            id: 1,
            name: 'newSuite'
          },
          hasUnsaved: false
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should remove current suite when only one left', () => {
    const suites = [
      {
        id: 1,
        name: 'newSuite',
        data: {
          tests: ['test1']
        }
      }
    ]
    const init = Object.assign({}, initialState, {
      suites: suites,
      editing: {
        tests: ['test1'],
        meta: {
          src: {
            id: 1,
            name: 'newSuite'
          },
          hasUnsaved: false
        }
      }
    })
    const action = {
      type: types.REMOVE_CURRENT_SUITE
    }
    const expected = Object.assign({}, initialState, {
      suites: [],
      editing: {
        tests: [],
        meta: {
          src: null,
          hasUnsaved: true,
          isNewSave: true
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })

  it('should edit new suite', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        tests: ['test1'],
        meta: {
          src: {
            id: 1,
            name: 'newSuite'
          },
          hasUnsaved: false,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.EDIT_NEW_SUITE
    }
    const expected = Object.assign({}, initialState, {
      status: 'SUITES',
      editing: {
        tests: [],
        meta: {
          src: null,
          hasUnsaved: true,
          isNewSave: true
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should add test to suite', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        tests: ['test1'],
        meta: {
          src: {
            id: 1,
            name: 'newSuite'
          },
          hasUnsaved: false
        }
      }
    })
    const action = {
      type: types.ADD_SUITE_TEST,
      test: 'test2'
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        tests: ['test1', 'test2'],
        meta: {
          src: {
            name: 'newSuite',
            id: 1
          },
          hasUnsaved: false
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should remove test from suite', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        tests: ['test1', 'test2'],
        meta: {
          src: {
            id: 1,
            name: 'newSuite'
          },
          hasUnsaved: false
        }
      }
    })
    const action = {
      type: types.REMOVE_SUITE_TEST,
      test: 'test2'
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        tests: ['test1'],
        meta: {
          src: {
            name: 'newSuite',
            id: 1
          },
          hasUnsaved: false
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
})
