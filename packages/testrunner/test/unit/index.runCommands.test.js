import { runCommands, __RewireAPI__ as runCommandsRewire } from '../../src'

describe('runCommands', () => {
  const fakeHooks = {
    beforeTest: {
      promise: () => { }
    },
    afterTest: {
      promise: () => { }
    }
  }
  beforeEach(() => {
    global.browser = {}
    // Setup mocks for other functions from testrunner
    runCommandsRewire.__Rewire__('runCommand', s => Promise.resolve(s))
    runCommandsRewire.__Rewire__('makeHooks', () => fakeHooks)
  })
  afterEach(() => {
    runCommandsRewire.__ResetDependency__('runCommand')
  })
  it('should run commands for testDef', () => {
    const testDef = {
      commands: [
        {
          command: 'open',
          parameters: {
            url: "https://example.com"
          }
        },
        {
          command: 'click',
          parameters: {
            target: 'id=1'
          }
        }
      ]
    }
    return expect(runCommands(testDef)).resolves.toHaveProperty('command', 'click')
  })
  it('should run commands for testDef with a delay', () => {
    const testDef = {
      commands: [
        {
          command: 'open',
          parameters: {
            url: "https://example.com"
          }
        },
        {
          command: 'click',
          parameters: {
            target: 'id=1'
          }
        }
      ]
    }
    return expect(runCommands(testDef, 7000, 1000)).resolves.toEqual(true)
  })
  it('should throw error if no Commands in testDef', () => {
    const testDef = {
      CreatedDate: '6/29/18'
    }
    return expect(runCommands(testDef)).rejects.toHaveProperty('message', 'Cannot read property \'reduce\' of undefined')
  })
  it('should call beforeTest hook', async () => {
    const beforeTestMock = jest.fn()
    const hooks = {
      ...fakeHooks,
      beforeTest: {
        promise: beforeTestMock
      }
    }
    runCommandsRewire.__ResetDependency__('makeHooks')
    runCommandsRewire.__Rewire__('makeHooks', () => hooks)
    const testDef = {
      commands: [
        {
          command: 'open',
          parameters: {
            url: "https://example.com"
          }
        },
        {
          command: 'click',
          parameters: {
            target: 'id=1'
          }
        }
      ]
    }
    await expect(runCommands(testDef)).resolves.toHaveProperty('command', 'click')
    expect(beforeTestMock).toHaveBeenCalledTimes(1)
  })
  it('should call afterTest hook', async () => {
    const beforeTestMock = jest.fn()
    const afterTestMock = jest.fn()
    const hooks = {
      ...fakeHooks,
      beforeTest: {
        promise: beforeTestMock
      },
      afterTest: {
        promise: afterTestMock
      }
    }
    runCommandsRewire.__ResetDependency__('makeHooks')
    runCommandsRewire.__Rewire__('makeHooks', () => hooks)
    const testDef = {
      commands: [
        {
          command: 'open',
          parameters: {
            url: "https://example.com"
          }
        },
        {
          command: 'click',
          parameters: {
            target: 'id=1'
          }
        }
      ]
    }
    await expect(runCommands(testDef)).resolves.toHaveProperty('command', 'click')
    expect(beforeTestMock).toHaveBeenCalledTimes(1)
    expect(afterTestMock).toHaveBeenCalledTimes(1)
  })
  it('should trigger onError hook if there is an error in the test', async () => {
    const onErrorMock = jest.fn()
    const beforeTestMock = jest.fn()
    const hooks = {
      ...fakeHooks,
      onError: {
        promise: onErrorMock
      },
      beforeTest: {
        promise: beforeTestMock
      }
    }
    runCommandsRewire.__ResetDependency__('makeHooks')
    runCommandsRewire.__Rewire__('makeHooks', () => hooks)
    runCommandsRewire.__ResetDependency__('runCommand')
    runCommandsRewire.__Rewire__('runCommand', (c) => Promise.reject('runCommand failed'))
    const testDef = {
      commands: [
        {
          command: 'open',
          parameters: {
            url: "https://example.com"
          }
        },
        {
          command: 'click',
          parameters: {
            target: 'id=1'
          }
        }
      ]
    }
    await expect(runCommands(testDef)).rejects.toBe('runCommand failed')
    expect(beforeTestMock).toHaveBeenCalledTimes(1)
    expect(onErrorMock).toHaveBeenCalledTimes(1)
  })
  it('should trigger onAfterTest hook with metadata', async () => {
    const afterTestMock = jest.fn()
    const hooks = {
      ...fakeHooks,
      afterTest: {
        promise: afterTestMock
      }
    }
    runCommandsRewire.__ResetDependency__('makeHooks')
    runCommandsRewire.__Rewire__('makeHooks', () => hooks)
    const testDef = {
      commands: [
        {
          command: 'open',
          parameters: {
            url: "https://example.com"
          }
        },
        {
          command: 'click',
          parameters: {
            target: 'id=1'
          }
        }
      ],
      metadata: {
        title: 'title',
        overview: 'overview'
      }
    }
    await expect(runCommands(testDef)).resolves.toHaveProperty('command', 'click')
    expect(afterTestMock).toHaveBeenCalledWith('', {}, {}, {title: 'title', overview: 'overview'})
    expect(afterTestMock).toHaveBeenCalledTimes(1)
  })
})
