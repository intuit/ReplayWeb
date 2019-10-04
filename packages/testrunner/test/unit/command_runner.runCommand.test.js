import fetchMock from 'fetch-mock'

import { runCommand, __RewireAPI__ as runCommandRewire } from '../../src/command_runner'

const hookMock = {
  beforeCommand: {
    promise: async () => {}
  },
  onElement: {
    promise: async () => {}
  }
}
describe('runCommand', () => {
  const makeFakeElement = (fail = false, msg = 'fakeError') => ({
    waitForExist: timeout => fail ? Promise.reject(msg) : Promise.resolve(true),
    waitForDisplayed: timeout => fail ? Promise.reject(msg) : Promise.resolve(true)
  })
  beforeEach(() => {
    global.browser = {}
    // global.expect = expect
    // Setup mocks for other functions from testrunner
    runCommandRewire.__Rewire__('doReplace', s => Promise.resolve(s))
    runCommandRewire.__Rewire__('log', () => {}) // don't log for tests
    runCommandRewire.__Rewire__('getSelector', target => target)
    runCommandRewire.__Rewire__('getExecElString', (sel) => {
      return 'document.querySelector(\'' + sel + '\')'
    })
  })
  afterEach(() => {
    runCommandRewire.__ResetDependency__('doReplace')
    runCommandRewire.__ResetDependency__('getSelector')
    runCommandRewire.__ResetDependency__('getExecElString')
    runCommandRewire.__ResetDependency__('log')
    fetchMock.restore()
  })
  it('should throw error for unsupported command', () => {
    const c = {
      command: 'fakeCommand',
      parameters: {}
    }
    return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
  })
  describe('ASSERTIONS', () => {
    describe('assertAttribute', () => {
      it('should run assertAttribute command', () => {
        const c = {
          command: 'assertAttribute',
          parameters: {
            target: 'id=potato',
            attribute: 'name',
            expected: 'yams'
          }
        }
        const el = {
          ...makeFakeElement(),
          getAttribute: () => Promise.resolve('yams')
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should run assertAttribute command with regex', () => {
        const c = {
          command: 'assertAttribute',
          parameters: {
            target: 'id=potato',
            attribute: 'name',
            expected: '/y.*/'
          }
        }
        const el = {
          ...makeFakeElement(),
          getAttribute: () => Promise.resolve('yams')
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject assertAttribute command with regex that doesnt match', () => {
        const c = {
          command: 'assertAttribute',
          parameters: {
            target: 'id=potato',
            attribute: 'name',
            expected: '/ya{2}ms/'
          }
        }
        const el = {
          ...makeFakeElement(),
          getAttribute: () => Promise.resolve('yams')
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
      it('should reject assertAttribute command', () => {
        const c = {
          command: 'assertAttribute',
          parameters: {
            target: 'id=potato',
            attribute: 'name',
            expected: 'yams'
          }
        }
        const el = {
          ...makeFakeElement(),
          getAttribute: () => Promise.resolve('notyams')
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('assertCheckboxState', () => {
      it('should run assertCheckboxState command', () => {
        const c = {
          command: 'assertCheckboxState',
          parameters: {
            target: 'id=test',
            expected: true
          }
        }
        const el = {
          ...makeFakeElement(),
          getAttribute: (at) => {
            switch (at) {
              case 'type':
                return Promise.resolve('checkbox')
              case 'checked':
                return Promise.resolve('true')
            }
          }
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })

      it('should reject assertCheckboxState command', () => {
        const c = {
          command: 'assertCheckboxState',
          parameters: {
            target: 'id=test',
            expected: false
          }
        }
        const el = {
          ...makeFakeElement(),
          getAttribute: (at) => {
            switch (at) {
              case 'type':
                return Promise.resolve('checkbox')
              case 'checked':
                return Promise.resolve(true)
            }
          }
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })

      it('should run assertCheckboxState command for false', () => {
        const c = {
          command: 'assertCheckboxState',
          parameters: {
            target: 'id=test',
            expected: false
          }
        }
        const el = {
          ...makeFakeElement(),
          getAttribute: (at) => {
            switch (at) {
              case 'type':
                return Promise.resolve('checkbox')
              case 'checked':
                return Promise.resolve(null)
            }
          }
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })

      it('should reject assertCheckboxState command (inverted)', () => {
        const c = {
          command: 'assertCheckboxState',
          parameters: {
            target: 'id=test',
            expected: true
          }
        }
        const el = {
          ...makeFakeElement(),
          getAttribute: (at) => {
            switch (at) {
              case 'type':
                return Promise.resolve('checkbox')
              case 'checked':
                return Promise.resolve(null)
            }
          }
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })

      it('should handle non checkbox elements', () => {
        const c = {
          command: 'assertCheckboxState',
          parameters: {
            target: 'id=test',
            expected: true
          }
        }
        const el = {
          ...makeFakeElement()
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('assertClassDoesNotExist', () => {
      it('should run assertClassDoesNotExist command', () => {
        const c = {
          command: 'assertClassDoesNotExist',
          parameters: {
            target: 'id=test',
            class: 'test-class'
          }
        }
        const el = {
          ...makeFakeElement(),
          getAttribute: () => Promise.resolve('not-test-class another-fake-class')
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject assertClassDoesNotExist command', () => {
        const c = {
          command: 'assertClassDoesNotExist',
          parameters: {
            target: 'id=test',
            class: 'test-class'
          }
        }
        const el = {
          ...makeFakeElement(),
          getAttribute: () => Promise.resolve('test-class another-fake-class')
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('assertClassExists', () => {
      it('should run assertClassExists command', () => {
        const c = {
          command: 'assertClassExists',
          parameters: {
            target: 'id=test',
            class: 'test-class'
          }
        }
        const el = {
          ...makeFakeElement(),
          getAttribute: () => Promise.resolve('test-class another-fake-class')
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject assertClassExists command', () => {
        const c = {
          command: 'assertClassExists',
          parameters: {
            target: 'id=test',
            class: 'test-class'
          }
        }
        const el = {
          ...makeFakeElement(),
          getAttribute: () => Promise.resolve('not-test-class another-fake-class')
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('assertElementPresent', () => {
      it('should run assertElementPresent command', () => {
        const c = {
          command: 'assertElementPresent',
          parameters: {
            target: 'id=test'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should run assertElementPresent command with custom timeout', () => {
        const c = {
          command: 'assertElementPresent',
          parameters: {
            target: 'id=test',
            timeout: '2000'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject assertElementPresent command', () => {
        const c = {
          command: 'assertElementPresent',
          parameters: {
            target: 'id=test'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement(true))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('assertElementNotPresent', () => {
      it('should run assertElementNotPresent command', () => {
        const c = {
          command: 'assertElementNotPresent',
          parameters: {
            target: 'id=test'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should run assertElementNotPresent command with custom timeout', () => {
        const c = {
          command: 'assertElementNotPresent',
          parameters: {
            target: 'id=test',
            timeout: '2000'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject assertElementNotPresent command', () => {
        const c = {
          command: 'assertElementNotPresent',
          parameters: {
            target: 'id=test'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement(true))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('assertElementVisible', () => {
      it('should run assertElementVisible command', () => {
        const c = {
          command: 'assertElementVisible',
          parameters: {
            target: 'id=test'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should run assertElementVisible command with custom timeout', () => {
        const c = {
          command: 'assertElementVisible',
          parameters: {
            target: 'id=test',
            timeout: '2000'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject assertElementVisible command', () => {
        const c = {
          command: 'assertElementVisible',
          parameters: {
            target: 'id=test'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement(true))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('assertElementNotVisible', () => {
      it('should run assertElementNotVisible command', () => {
        const c = {
          command: 'assertElementNotVisible',
          parameters: {
            target: 'id=test'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should run assertElementNotVisible command with custom timeout', () => {
        const c = {
          command: 'assertElementNotVisible',
          parameters: {
            target: 'id=test',
            timeout: '2000'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject assertElementNotVisible command', () => {
        const c = {
          command: 'assertElementNotVisible',
          parameters: {
            target: 'id=test'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement(true))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('assertLocalStorage', () => {
      it('should run assertLocalStorage command', () => {
        const c = {
          command: 'assertLocalStorage',
          parameters: {
            key: 'test',
            expected: 'testValue'
          }
        }
        global.browser.execute = (s) => Promise.resolve('testValue')
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject assertLocalStorage command', () => {
        const c = {
          command: 'assertLocalStorage',
          parameters: {
            key: 'test',
            expected: 'testValue'
          }
        }
        global.browser.execute = (s) => Promise.reject(new Error('key not found'))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('assertSessionStorage', () => {
      it('should run assertSessionStorage command', () => {
        const c = {
          command: 'assertSessionStorage',
          parameters: {
            key: 'test',
            expected: 'testValue'
          }
        }
        global.browser.execute = (s) => Promise.resolve('testValue')
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject assertSessionStorage command', () => {
        const c = {
          command: 'assertSessionStorage',
          parameters: {
            key: 'test',
            expected: 'testValue'
          }
        }
        global.browser.execute = (s) => Promise.reject(new Error('key not found'))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('assertStyle', () => {
      it('should run assertStyle command', () => {
        const c = {
          command: 'assertStyle',
          parameters: {
            target: 'id=test',
            property: 'height',
            expected: 'testValue'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        global.browser.execute = (s) => Promise.resolve('testValue')
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should run assertStyle command for non id', () => {
        const c = {
          command: 'assertStyle',
          parameters: {
            target: 'css=testClass',
            property: 'height',
            expected: 'testValue'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        global.browser.execute = (s) => Promise.resolve('testValue')
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject assertStyle command if execute has an error', () => {
        const c = {
          command: 'assertStyle',
          parameters: {
            target: 'id=test',
            expected: 'testValue'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        global.browser.execute = (s) => Promise.reject(new Error('cssError'))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
      it('should reject assertStyle command if property does not exist', () => {
        const c = {
          command: 'assertStyle',
          parameters: {
            target: 'id=test',
            expected: 'testValue'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        global.browser.execute = (s) => Promise.resolve(undefined)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
      it('should reject assertStyle command if values do not match', () => {
        const c = {
          command: 'assertStyle',
          parameters: {
            target: 'id=test',
            expected: 'testValue'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        global.browser.execute = (s) => Promise.resolve('notTestValue')
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('assertText', () => {
      it('should run assertText command', () => {
        const c = {
          command: 'assertText',
          parameters: {
            target: 'id=test',
            expected: 'testText'
          }
        }
        const el = {
          ...makeFakeElement(),
          getText: () => Promise.resolve('testText'),
          getValue: () => Promise.resolve('')
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should run assertText command with default expectation', () => {
        const c = {
          command: 'assertText',
          parameters: {
            target: 'id=test'
          }
        }
        const el = {
          ...makeFakeElement(),
          getText: () => Promise.resolve(''),
          getValue: () => Promise.resolve('')
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject assertText command if getText fails', () => {
        const c = {
          command: 'assertText',
          parameters: {
            target: 'id=test',
            expected: 'testText'
          }
        }
        const el = {
          ...makeFakeElement(),
          getText: () => Promise.reject(new Error('notTestText')),
          getValue: () => Promise.resolve('')
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
      it('should reject assertText command if getValue fails', () => {
        const c = {
          command: 'assertText',
          parameters: {
            target: 'id=test',
            expected: 'testText'
          }
        }
        const el = {
          ...makeFakeElement(),
          getText: () => Promise.resolve('testText'),
          getValue: () => Promise.reject(new Error('notTestText'))
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
      it('should run assertText command with regex', () => {
        const c = {
          command: 'assertText',
          parameters: {
            target: 'id=test',
            expected: '/\\d/'
          }
        }
        const el = {
          ...makeFakeElement(),
          getText: () => Promise.resolve('9'),
          getValue: () => Promise.resolve('')
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should run assertText command with regex and an input field', () => {
        const c = {
          command: 'assertText',
          parameters: {
            target: 'id=test',
            expected: '/\\d/'
          }
        }
        const el = {
          ...makeFakeElement(),
          getText: () => Promise.resolve(''),
          getValue: () => Promise.resolve('9')
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject assertText command with regex and an input field and both are empty', () => {
        const c = {
          command: 'assertText',
          parameters: {
            target: 'id=test',
            expected: '/\\d/'
          }
        }
        const el = {
          ...makeFakeElement(),
          getText: () => Promise.resolve(''),
          getValue: () => Promise.resolve('')
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('assertTitle', () => {
      it('should run assertTitle command', () => {
        const c = {
          command: 'assertTitle',
          parameters: {
            expected: 'testTitle'
          }
        }
        global.browser.getTitle = () => Promise.resolve('testTitle')
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject assertTitle command', () => {
        const c = {
          command: 'assertTitle',
          parameters: {
            expected: 'testTitle'
          }
        }
        global.browser.getTitle = () => Promise.reject(new Error('notTestTitle'))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('assertUrl', () => {
      it('should run assertUrl command', () => {
        const c = {
          command: 'assertUrl',
          parameters: {
            expected: 'https://example.com'
          }
        }
        global.browser.getUrl = () => Promise.resolve('https://example.com')
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject assertUrl command', () => {
        const c = {
          command: 'assertUrl',
          parameters: {
            expected: 'https://example.com'
          }
        }
        global.browser.getUrl = () => Promise.reject(new Error('http://potato.com'))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('assertJsonInContext', () => {
      it('should assert string in context', () => {
        const c = {
          command: 'assertJsonInContext',
          parameters: {
            key: 'testJson',
            expected: 'test'
          }
        }
        const ctx = {
          testJson: 'test'
        }
        return expect(runCommand(c, ctx, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should assert json in context', () => {
        const c = {
          command: 'assertJsonInContext',
          parameters: {
            key: 'testJson',
            expected: { color: 'red' }
          }
        }
        const ctx = {
          testJson: { color: 'red' }
        }
        return expect(runCommand(c, ctx, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should assert string', () => {
        const c = {
          command: 'assertJsonInContext',
          parameters: {
            key: 'testJson',
            expected: 'test2'
          }
        }
        const ctx = {
          testJson: 'test'
        }
        return expect(runCommand(c, ctx, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('filterJsonInContext', () => {
      it('should run filterJsonInContext command', () => {
        const c = {
          command: 'filterJsonInContext',
          parameters: {
            key: 'testJson',
            resultKey: 'filteredJson'
          }
        }
        const ctx = {
          testJson: { apple: { type: 'pome', color: 'red' }, orange: { type: 'citrus', color: 'orange' } }
        }
        return runCommand(c, ctx, 1000, hookMock)
          .then(() => expect(JSON.stringify(ctx.filteredJson)).toEqual(JSON.stringify({ apple: { type: 'pome', color: 'red' }, orange: { type: 'citrus', color: 'orange' } })))
      })
      it('should locate intermediate node', () => {
        const c = {
          command: 'filterJsonInContext',
          parameters: {
            key: 'testJson',
            resultKey: 'filteredJson',
            locateNode: ['apple']
          }
        }
        const ctx = {
          testJson: { apple: { type: 'pome', color: 'red' }, orange: { type: 'citrus', color: 'orange' } }
        }
        return runCommand(c, ctx, 1000, hookMock)
          .then(() => expect(JSON.stringify(ctx.filteredJson)).toEqual(JSON.stringify({ type: 'pome', color: 'red' })))
      })
      it('should locate leaf node', () => {
        const c = {
          command: 'filterJsonInContext',
          parameters: {
            key: 'testJson',
            resultKey: 'filteredJson',
            locateNode: ['apple', 'type']
          }
        }
        const ctx = {
          testJson: { apple: { type: 'pome', color: 'red' }, orange: { type: 'citrus', color: 'orange' } }
        }
        return runCommand(c, ctx, 1000, hookMock)
          .then(() => expect(ctx.filteredJson).toEqual('pome'))
      })
      it('should ignore nodes', () => {
        const c = {
          command: 'filterJsonInContext',
          parameters: {
            key: 'testJson',
            resultKey: 'filteredJson',
            deleteNodes: [['apple', 'type'], ['orange', 'color']]
          }
        }
        const ctx = {
          testJson: { apple: { type: 'pome', color: 'red' }, orange: { type: 'citrus', color: 'orange' } }
        }
        return runCommand(c, ctx, 1000, hookMock)
          .then(() => expect(JSON.stringify(ctx.filteredJson)).toEqual(JSON.stringify({ apple: { color: 'red' }, orange: { type: 'citrus' } })))
      })
      it('should locate node & ignore nodes', () => {
        const c = {
          command: 'filterJsonInContext',
          parameters: {
            key: 'testJson',
            resultKey: 'filteredJson',
            locateNode: ['apple'],
            deleteNodes: [['type']]
          }
        }
        const ctx = {
          testJson: { apple: { type: 'pome', color: 'red' }, orange: { type: 'citrus', color: 'orange' } }
        }
        return runCommand(c, ctx, 1000, hookMock)
          .then(() => expect(JSON.stringify(ctx.filteredJson)).toEqual(JSON.stringify({ color: 'red' })))
      })
    })
  })
  describe('COMMANDS', () => {
    describe('captureScreenshot', () => {
      it('should run captureScreenshot command', () => {
        const c = {
          command: 'captureScreenshot',
          parameters: {}
        }
        global.browser.takeScreenshot = () => Promise.resolve('test.jpg')
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject captureScreenshot command', () => {
        const c = {
          command: 'captureScreenshot',
          parameters: {}
        }
        global.browser.takeScreenshot = () => Promise.reject(new Error('fakeError'))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('clearValue', () => {
      it('should run clearValue command', () => {
        const c = {
          command: 'clearValue',
          parameters: {
            target: 'id=test'
          }
        }
        const el = {
          ...makeFakeElement(),
          clearValue: (v) => Promise.resolve(true)
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject clearValue command if browser.clearValue fails', () => {
        const c = {
          command: 'clearValue',
          parameters: {
            target: 'id=test'
          }
        }
        const el = {
          ...makeFakeElement(),
          clearValue: () => Promise.reject(new Error('fakeError'))
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('click', () => {
      it('should run click command', () => {
        const c = {
          command: 'click',
          parameters: {
            target: 'id=test'
          }
        }
        const el = {
          ...makeFakeElement(),
          click: () => Promise.resolve(true)
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject click command if click throws error', () => {
        const c = {
          command: 'click',
          parameters: {
            target: 'id=test'
          }
        }
        const el = {
          ...makeFakeElement(),
          click: () => Promise.reject(new Error('fakeError'))
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('debug', () => {
      afterEach(() => {
      })
      it('should run debug command', () => {
        const c = {
          command: 'debug',
          parameters: {}
        }
        global.browser.debug = () => Promise.resolve(true)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject debug command if browser.debug fails', () => {
        const c = {
          command: 'debug',
          parameters: {}
        }
        global.browser.debug = () => Promise.reject(new Error('fakeError'))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('deleteAllCookies', () => {
      it('should run deleteAllCookies command', () => {
        const c = {
          command: 'deleteAllCookies',
          parameters: {}
        }
        global.browser.deleteCookies = () => Promise.resolve(true)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject deleteAllCookies command', () => {
        const c = {
          command: 'deleteAllCookies',
          parameters: {}
        }
        global.browser.deleteCookies = () => Promise.reject(new Error('fakeError'))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('dragAndDropToObject', () => {
      it('should run dragAndDropToObject command', () => {
        const c = {
          command: 'dragAndDropToObject',
          parameters: {
            startTarget: 'id=test1',
            endTarget: 'id=test2'
          }
        }
        const el = {
          ...makeFakeElement(),
          dragAndDrop: () => Promise.resolve(true)
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject dragAndDropToObject command', () => {
        const c = {
          command: 'dragAndDropToObject',
          parameters: {
            startTarget: 'id=test1',
            endTarget: 'id=test2'
          }
        }
        const el = {
          ...makeFakeElement(),
          dragAndDrop: () => Promise.reject(new Error('fakeError'))
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('http', () => {
      it('should run GET http command and store result in context', () => {
        fetchMock.get('testUrl', {
          testResponse: true
        })
        const c = {
          command: 'http',
          parameters: {
            url: 'testUrl',
            key: 'testKey'
          }
        }
        const ctx = {}
        return runCommand(c, ctx, 1000, hookMock)
          .then(() => expect(ctx.testKey.testResponse).toBe(true))
      })
      it('should run POST http command and store result in context', () => {
        fetchMock.post('testUrl', {
          testResponse: true
        })
        const c = {
          command: 'http',
          parameters: {
            method: 'POST',
            url: 'testUrl',
            key: 'testKey',
            body: {
              key1: 'value1'
            }
          }
        }
        const ctx = {}
        return runCommand(c, ctx, 1000, hookMock)
          .then(() => expect(ctx.testKey.testResponse).toBe(true))
      })
      it('should reject command if fetch fails', () => {
        fetchMock.get('testUrl', 500)
        const c = {
          command: 'http',
          parameters: {
            url: 'testUrl',
            key: 'testKey',
            body: {
              key1: 'value1'
            }
          }
        }
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('mouseOver', () => {
      it('should run mouseOver command', () => {
        const c = {
          command: 'mouseOver',
          parameters: {
            target: 'id=test'
          }
        }
        const el = {
          ...makeFakeElement(),
          moveTo: () => Promise.resolve(true)
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject mouseOver command', () => {
        const c = {
          command: 'mouseOver',
          parameters: {
            target: 'id=test'
          }
        }
        const el = {
          ...makeFakeElement(),
          dragAndDrop: () => Promise.reject(new Error('fakeError'))
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('mouseEvent', () => {
      it('should run mouseEvent command', () => {
        const c = {
          command: 'mouseEvent',
          parameters: {
            target: 'id=test'
          }
        }
        const events = []
        global.browser.execute = (s) => {
          events.push(s)
          return Promise.resolve(true)
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        // return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
        return runCommand(c, {}, 1000, hookMock)
          .then(() => expect(events[0]).toEqual('document.querySelector(\'id=test\').dispatchEvent(new MouseEvent("mouseover", { bubbles: true }))'))
          .then(() => expect(events[1]).toEqual('document.querySelector(\'id=test\').dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))'))
          .then(() => expect(events[2]).toEqual('document.querySelector(\'id=test\').dispatchEvent(new MouseEvent("mouseup", { bubbles: true }))'))
          .then(() => expect(events[3]).toEqual('document.querySelector(\'id=test\').dispatchEvent(new MouseEvent("click", { bubbles: true }))'))
      })
      it('should reject mouseEvent command if execute fails', () => {
        const c = {
          command: 'mouseEvent',
          parameters: {
            target: 'id=test'
          }
        }
        global.browser.execute = (s) => Promise.reject(new Error('fakeError'))
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
      it('should reject mouseEvent command if waitForExist and waitForVisible fail', () => {
        const c = {
          command: 'mouseEvent',
          parameters: {
            target: 'id=test'
          }
        }
        const events = []
        global.browser.execute = (s) => {
          events.push(s)
          return Promise.resolve(true)
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement(true))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
      it('should run mouseEvent command even if target doesnt have dispatchEvent', () => {
        const c = {
          command: 'mouseEvent',
          parameters: {
            target: 'id=test'
          }
        }
        global.browser.execute = (s) => Promise.reject(new Error('Cannot read property \'dispatchEvent\' of null'))
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeUndefined()
      })
      it('should reject mouseEvent command if error is not about dispatchEvent', () => {
        const c = {
          command: 'mouseEvent',
          parameters: {
            target: 'id=test'
          }
        }
        global.browser.execute = (s) => Promise.reject(new Error('fakeError'))
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('open', () => {
      it('should run open command', () => {
        const c = {
          command: 'open',
          parameters: {
            url: 'https://example.com'
          }
        }
        global.browser.url = () => Promise.resolve(true)
        global.browser.pause = () => Promise.resolve(true)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject open command if browser.url fails', () => {
        const c = {
          command: 'open',
          parameters: {
            url: 'https://example.com'
          }
        }
        global.browser.url = () => Promise.reject(new Error('fakeError'))
        global.browser.pause = () => Promise.resolve(true)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
      it('should reject open command if browser.pause fails', () => {
        const c = {
          command: 'open',
          parameters: {
            url: 'https://example.com'
          }
        }
        global.browser.url = () => Promise.resolve(true)
        global.browser.pause = () => Promise.reject(new Error('fakeError'))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('pause', () => {
      it('should run pause command', () => {
        const c = {
          command: 'pause',
          parameters: {
            millis: 1000
          }
        }
        global.browser.pause = (t) => Promise.resolve(t)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toEqual(1000)
      })
      it('should run pause command with default value if value is not a number', () => {
        const c = {
          command: 'pause',
          parameters: {
            millis: '{}'
          }
        }
        global.browser.pause = (t) => Promise.resolve(t)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toEqual(3000)
      })
      it('should reject pause command if browser.pause fails', () => {
        const c = {
          command: 'pause',
          parameters: {
            millis: 1000
          }
        }
        global.browser.pause = () => Promise.reject(new Error('fakeError'))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('refresh', () => {
      it('should run refresh command', () => {
        const c = {
          command: 'refresh',
          parameters: {}
        }
        global.browser.refresh = () => Promise.resolve(true)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject refresh command if browser.refresh fails', () => {
        const c = {
          command: 'refresh',
          parameters: {}
        }
        global.browser.refresh = () => Promise.reject(new Error('fakeError'))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('select', () => {
      it('should run select command', () => {
        const c = {
          command: 'select',
          parameters: {
            target: 'id=test',
            value: 'testText'
          }
        }
        const el = {
          ...makeFakeElement(),
          selectByVisibleText: (t) => Promise.resolve(t)
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toEqual('testText')
      })
      it('should run select command and replace label=', () => {
        const c = {
          command: 'select',
          parameters: {
            target: 'id=test',
            value: 'label=testText'
          }
        }
        const el = {
          ...makeFakeElement(),
          selectByVisibleText: (t) => Promise.resolve(t)
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toEqual('testText')
      })
      it('should reject select command if browser.selectByVisibleText fails', () => {
        const c = {
          command: 'select',
          parameters: {
            target: 'id=test',
            value: 'testText'
          }
        }
        const el = {
          ...makeFakeElement(),
          selectByVisibleText: (t) => Promise.reject(new Error('fakeError'))
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('selectAndWait', () => {
      it('should run selectAndWait command', () => {
        const c = {
          command: 'selectAndWait',
          parameters: {
            target: 'id=test',
            value: 'testText'
          }
        }
        const el = {
          ...makeFakeElement(),
          selectByVisibleText: (t) => Promise.resolve(t)
        }
        global.browser.$ = () => Promise.resolve(el)
        global.browser.pause = () => Promise.resolve(true)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should run selectAndWait command and replace label=', () => {
        const c = {
          command: 'selectAndWait',
          parameters: {
            target: 'id=test',
            value: 'label=testText'
          }
        }
        const el = {
          ...makeFakeElement(),
          selectByVisibleText: (t) => Promise.resolve(t)
        }
        global.browser.$ = () => Promise.resolve(el)
        global.browser.pause = () => Promise.resolve(true)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject selectAndWait command if browser.selectByVisibleText fails', () => {
        const c = {
          command: 'selectAndWait',
          parameters: {
            target: 'id=test',
            value: 'testText'
          }
        }
        const el = {
          ...makeFakeElement(),
          selectByVisibleText: (t) => Promise.reject(new Error('fakeError'))
        }
        global.browser.$ = () => Promise.resolve(el)
        global.browser.pause = () => Promise.resolve(true)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
      it('should reject selectAndWait command if browser.pause fails', () => {
        const c = {
          command: 'selectAndWait',
          parameters: {
            target: 'id=test',
            value: 'testText'
          }
        }
        const el = {
          ...makeFakeElement(),
          selectByVisibleText: (t) => Promise.resolve(t)
        }
        global.browser.$ = () => Promise.resolve(el)
        global.browser.pause = () => Promise.reject(new Error('fakeError'))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('selectFrame', () => {
      it('should run selectFrame command with id', () => {
        const c = {
          command: 'selectFrame',
          parameters: {
            target: 'id=test'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        global.browser.switchToFrame = (t) => Promise.resolve(true)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should run selectFrame with index', () => {
        const c = {
          command: 'selectFrame',
          parameters: {
            target: 'index=2'
          }
        }
        global.browser.switchToFrame = (t) => Promise.resolve(true)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should run selectFrame with relative', () => {
        const c = {
          command: 'selectFrame',
          parameters: {
            target: 'relative=top'
          }
        }
        global.browser.switchToFrame = (t) => Promise.resolve(true)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject selectFrame command if element cant be found', () => {
        const c = {
          command: 'selectFrame',
          parameters: {
            target: 'id=test'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement(true))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
      it('should reject selectFrame command if browser.switchToFrame fails', () => {
        const c = {
          command: 'selectFrame',
          parameters: {
            target: 'id=test'
          }
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        global.browser.switchToFrame = () => Promise.reject(new Error('fakeError'))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('setContext', () => {
      it('should run setContext command', () => {
        const c = {
          command: 'setContext',
          parameters: {
            key: 'testKey',
            value: 'testValue'
          }
        }
        const ctx = {}
        return runCommand(c, ctx, 1000, hookMock)
          .then(() => expect(ctx.testKey).toEqual('testValue'))
      })
    })
    describe('setCookie', () => {
      it('should run setCookie command', () => {
        const c = {
          command: 'setCookie',
          parameters: {
            name: 'cookieName',
            value: 'cookieValue'
          }
        }
        global.browser.setCookies = (cookie) => Promise.resolve(cookie)
        return Promise.all([
          expect(runCommand(c, {}, 1000, hookMock)).resolves.toHaveProperty('name', 'cookieName'),
          expect(runCommand(c, {}, 1000, hookMock)).resolves.toHaveProperty('value', 'cookieValue'),
          expect(runCommand(c, {}, 1000, hookMock)).resolves.toHaveProperty('domain', '.example.com')
        ])
      })
      it('should run setCookie command with custom domain', () => {
        const c = {
          command: 'setCookie',
          parameters: {
            name: 'cookieName',
            value: 'cookieValue',
            domain: 'potatoes'
          }
        }
        global.browser.setCookies = (cookie) => Promise.resolve(cookie)
        return Promise.all([
          expect(runCommand(c, {}, 1000, hookMock)).resolves.toHaveProperty('name', 'cookieName'),
          expect(runCommand(c, {}, 1000, hookMock)).resolves.toHaveProperty('value', 'cookieValue'),
          expect(runCommand(c, {}, 1000, hookMock)).resolves.toHaveProperty('domain', 'potatoes')
        ])
      })
      it('should reject setCookie command if browser.setCookies fails', () => {
        const c = {
          command: 'setCookie',
          parameters: {
            name: 'cookieName',
            value: 'cookieValue'
          }
        }
        global.browser.setCookies = () => Promise.reject(new Error('fakeError'))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('setEnvironment', () => {
      it('should run setEnvironment command', () => {
        const c = {
          command: 'setEnvironment',
          parameters: {
            testKey: 'testValue',
            testKey2: 'testValue2'
          }
        }
        const ctx = {}
        return runCommand(c, ctx, 1000, hookMock)
          .then(() => expect(ctx.testKey).toEqual('testValue'))
          .then(() => expect(ctx.testKey2).toEqual('testValue2'))
      })
    })
    describe('setLocalStorage', () => {
      it('should run setLocalStorage command', () => {
        const c = {
          command: 'setLocalStorage',
          parameters: {
            key: 'testKey',
            value: 'testValue'
          }
        }
        global.browser.execute = () => Promise.resolve(true)
        global.browser.refresh = () => Promise.resolve(true)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject setLocalStorage command if browser.sessionStorage fails', () => {
        const c = {
          command: 'setLocalStorage',
          parameters: {
            key: 'testKey',
            value: 'testValue'
          }
        }
        global.browser.execute = () => Promise.reject(new Error('fakeError'))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('setSession', () => {
      it('should run setSession command', () => {
        const c = {
          command: 'setSession',
          parameters: {
            key: 'testKey',
            value: 'testValue'
          }
        }
        global.browser.execute = () => Promise.resolve(true)
        global.browser.refresh = () => Promise.resolve(true)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject setSession command if browser.sessionStorage fails', () => {
        const c = {
          command: 'setSession',
          parameters: {
            key: 'testKey',
            value: 'testValue'
          }
        }
        global.browser.execute = () => Promise.reject(new Error('fakeError'))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('storeValue', () => {
      it('should run storeValue command for text node', () => {
        const c = {
          command: 'storeValue',
          parameters: {
            target: 'id=potato',
            key: 'potatoes'
          }
        }
        const el = {
          ...makeFakeElement(),
          getText: () => Promise.resolve('yams'),
          getValue: () => Promise.resolve('')
        }
        global.browser.$ = () => Promise.resolve(el)
        const ctx = {}
        return runCommand(c, ctx, 1000, hookMock)
          .then(() => expect(ctx.potatoes).toEqual('yams'))
      })
      it('should run storeValue command for input node', () => {
        const c = {
          command: 'storeValue',
          parameters: {
            target: 'id=potato',
            key: 'potatoes'
          }
        }
        const el = {
          ...makeFakeElement(),
          getText: () => Promise.resolve(''),
          getValue: () => Promise.resolve('yams')
        }
        global.browser.$ = () => Promise.resolve(el)
        const ctx = {}
        return runCommand(c, ctx, 1000, hookMock)
          .then(() => expect(ctx.potatoes).toEqual('yams'))
      })
      it('should run storeValue command for input node and default text to empty string', () => {
        const c = {
          command: 'storeValue',
          parameters: {
            target: 'id=potato',
            key: 'potatoes'
          }
        }
        const el = {
          ...makeFakeElement(),
          getText: () => Promise.resolve(''),
          getValue: () => Promise.resolve('')
        }
        global.browser.$ = () => Promise.resolve(el)
        const ctx = {}
        return runCommand(c, ctx, 1000, hookMock)
          .then(() => expect(ctx.potatoes).toEqual(''))
      })
      it('should reject storeValue command if browser.getText fails', () => {
        const c = {
          command: 'storeValue',
          parameters: {
            target: 'id=potato',
            key: 'potatoes'
          }
        }
        global.browser.waitForVisible = (s, t) => Promise.resolve(true)
        global.browser.waitForExist = (s, t) => Promise.resolve(true)
        global.browser.getText = () => Promise.reject(new Error('fakeError'))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('type', () => {
      it('should run type command', () => {
        const c = {
          command: 'type',
          parameters: {
            target: 'id=test',
            value: 'testValue'
          }
        }
        const el = {
          ...makeFakeElement(),
          setValue: (v) => Promise.resolve(v)
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toEqual('testValue')
      })
      it('should reject type command if browser.setValue fails', () => {
        const c = {
          command: 'type',
          parameters: {
            target: 'id=test',
            value: 'testValue'
          }
        }
        const el = {
          ...makeFakeElement(),
          setValue: () => Promise.reject(new Error('fakeError'))
        }
        global.browser.$ = () => Promise.resolve(el)
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
    describe('Comment', () => {
      it('should run comment command', () => {
        const c = {
          command: 'comment',
          parameters: {
            comment: 'Potato vs Superman'
          }
        }
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
    })
    describe('assertTableExists', () => {
      it('should run assertTableNotEmpty command', () => {
        const c = {
          command: 'assertTableNotEmpty',
          parameters: {
            target: 'id=test'
          }
        }
        const el = {
          ...makeFakeElement(),
          getText: () => Promise.resolve('testHeader'),
          getValue: () => Promise.resolve('')
        }
        const el1 = {
          ...makeFakeElement(),
          getText: () => Promise.resolve('testRow'),
          getValue: () => Promise.resolve('')
        }
        global.browser.$$ = (selector) => {
          if (selector.includes('th')) return Promise.resolve([el, el])
          else return Promise.resolve([el1, el1])
        }
        global.browser.$ = () => Promise.resolve(makeFakeElement())
        return expect(runCommand(c, {}, 1000, hookMock)).resolves.toBeTruthy()
      })
      it('should reject assertTableNotEmpty command', () => {
        const c = {
          command: 'assertTableNotEmpty',
          parameters: {
            target: 'id=test'
          }
        }
        const el = {
          ...makeFakeElement(),
          getText: () => Promise.resolve(''),
          getValue: () => Promise.resolve('')
        }

        global.browser.$$ = () => Promise.resolve([el, el])
        global.browser.$ = () => Promise.resolve(makeFakeElement(true))
        return expect(runCommand(c, {}, 1000, hookMock)).rejects.toBeDefined()
      })
    })
  })
})
