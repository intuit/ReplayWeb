import { initialState } from reducer from '../../src/reducers/editor'

import { types } from '../../src/actions/action_types'
import * as C from '../../src/common/constant'
import { newCommand } from '../../src/common/commands'

describe('editor reducer', () => {
  it('should save test editing as existed', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            cmd: 'open',
            target: 'some website',
            value: '{}'
          }
        ],
        filterCommands: [],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: 0
        }
      }
    })
    const action = {
      type: types.SAVE_EDITING_AS_EXISTED,
      data: [
        {
          id: 1,
          name: 'newTest'
        }
      ]
    }
    const expected = Object.assign({}, initialState, {
      testCases: [
        {
          id: 1,
          name: 'newTest'
        }
      ],
      editing: {
        commands: [
          {
            cmd: 'open',
            target: 'some website',
            value: '{}'
          }
        ],
        filterCommands: [
          {
            cmd: 'open',
            index: 0,
            target: 'some website',
            value: '{}'
          }
        ],
        meta: {
          src: null,
          hasUnsaved: false,
          selectedIndex: 0
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should save test editing as new', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            cmd: 'open',
            target: 'some website',
            value: '{}'
          }
        ],
        filterCommands: [],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: 0
        }
      }
    })
    const action = {
      type: types.SAVE_EDITING_AS_NEW,
      data: {
        list: [
          {
            id: 1,
            name: 'newTest'
          }
        ],
        testCase: {
          id: 1,
          name: 'newTest'
        }
      }
    }
    const expected = Object.assign({}, initialState, {
      testCases: [
        {
          id: 1,
          name: 'newTest'
        }
      ],
      editing: {
        commands: [
          {
            cmd: 'open',
            target: 'some website',
            value: '{}'
          }
        ],
        filterCommands: [
          {
            cmd: 'open',
            index: 0,
            target: 'some website',
            value: '{}'
          }
        ],
        meta: {
          src: {
            id: 1,
            name: 'newTest'
          },
          hasUnsaved: false,
          isNewSave: true,
          selectedIndex: 0
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should set test cases with empty data', () => {
    const action = {
      type: types.SET_TEST_CASES,
      data: []
    }
    const expected = Object.assign({}, initialState, {
      testCases: [],
      editing: {
        commands: [newCommand],
        filterCommands: [{ command: '', index: 0, parameters: {} }],
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
  it('should set test cases', () => {
    const action = {
      type: types.SET_TEST_CASES,
      data: [
        {
          id: 1,
          name: 'newTest'
        }
      ]
    }
    const expected = Object.assign({}, initialState, {
      testCases: [
        {
          id: 1,
          name: 'newTest'
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
  it('should set test cases and select first one', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            cmd: 'open',
            target: 'some website',
            value: '{}'
          }
        ],
        filterCommands: [
          {
            cmd: 'open',
            index: 3,
            target: 'some website',
            value: '{}'
          }
        ],
        meta: {
          src: {
            id: 3,
            name: 'some different test'
          },
          hasUnsaved: true,
          selectedIndex: 0
        }
      }
    })
    const tcs = [
      {
        id: 1,
        name: 'newTest',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'some website',
              value: '{}'
            }
          ]
        }
      },
      {
        id: 2,
        name: 'another test',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'another website',
              value: '{}'
            }
          ]
        }
      }
    ]
    const action = {
      type: types.SET_TEST_CASES,
      data: tcs
    }
    const expected = Object.assign({}, initialState, {
      testCases: tcs,
      editing: {
        commands: [
          {
            cmd: 'open',
            target: 'some website',
            value: '{}'
          }
        ],
        filterCommands: [
          {
            cmd: 'open',
            index: 3,
            target: 'some website',
            value: '{}'
          }
        ],
        meta: {
          src: {
            id: 3,
            name: 'some different test'
          },
          hasUnsaved: true,
          selectedIndex: 0
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should edit test case', () => {
    const tcs = [
      {
        id: 1,
        name: 'newTest',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'some website',
              value: '{}'
            }
          ],
          filterCommands: []
        }
      },
      {
        id: 2,
        name: 'another test',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'another website',
              value: '{}'
            }
          ],
          filterCommands: []
        }
      }
    ]
    const init = Object.assign({}, initialState, {
      testCases: tcs,
      editing: {
        commands: [],
        meta: {
          src: null,
          hasUnsaved: false,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.EDIT_TEST_CASE,
      data: 2
    }
    const expected = Object.assign({}, initialState, {
      testCases: tcs,
      editing: {
        commands: [
          {
            cmd: 'open',
            target: 'another website',
            value: '{}'
          }
        ],
        filterCommands: [
          {
            cmd: 'open',
            index: 0,
            target: 'another website',
            value: '{}'
          }
        ],
        meta: {
          src: {
            id: 2,
            name: 'another test'
          },
          hasUnsaved: false,
          selectedIndex: -1
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('edit test case should return default if empty', () => {
    const action = {
      type: types.EDIT_TEST_CASE,
      data: undefined
    }
    const expected = Object.assign({}, initialState, {
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
  it('update test case status should return default if no index', () => {
    const action = {
      type: types.UPDATE_TEST_CASE_STATUS,
      data: {
        id: undefined
      }
    }
    const expected = Object.assign({}, initialState, {
      status: 'TESTS',
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
  it('update test case status should return default if index does not match', () => {
    const action = {
      type: types.UPDATE_TEST_CASE_STATUS,
      data: {
        id: 4
      }
    }
    const expected = Object.assign({}, initialState, {
      status: 'TESTS',
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
  it('should update test case status', () => {
    const tcs = [
      {
        id: 1,
        name: 'newTest',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'some website',
              value: '{}'
            }
          ]
        }
      },
      {
        id: 2,
        name: 'another test',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'another website',
              value: '{}'
            }
          ]
        }
      }
    ]
    const init = Object.assign({}, initialState, {
      testCases: tcs,
      editing: {
        commands: [],
        meta: {
          src: null,
          hasUnsaved: false,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.UPDATE_TEST_CASE_STATUS,
      data: {
        id: 2,
        status: 'potato'
      }
    }
    const expected = Object.assign({}, initialState, {
      testCases: tcs.map(t =>
        t.id === 2 ? Object.assign({}, t, { status: 'potato' }) : t
      ),
      editing: {
        commands: [],
        filterCommands: [],
        meta: {
          src: null,
          hasUnsaved: false,
          selectedIndex: -1
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should rename test case', () => {
    const tcs = [
      {
        id: 1,
        name: 'newTest',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'some website',
              value: '{}'
            }
          ],
          filterCommands: []
        }
      },
      {
        id: 2,
        name: 'another test',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'another website',
              value: '{}'
            }
          ],
          filterCommands: []
        }
      }
    ]
    const init = Object.assign({}, initialState, {
      testCases: tcs,
      editing: {
        commands: [
          {
            cmd: 'open',
            target: 'another website',
            value: '{}'
          }
        ],
        filterCommands: [],
        meta: {
          src: {
            id: 2,
            name: 'another test'
          },
          hasUnsaved: false,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.RENAME_TEST_CASE,
      data: 'renamed test',
      tests: tcs.map(t =>
        t.id === 2 ? Object.assign({}, t, { name: 'renamed test' }) : t
      )
    }
    const expected = Object.assign({}, initialState, {
      testCases: tcs.map(t =>
        t.id === 2 ? Object.assign({}, t, { name: 'renamed test' }) : t
      ),
      editing: {
        commands: [
          {
            cmd: 'open',
            target: 'another website',
            value: '{}'
          }
        ],
        filterCommands: [],
        meta: {
          src: {
            id: 2,
            name: 'renamed test'
          },
          hasUnsaved: false,
          selectedIndex: -1
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should update a suite when renaming test case', () => {
    const tcs = [
      {
        id: 1,
        name: 'newTest',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'some website',
              value: '{}'
            }
          ],
          filterCommands: []
        }
      },
      {
        id: 2,
        name: 'another test',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'another website',
              value: '{}'
            }
          ],
          filterCommands: []
        }
      }
    ]
    const init = Object.assign({}, initialState, {
      testCases: tcs,
      suites: [
        {
          name: 'example',
          data: {
            tests: ['another test']
          }
        }
      ],
      editing: {
        commands: [
          {
            cmd: 'open',
            target: 'another website',
            value: '{}'
          }
        ],
        filterCommands: [],
        meta: {
          src: {
            id: 2,
            name: 'another test'
          },
          hasUnsaved: false,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.RENAME_TEST_CASE,
      data: 'renamed test',
      tests: tcs.map(t =>
        t.id === 2 ? Object.assign({}, t, { name: 'renamed test' }) : t
      ),
      oldName: 'another test'
    }
    const expected = Object.assign({}, initialState, {
      testCases: tcs.map(t =>
        t.id === 2 ? Object.assign({}, t, { name: 'renamed test' }) : t
      ),
      suites: [
        {
          name: 'example',
          data: {
            tests: ['renamed test']
          }
        }
      ],
      editing: {
        commands: [
          {
            cmd: 'open',
            target: 'another website',
            value: '{}'
          }
        ],
        filterCommands: [],
        meta: {
          src: {
            id: 2,
            name: 'renamed test'
          },
          hasUnsaved: false,
          selectedIndex: -1
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('shouldnt update a suite without the test when renaming test case', () => {
    const tcs = [
      {
        id: 1,
        name: 'newTest',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'some website',
              value: '{}'
            }
          ],
          filterCommands: []
        }
      },
      {
        id: 2,
        name: 'another test',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'another website',
              value: '{}'
            }
          ],
          filterCommands: []
        }
      }
    ]
    const init = Object.assign({}, initialState, {
      testCases: tcs,
      suites: [
        {
          name: 'example',
          data: {
            tests: ['newTest']
          }
        }
      ],
      editing: {
        commands: [
          {
            cmd: 'open',
            target: 'another website',
            value: '{}'
          }
        ],
        filterCommands: [],
        meta: {
          src: {
            id: 2,
            name: 'another test'
          },
          hasUnsaved: false,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.RENAME_TEST_CASE,
      data: 'renamed test',
      tests: tcs.map(t =>
        t.id === 2 ? Object.assign({}, t, { name: 'renamed test' }) : t
      ),
      oldName: 'another test'
    }
    const expected = Object.assign({}, initialState, {
      testCases: tcs.map(t =>
        t.id === 2 ? Object.assign({}, t, { name: 'renamed test' }) : t
      ),
      suites: [
        {
          name: 'example',
          data: {
            tests: ['newTest']
          }
        }
      ],
      editing: {
        commands: [
          {
            cmd: 'open',
            target: 'another website',
            value: '{}'
          }
        ],
        filterCommands: [],
        meta: {
          src: {
            id: 2,
            name: 'renamed test'
          },
          hasUnsaved: false,
          selectedIndex: -1
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should remove current test case', () => {
    const tcs = [
      {
        id: 1,
        name: 'newTest',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'some website',
              value: '{}'
            }
          ]
        }
      },
      {
        id: 2,
        name: 'another test',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'another website',
              value: '{}'
            }
          ]
        }
      }
    ]
    const init = Object.assign({}, initialState, {
      testCases: tcs,
      editing: {
        commands: [
          {
            cmd: 'open',
            target: 'another website',
            value: '{}'
          }
        ],
        meta: {
          src: {
            id: 2,
            name: 'another test'
          },
          hasUnsaved: false,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.REMOVE_CURRENT_TEST_CASE
    }
    const expected = Object.assign({}, initialState, {
      testCases: [tcs[0]],
      editing: {
        commands: [
          {
            cmd: 'open',
            target: 'some website',
            value: '{}'
          }
        ],
        filterCommands: [
          {
            cmd: 'open',
            target: 'some website',
            value: '{}',
            index: 0
          }
        ],
        meta: {
          src: {
            id: 1,
            name: 'newTest'
          },
          hasUnsaved: false,
          selectedIndex: 0
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should remove current test case when only one left', () => {
    const tcs = [
      {
        id: 1,
        name: 'newTest',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'some website',
              value: '{}'
            }
          ]
        }
      }
    ]
    const init = Object.assign({}, initialState, {
      testCases: tcs,
      editing: {
        commands: [
          {
            cmd: 'open',
            target: 'another website',
            value: '{}'
          }
        ],
        filterCommands: [],
        meta: {
          src: {
            id: 1,
            name: 'newTest'
          },
          hasUnsaved: false,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.REMOVE_CURRENT_TEST_CASE
    }
    const expected = Object.assign({}, initialState, {
      testCases: [],
      editing: {
        commands: [newCommand],
        filterCommands: [
          {
            command: '',
            index: 0,
            parameters: {}
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          isNewSave: true,
          selectedIndex: -1
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should edit new test case', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            cmd: 'open',
            target: 'another website',
            value: '{}'
          }
        ],
        filterCommands: [],
        meta: {
          src: {
            id: 1,
            name: 'newTest'
          },
          hasUnsaved: false,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.EDIT_NEW_TEST_CASE
    }
    const expected = Object.assign({}, initialState, {
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
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should search word', () => {
    const action = {
      type: types.SEARCH_WORD,
      value: 'potato'
    }
    const expected = Object.assign({}, initialState, {
      searchText: 'potato'
    })
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should filter Commands', () => {
    const action = {
      type: types.FILTER_COMMANDS,
      payload: [
        {
          cmd: 'open',
          target: 'another website',
          value: '{}'
        }
      ]
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [newCommand],
        filterCommands: [
          {
            cmd: 'open',
            target: 'another website',
            value: '{}'
          }
        ],
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
})
