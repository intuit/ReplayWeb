import reducer from '../../src/reducers/editor';
import {initialState} from '../../src/reducers/editor';
import {types} from '../../src/actions/action_types';
import * as C from '../../src/common/constant';
import {newCommand} from '../../src/common/commands';

describe('editor reducer', () => {
  it('should save block editing as existed', () => {
    const init = Object.assign({},
      initialState,
      {
        editing: {
          commands: [
            {
              cmd: 'open',
              target: 'some website',
              value: '{}'
            }
          ],
          meta: {
            src: null,
            hasUnsaved: true,
            selectedIndex: 0
          }
        }
      }
    )
    const action = {
      type: types.SAVE_EDITING_BLOCK_AS_EXISTED,
      data: [
        {
          id: 1,
          name: 'newBlock'
        }
      ]
    };
    const expected = Object.assign({},
      initialState,
      {
        blocks: [
          {
            id: 1,
            name: 'newBlock'
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
          meta: {
            src: null,
            hasUnsaved: false,
            selectedIndex: 0
          }
        }
      }
    )
    expect(reducer(init, action)).toEqual(expected);
  })
  it('should save block editing as new', () => {
    const init = Object.assign({},
      initialState,
      {
        editing: {
          commands: [
            {
              cmd: 'open',
              target: 'some website',
              value: '{}'
            }
          ],
          meta: {
            src: null,
            hasUnsaved: true,
            selectedIndex: 0
          }
        }
      }
    )
    const action = {
      type: types.SAVE_EDITING_BLOCK_AS_NEW,
      data: {
        list: [
          {
            id: 1,
            name: 'newBlock'
          }
        ],
        block: {
          id: 1,
          name: 'newBlock'
        }
      }
    };
    const expected = Object.assign({},
      initialState,
      {
        blocks: [
          {
            id: 1,
            name: 'newBlock'
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
              cmd: "open",
              index: 0,
              target: "some website",
              value: "{}"
            }
          ],
          meta: {
            src: {
              id: 1,
              name: 'newBlock'
            },
            hasUnsaved: false,
            isNewSave: true,
            selectedIndex: 0
          }
        }
      }
    )
    expect(reducer(init, action)).toEqual(expected);
  })
  it('should set blocks', () => {
    const action = {
      type: types.SET_BLOCKS,
      data: [
        {
          id: 1,
          name: 'newBlock'
        }
      ]
    };
    const expected = Object.assign({},
      initialState,
      {
        blocks: [
          {
            id: 1,
            name: 'newBlock'
          }
        ],
        editing: {
          commands: [
            newCommand
          ],
          filterCommands: [],
          meta: {
            src: null,
            hasUnsaved: true,
            isNewSave: true,
            selectedIndex: -1
          }
        }
      }
    )
    expect(reducer(initialState, action)).toEqual(expected);
  })
  it('should edit block', () => {
    const blocks = [
      {
        id: 1,
        name: 'newBlock',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'some website',
              value: '{}'
            }
          ],
          filterCommands:[]
        }
      },
      {
        id: 2,
        name: 'another block',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'another website',
              value: '{}'
            }
          ],
          filterCommands:[]
        }
      }
    ]
    const init = Object.assign({},
      initialState,
      {
        blocks: blocks,
        editing: {
          commands: [
            newCommand
          ],
          meta: {
            src: null,
            hasUnsaved: false,
            selectedIndex: -1
          }
        }
      }
    )
    const action = {
      type: types.EDIT_BLOCK,
      data: 2
    };
    const expected = Object.assign({},
      initialState,
      {
        blocks: blocks,
        status: 'BLOCKS',
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
              index:0,
              target: 'another website',
              value: '{}'
            }
          ],
          meta: {
            src: {
              id: 2,
              name: 'another block'
            },
            hasUnsaved: false,
            selectedIndex: -1
          }
        }
      }
    )
    expect(reducer(init, action)).toEqual(expected);
  })
  it('edit block should return default if empty', () => {
    const init = Object.assign({},
      initialState,
      {
        status: 'BLOCKS',
        editing: {
          commands: [
          ],
          filterCommands: [
          ],
          meta: {
            src: null,
            hasUnsaved: true,
            selectedIndex: -1
          }
        }
      }
    )
    const action = {
      type: types.EDIT_BLOCK,
      data: undefined
    };
    const expected = Object.assign({},
      initialState,
      {
        status: 'BLOCKS',
        editing: {
          commands: [
          ],
          filterCommands: [
          ],
          meta: {
            src: null,
            hasUnsaved: true,
            selectedIndex: -1
          }
        }
      }
    )
    expect(reducer(init, action)).toEqual(expected);
  })
  it('update block status should return default if no index', () => {
    const action = {
      type: types.UPDATE_BLOCK_STATUS,
      data: {
        id: undefined,
      }
    };
    const expected = Object.assign({},
      initialState,
      {
        status: 'TESTS',
        editing: {
          commands: [
            newCommand
          ],
          filterCommands: [],
          meta: {
            src: null,
            hasUnsaved: true,
            isNewSave: true,
            selectedIndex: -1
          }
        }
      }
    )
    expect(reducer(initialState, action)).toEqual(expected);
  })
  it('update block status should return default if index does not match', () => {
    const action = {
      type: types.UPDATE_BLOCK_STATUS,
      data: {
        id: 2,
      }
    };
    const expected = Object.assign({},
      initialState,
      {
        status: 'TESTS',
        editing: {
          commands: [
            newCommand
          ],
          filterCommands: [],
          meta: {
            src: null,
            hasUnsaved: true,
            isNewSave: true,
            selectedIndex: -1
          }
        }
      }
    )
    expect(reducer(initialState, action)).toEqual(expected);
  })
  it('should update block status', () => {
    const blocks = [
      {
        id: 1,
        name: 'newBlock',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'some website',
              value: '{}'
            }
          ],
          filterCommands: [
          ]
        }
      },
      {
        id: 2,
        name: 'another block',
        data: {
          commands: [
            {
              cmd: 'open',
              target: 'another website',
              value: '{}'
            }
          ],
          filterCommands: [
          ]
        }
      }
    ]
    const init = Object.assign({},
      initialState,
      {
        blocks: blocks,
        editing: {
          commands: [
          ],
          filterCommands: [],
          meta: {
            src: null,
            hasUnsaved: false,
            selectedIndex: -1
          }
        }
      }
    )
    const action = {
      type: types.UPDATE_BLOCK_STATUS,
      data: {
        id: 2,
        status: 'tomato'
      }
    };
    const expected = Object.assign({},
      initialState,
      {
        blocks: blocks.map(b => b.id === 2 ? Object.assign({}, b, {status: 'tomato'}) : b),
        editing: {
          commands: [
          ],
          filterCommands: [],
          meta: {
            src: null,
            hasUnsaved: false,
            selectedIndex: -1
          }
        }
      }
    )
    expect(reducer(init, action)).toEqual(expected);
  })
  it('should rename block', () => {
    const blocks = [
      {
        id: 1,
        name: 'newBlock',
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
        name: 'another block',
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
    const init = Object.assign({},
      initialState,
      {
        blocks: blocks,
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
      }
    )
    const action = {
      type: types.RENAME_BLOCK,
      data: 'renamed block',
      blocks: blocks.map(t => t.id === 2 ? Object.assign({}, t, {name: 'renamed block'}): t)

    };
    const expected = Object.assign({},
      initialState,
      {
        blocks: blocks.map(b => b.id === 2 ? Object.assign({}, b, {name: 'renamed block'}): b),
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
              name: 'renamed block'
            },
            hasUnsaved: false,
            selectedIndex: -1
          }
        }
      }
    )
    expect(reducer(init, action)).toEqual(expected);
  })

  it('should remove current block', () => {
    const blocks = [
      {
        id: 1,
        name: 'newBlock',
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
        name: 'another block',
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
    const init = Object.assign({},
      initialState,
      {
        blocks: blocks,
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
              name: 'another block'
            },
            hasUnsaved: false,
            selectedIndex: -1
          }
        }
      }
    )
    const action = {
      type: types.REMOVE_CURRENT_BLOCK

    };
    const expected = Object.assign({},
      initialState,
      {
        blocks: [blocks[0]],
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
              name: 'newBlock'
            },
            hasUnsaved: false,
            selectedIndex: 0
          }
        }
      }
    )
    expect(reducer(init, action)).toEqual(expected);
  })
  it('should remove current block when only one left', () => {
    const blocks = [
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
    const init = Object.assign({},
      initialState,
      {
        blocks: blocks,
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
              id: 1,
              name: 'newTest'
            },
            hasUnsaved: false,
            selectedIndex: -1
          }
        }
      }
    )
    const action = {
      type: types.REMOVE_CURRENT_BLOCK
    };
    const expected = Object.assign({},
      initialState,
      {
        blocks: [],
        editing: {
          commands: [
            newCommand
          ],
          filterCommands: [
            {
              command: "", 
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
      }
    )
    expect(reducer(init, action)).toEqual(expected);
  })

  it('should edit new block', () => {
    const init = Object.assign({},
      initialState,
      {
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
              id: 1,
              name: 'newTest'
            },
            hasUnsaved: false,
            selectedIndex: -1
          }
        }
      }
    )
    const action = {
      type: types.EDIT_NEW_BLOCK
    };
    const expected = Object.assign({},
      initialState,
      {
        status: 'BLOCKS',
        editing: {
          commands: [
            newCommand
          ],
          meta: {
            src: null,
            hasUnsaved: true,
            isNewSave: true,
            selectedIndex: -1
          }
        }
      }
    )
    expect(reducer(init, action)).toEqual(expected);
  })
});
