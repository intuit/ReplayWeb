import reducer from '../../src/reducers/editor'
import { initialState } from '../../src/reducers/editor'
import { types } from '../../src/actions/action_types'
import * as C from '../../src/common/constant'
import { newCommand } from '../../src/common/commands'

describe('editor reducer', () => {
  it('should append command', () => {
    const action = {
      type: types.APPEND_COMMAND,
      data: {
        command: {
          command: 'open',
          parameters: {
            url: 'some website'
          }
        }
      }
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        filterCommands: [
          {
            command: 'open',
            index: 0,
            parameters: {
              url: 'some website'
            }
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
  it('should append a command after an existen command', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          },
          {
            command: 'open',
            parameters: {
              url: 'some other website'
            }
          }
        ],
        filterCommands: [
          {
            command: 'open',
            index: 0,
            parameters: {
              url: 'some website'
            }
          },
          {
            command: 'open',
            index: 1,
            parameters: {
              url: 'some other website'
            }
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.APPEND_COMMAND,
      data: {
        command: {
          command: 'click',
          parameters: {
            url: 'potato'
          }
        }
      }
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          },
          {
            command: 'open',
            parameters: {
              url: 'some other website'
            }
          },
          {
            command: 'click',
            parameters: {
              url: 'potato'
            }
          }
        ],
        filterCommands: [
          {
            command: 'open',
            index: 0,
            parameters: {
              url: 'some website'
            }
          },
          {
            command: 'open',
            index: 1,
            parameters: {
              url: 'some other website'
            }
          },
          {
            command: 'click',
            index: 2,
            parameters: {
              url: 'potato'
            }
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should duplicate command', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        filterCommands: [],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.DUPLICATE_COMMAND,
      data: {
        index: 0
      }
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          },
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        filterCommands: [
          {
            command: 'open',
            index: 0,
            parameters: {
              url: 'some website'
            }
          },
          {
            command: 'open',
            index: 1,
            parameters: {
              url: 'some website'
            }
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: 1
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should duplicate newCommand', () => {
    const action = {
      type: types.DUPLICATE_COMMAND,
      data: {
        index: 0
      }
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [newCommand, newCommand],
        filterCommands: [
          {
            command: '',
            index: 0,
            parameters: {}
          },
          {
            command: '',
            index: 1,
            parameters: {}
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          isNewSave: true,
          selectedIndex: 1
        }
      }
    })
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should reorder command', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          },
          {
            command: 'open',
            parameters: {
              url: 'some other website'
            }
          }
        ],
        filterCommands: [],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.REORDER_COMMAND,
      data: {
        oldIndex: 0,
        newIndex: 1
      }
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some other website'
            }
          },
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        filterCommands: [
          {
            command: 'open',
            index: 0,
            parameters: {
              url: 'some other website'
            }
          },
          {
            command: 'open',
            index: 1,
            parameters: {
              url: 'some website'
            }
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: 1
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should insert command', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          },
          {
            command: 'open',
            parameters: {
              url: 'some other website'
            }
          }
        ],
        filterCommands: [],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.INSERT_COMMAND,
      data: {
        index: 1,
        command: {
          command: 'open',
          parameters: {
            url: 'some new other website'
          }
        }
      }
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          },
          {
            command: 'open',
            parameters: {
              url: 'some new other website'
            }
          },
          {
            command: 'open',
            parameters: {
              url: 'some other website'
            }
          }
        ],
        filterCommands: [
          {
            command: 'open',
            index: 0,
            parameters: {
              url: 'some website'
            }
          },
          {
            command: 'open',
            index: 1,
            parameters: {
              url: 'some new other website'
            }
          },
          {
            command: 'open',
            index: 2,
            parameters: {
              url: 'some other website'
            }
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: 1
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should update command', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        filterCommands: [],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.UPDATE_COMMAND,
      data: {
        index: 0,
        command: {
          command: 'open',
          parameters: {
            url: 'some other website'
          }
        }
      }
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some other website'
            }
          }
        ],
        filterCommands: [
          {
            command: 'open',
            index: 0,
            parameters: {
              url: 'some other website'
            }
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should remove command', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          },
          {
            command: 'open',
            parameters: {
              url: 'some other website'
            }
          }
        ],
        filterCommands: [
          {
            command: 'open',
            index: 0,
            parameters: {
              url: 'some website'
            }
          },
          {
            command: 'open',
            index: 1,
            parameters: {
              url: 'some other website'
            }
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.REMOVE_COMMAND,
      data: {
        index: 1,
        command: {
          command: 'open',
          parameters: {
            url: 'some other website'
          }
        }
      }
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        filterCommands: [
          {
            command: 'open',
            index: 0,
            parameters: {
              url: 'some website'
            }
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should remove last command with newCommand', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        filterCommands: [],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.REMOVE_COMMAND,
      data: {
        index: 0,
        command: {
          command: 'open',
          parameters: {
            url: 'some website'
          }
        }
      }
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [newCommand],
        filterCommands: [{ command: '', index: 0, parameters: {} }],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should select command', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        filterCommands: [],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.SELECT_COMMAND,
      data: {
        index: 0
      }
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        filterCommands: [
          {
            command: 'open',
            index: 0,
            parameters: {
              url: 'some website'
            }
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: 0
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should force select command', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        filterCommands: [],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.SELECT_COMMAND,
      data: {
        index: 2,
        forceClick: true
      }
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        filterCommands: [
          {
            command: 'open',
            index: 0,
            parameters: {
              url: 'some website'
            }
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: 2
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should fallback select command', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
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
      type: types.SELECT_COMMAND,
      data: {
        index: 0
      }
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        filterCommands: [
          {
            command: 'open',
            index: 0,
            parameters: {
              url: 'some website'
            }
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should cut command', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.CUT_COMMAND,
      data: {
        indices: [0]
      }
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [],
        filterCommands: [],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      },
      clipboard: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ]
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should copy command', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        filterCommands: [],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.COPY_COMMAND,
      data: {
        indices: [0]
      }
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        filterCommands: [
          {
            command: 'open',
            index: 0,
            parameters: {
              url: 'some website'
            }
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      },
      clipboard: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ]
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should paste command', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        filterCommands: [],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      },
      clipboard: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some other website'
            }
          }
        ],
        filterCommands: []
      }
    })
    const action = {
      type: types.PASTE_COMMAND,
      data: {
        index: 0
      }
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          },
          {
            command: 'open',
            parameters: {
              url: 'some other website'
            }
          }
        ],
        filterCommands: [
          {
            command: 'open',
            index: 0,
            parameters: {
              url: 'some website'
            }
          },
          {
            command: 'open',
            index: 1,
            parameters: {
              url: 'some other website'
            }
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      },
      clipboard: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some other website'
            }
          }
        ],
        filterCommands: []
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should normalize commands', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website',
              notUrl: 'something else'
            }
          }
        ],
        filterCommands: [],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    const action = {
      type: types.NORMALIZE_COMMANDS
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        filterCommands: [
          {
            command: 'open',
            index: 0,
            parameters: {
              url: 'some website'
            }
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: -1
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should update selected command', () => {
    const init = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            }
          }
        ],
        filterCommands: [
          {
            command: 'open',
            parameters: {
              url: 'some website'
            },
            index: 0
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: 0
        }
      }
    })
    const action = {
      type: types.UPDATE_SELECTED_COMMAND,
      data: {
        parameters: {
          url: 'a new target'
        }
      }
    }
    const expected = Object.assign({}, initialState, {
      editing: {
        commands: [
          {
            command: 'open',
            parameters: {
              url: 'a new target'
            }
          }
        ],
        filterCommands: [
          {
            command: 'open',
            index: 0,
            parameters: {
              url: 'a new target'
            }
          }
        ],
        meta: {
          src: null,
          hasUnsaved: true,
          selectedIndex: 0
        }
      }
    })
    expect(reducer(init, action)).toEqual(expected)
  })
})
it('should select one commands', () => {
  const init = Object.assign({}, initialState, {
    selectedCmds: []
  })
  const action = {
    type: types.MULTI_SELECT,
    data: {
      index: 2
    }
  }
  const expected = Object.assign({}, initialState, {
    selectedCmds: [2]
  })
  expect(reducer(init, action)).toEqual(expected)
})
it('should remove duplicate selection commands', () => {
  const init = Object.assign({}, initialState, {
    selectedCmds: [2]
  })
  const action = {
    type: types.MULTI_SELECT,
    data: {
      index: 2
    }
  }
  const expected = Object.assign({}, initialState, {
    selectedCmds: []
  })
  expect(reducer(init, action)).toEqual(expected)
})
it('should do group selection commands', () => {
  const init = Object.assign({}, initialState, {
    editing: {
      filterCommands: [
        {
          index: 0
        },
        {
          index: 1
        },
        {
          index: 2
        },
        {
          index: 3
        },
        {
          index: 4
        }
      ],
      meta: {
        selectedIndex: 1
      }
    }
  })
  const action = {
    type: types.GROUP_SELECT,
    data: {
      index: 4
    }
  }
  const expected = Object.assign({}, initialState, {
    editing: {
      filterCommands: [
        {
          index: 0
        },
        {
          index: 1
        },
        {
          index: 2
        },
        {
          index: 3
        },
        {
          index: 4
        }
      ],
      meta: {
        selectedIndex: 1
      }
    },
    selectedCmds: [1, 2, 3, 4]
  })
  expect(reducer(init, action)).toEqual(expected)
})
it('should do group selection commands', () => {
  const init = Object.assign({}, initialState, {
    editing: {
      filterCommands: [
        {
          index: 0
        },
        {
          index: 1
        },
        {
          index: 2
        }
      ],
      meta: {
        selectedIndex: 2
      }
    }
  })
  const action = {
    type: types.GROUP_SELECT,
    data: {
      index: 0
    }
  }
  const expected = Object.assign({}, initialState, {
    editing: {
      filterCommands: [
        {
          index: 0
        },
        {
          index: 1
        },
        {
          index: 2
        }
      ],
      meta: {
        selectedIndex: 2
      }
    },
    selectedCmds: [0, 1, 2]
  })
  expect(reducer(init, action)).toEqual(expected)
})
it('should empty selectedCmds array commands', () => {
  const init = Object.assign({}, initialState, {
    selectedCmds: [1, 2, 3, 4, 5]
  })
  const action = {
    type: types.EMPTY_ARRAY
  }
  const expected = Object.assign({}, initialState, {
    selectedCmds: []
  })
  expect(reducer(init, action)).toEqual(expected)
})
