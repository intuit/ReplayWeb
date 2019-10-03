import reducer from '../../src/reducers/editor';
import {initialState, updateHasUnSaved} from '../../src/reducers/editor';
import {types} from '../../src/actions/action_types';
import * as C from '../../src/common/constant';
import {newCommand} from '../../src/common/commands';

describe('editor reducer', () => {
  it('should do nothing if invalid action', () => {
    const action = {
      type: 'INVALID'
    };
    const expected = Object.assign({},
      initialState
    )
    expect(reducer(initialState, action)).toEqual(expected);
  })
  it('should set editing', () => {
    const action = {
      type: types.SET_EDITING,
      data: {
        commands: [
          {
            cmd: 'open',
            target: 'some website',
            value: '{}'
          }
        ],
        filterCommands:[],
        meta: {
          src: {
            id: 1,
            name: 'newTest'
          },
          hasUnsaved: false,
          selectedIndex: 0
        }
      },
    };
    const expected = Object.assign({},
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
            selectedIndex: 0
          }
        }
      }
    )
    expect(reducer(initialState, action)).toEqual(expected);
  })
  it('should set editing', () => {
    const action = {
      type: types.SET_EDITING,
    };
    const expected = Object.assign({},
      initialState,
      {
        editing: {
          commands: [
            newCommand
          ],
          filterCommands: [
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
    expect(reducer(initialState, action)).toEqual(expected);
  })
  it('should set editor status', () => {
    const action = {
      type: types.SET_EDITOR_STATUS,
      data: 'potatoes'
    };
    const expected = Object.assign({},
      initialState,
      {
        status: 'potatoes',
        editing: {
          commands: [
            newCommand
          ],
          filterCommands:[],
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
  it('should set next test', () => {
    const action = {
      type: types.NEXT_TEST,
      id: 1
    };
    const expected = Object.assign({},
      initialState,
      {
        nextTest: 1,
        editing: {
          commands: [
            newCommand
          ],
          filterCommands:[],
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
  it('should set next block', () => {
    const action = {
      type: types.NEXT_BLOCK,
      id: 1
    };
    const expected = Object.assign({},
      initialState,
      {
        nextBlock: 1,
        editing: {
          commands: [
            newCommand
          ],
          filterCommands:[],
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
  it('should set next suite', () => {
    const action = {
      type: types.NEXT_SUITE,
      id: 1
    };
    const expected = Object.assign({},
      initialState,
      {
        nextSuite: 1,
        editing: {
          commands: [
            newCommand
          ],
          filterCommands:[],
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
  it('should set inspect target', () => {
    const action = {
      type: types.INSPECT_TARGET,
      target: 'id=testId'
    };
    const expected = Object.assign({},
      initialState,
      {
        inspectTarget: 'id=testId',
        editing: {
          commands: [
            newCommand
          ],
          filterCommands:[],
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
  it('should select project', () => {
    const action = {
      type: types.SELECT_PROJECT,
      data: 'potato'
    };
    const expected = Object.assign({},
      initialState,
      {
        project: 'potato',
        editing: {
          commands: [
            newCommand
          ],
          filterCommands:[],
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
  it('should list projects', () => {
    const action = {
      type: types.LIST_PROJECTS,
      data: ['potato', 'tomato']
    };
    const expected = Object.assign({},
      initialState,
      {
        projects: ['potato', 'tomato'],
        editing: {
          commands: [
            newCommand
          ],
          filterCommands:[],
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
  });
  it('should show context menu', () => {
    const action = {
      type: types.SHOW_CONTEXT_MENU,
      data: {
        x: 1,
        y: 2,
        isShown: true,
        commandIndex: 1
      }
    };
    const expected = Object.assign({},
      initialState,
      {
        contextMenu: {
          x: 1,
          y: 2,
          isShown: true,
          commandIndex: 1
        }
      }
    )
    expect(reducer(initialState, action)).toEqual(expected);
  });
  it('should hide context menu', () => {
    const action = {
      type: types.HIDE_CONTEXT_MENU
    };
    const expected = Object.assign({},
      initialState,
      {
        contextMenu: {
          x: null,
          y: null,
          isShown: false
        }
      }
    )
    expect(reducer(initialState, action)).toEqual(expected);
  });
  describe('updateHasUnSaved', () => {
    it('should update hasUnsaved for tests', () => {
      const init = Object.assign(
        {},
        initialState,
        {
          editing: {
            commands: [
              {
                command: 'open',
                parameters: {
                  url: 'example.net'
                }
              }
            ],
            filterCommands: [],
            meta: {
              src: {
                id: 1,
                name: ''
              },
              hasUnsaved: true,
              selectedIndex: -1
            }
          },
          testCases: [
            {
              id: 1,
              name: '',
              data: {
                commands: [
                  {
                    command: 'open',
                    parameters: {
                      url: 'example.com'
                    }
                  }
                ]
              }
            }
          ],
          blocks: [
            {
              id: 1,
              name: '',
              data: {
                commands: [
                  {
                    command: 'open',
                    parameters: {
                      url: 'example.com'
                    }
                  }
                ]
              }
            },
          ],
          suites: [
            {
              id: 1,
              name: '',
              data: {
                tests: [
                  'test1'
                ]
              }
            }
          ]
        }
      )
      const nextState = updateHasUnSaved(init)
      expect(nextState.editing.meta.hasUnsaved.commands).toEqual(true)
    })
    it('should update hasUnsaved for blocks', () => {
      const init = Object.assign(
        {},
        initialState,
        {
          status: 'BLOCKS',
          editing: {
            commands: [
              {
                command: 'open',
                parameters: {
                  url: 'example.net'
                }
              }
            ],
            filterCommands: [],
            meta: {
              src: {
                id: 1,
                name: ''
              },
              hasUnsaved: true,
              selectedIndex: -1
            }
          },
          testCases: [
            {
              id: 1,
              name: '',
              data: {
                commands: [
                  {
                    command: 'open',
                    parameters: {
                      url: 'example.com'
                    }
                  }
                ]
              }
            }
          ],
          blocks: [
            {
              id: 1,
              name: '',
              data: {
                commands: [
                  {
                    command: 'open',
                    parameters: {
                      url: 'example.com'
                    }
                  }
                ]
              }
            },
          ],
          suites: [
            {
              id: 1,
              name: '',
              data: {
                tests: [
                  'test1'
                ]
              }
            }
          ]
        }
      )
      const nextState = updateHasUnSaved(init)
      expect(nextState.editing.meta.hasUnsaved.commands).toEqual(true)
    })
    it('should update hasUnsaved for suites', () => {
      const init = Object.assign(
        {},
        initialState,
        {
          status: 'SUITES',
          editing: {
            tests: [
              'test2'
            ],
            filterCommands: [],
            meta: {
              src: {
                id: 1,
                name: ''
              },
              hasUnsaved: true,
              selectedIndex: -1
            }
          },
          testCases: [
            {
              id: 1,
              name: '',
              data: {
                commands: [
                  {
                    command: 'open',
                    parameters: {
                      url: 'example.com'
                    }
                  }
                ]
              }
            }
          ],
          blocks: [
            {
              id: 1,
              name: '',
              data: {
                commands: [
                  {
                    command: 'open',
                    parameters: {
                      url: 'example.com'
                    }
                  }
                ]
              }
            },
          ],
          suites: [
            {
              id: 1,
              name: '',
              data: {
                tests: [
                  'test1'
                ]
              }
            }
          ]
        }
      )
      const nextState = updateHasUnSaved(init)
      expect(nextState.editing.meta.hasUnsaved.tests).toEqual(true)
    })
  })
});
