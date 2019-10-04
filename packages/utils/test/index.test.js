import {
  doReplace,
  replaceAllFields,
  expandBlocks,
  domText,
  xpath,
  getLocator,
  regExpMatch,
  traverseJson,
  filterJson,
  cloneJson,
  setLocalStorage,
  getLocalStorage,
  setSessionStorage,
  getSessionStorage
} from '../src/index.js'
import moment from 'moment'

describe('String replacements', () => {
  it('should replace {todaysDate}', () => {
    const todaysDate = moment().format('MM/D/YYYY')
    return doReplace('{todaysDate}')
      .then(result => expect(result).toEqual(todaysDate))
  })
  it('should not replace {potato}', () => {
    return doReplace('{potato}')
      .then(result => expect(result).toEqual('{potato}'))
  })
  it('should replace {random}', () => {
    return doReplace('{random}')
      .then(result => expect(result).not.toEqual('{random}'))
  })
  it('should replace {millis}', () => {
    return doReplace('{millis}')
      .then(result => expect(result).not.toEqual('{random}'))
  })
  it('should return a string with no braces', () => {
    return doReplace('potatoes')
      .then(result => expect(result).toEqual('potatoes'))
  })
  it('should replace a static string from context', () => {
    return doReplace('{potato}', { potato: 'potatoes' })
      .then(result => expect(result).toEqual('potatoes'))
  })
  it('should replace a static string from context with special pattern', () => {
    return doReplace('{potato}', { potato: 'potatoe$$' })
      .then(result => expect(result).toEqual('potatoe$$'))
  })
  it('should replace a static string from nested context', () => {
    return doReplace('{potato.type}', { potato: { type: 'pancakes' } })
      .then(result => expect(result).toEqual('pancakes'))
  })
  it('should replace a static string from nested context with array', () => {
    return doReplace('{potato.type.0}', { potato: { type: ['pancakes'] } })
      .then(result => expect(result).toEqual('pancakes'))
  })
  it('should not replace a static string if no context', () => {
    return doReplace('{potato}')
      .then(result => expect(result).toEqual('{potato}'))
  })
  it('should replace a string nested in a JSON string', () => {
    const todaysDate = moment().format('MM/D/YYYY')
    return doReplace('{"test": "{todaysDate}"}')
      .then(result => expect(result).toEqual(`{"test": "${todaysDate}"}`))
  })
  it('should replace a string double nested braces in a JSON string', () => {
    const todaysDate = moment().format('MM/D/YYYY')
    return doReplace('{"test": "{{t}sDate}"}', { t: 'today' })
      .then(result => expect(result).toEqual(`{"test": "${todaysDate}"}`))
  })
  it('should ignore a json valid string that is not an object', () => {
    return doReplace(1234)
      .then(result => expect(result).toEqual(1234))
  })
  it('should replace from environment', () => {
    process.env.TEST = 'a'
    return doReplace('{TEST}')
      .then(result => expect(result).toEqual('a'))
  })
})

describe('replaceAllFields', () => {
  it('should perform replacements for all object keys', async () => {
    const parameters = {
      parameterA: '{someKey}',
      parameterB: '{anotherKey}'
    }
    const context = {
      someKey: 'potato',
      anotherKey: 'pancakes'
    }
    const result = await replaceAllFields(parameters, context)
    expect(result.parameterA).toEqual('potato')
    expect(result.parameterB).toEqual('pancakes')
  })
  it('should perform replacements for nested object keys', async () => {
    const parameters = {
      parameterA: '{someKey}',
      parameterB: {
        parameterC: '{anotherKey}'
      }
    }
    const context = {
      someKey: 'potato',
      anotherKey: 'pancakes'
    }
    const result = await replaceAllFields(parameters, context)
    expect(result.parameterA).toEqual('potato')
    expect(result.parameterB.parameterC).toEqual('pancakes')
  })
})

describe('Expand blocks testrunner', () => {
  const blocks = [
    {
      name: 'block1',
      data: {
        commands: [
          {
            command: 'click',
            parameters: {
              target: 'id=startApp'
            }
          },
          {
            command: 'click',
            parameters: {
              target: 'id=signInBtn'
            }
          }
        ]
      }
    }
  ]
  const baseCommands = [
    {
      command: 'open',
      parameters: {
        url: 'https://example.com'
      }
    },
    {
      command: 'click',
      parameters: {
        target: 'id=startButton'
      }
    },
    {
      command: 'click',
      parameters: {
        target: 'id=signInBtn'
      }
    }
  ]
  it('should return the same array of commands', () => {
    expect(expandBlocks(baseCommands, blocks)).toEqual(baseCommands)
  })
  it('should expand block', () => {
    const testCommands = baseCommands.concat({
      command: 'runBlock',
      parameters: {
        block: 'block1'
      }
    })
    // use map to add 'isBlock' property to expected output
    const expected = baseCommands.concat(blocks[0].data.commands.map(c => Object.assign({}, c, { isBlock: true })))
    expect(expandBlocks(testCommands, blocks)).toEqual(expected)
  })
  it('should expand nested blocks', () => {
    const testCommands = baseCommands.concat({
      command: 'runBlock',
      parameters: {
        block: 'block1'
      }
    })
    const testBlocks = [
      {
        name: 'block1',
        data: {
          commands: [
            {
              command: 'click',
              parameters: {
                target: 'id=startApp'
              }
            },
            {
              command: 'runBlock',
              parameters: {
                block: 'block2'
              }
            }
          ]
        }
      },
      {
        name: 'block2',
        data: {
          commands: [
            {
              command: 'click',
              parameters: {
                target: 'id=startApp'
              }
            },
            {
              command: 'click',
              parameters: {
                target: 'id=signInBtn'
              }
            }
          ]
        }
      }
    ]
    // use map to add 'isBlock' property to expected output
    const blockCommands = [testBlocks[0].data.commands[0], ...testBlocks[1].data.commands]
    const expected = baseCommands.concat(blockCommands.map(c => Object.assign({}, c, { isBlock: true })))
    expect(expandBlocks(testCommands, testBlocks)).toEqual(expected)
  })
  it('should error if an unknown block is asked for', () => {
    const testCommands = baseCommands.concat({
      command: 'runBlock',
      parameters: {
        block: 'block2'
      }
    })
    expect(expandBlocks.bind(null, testCommands, blocks)).toThrow('Block "block2" does not exist')
  })
})

describe('domText', () => {
  it('should get text for element', () => {
    const el = {
      innerText: 'Potato',
      textContent: '<p>Potato</p>',
      tagName: 'P'
    }
    expect(domText(el)).toEqual('Potato')
  })
  it('should get empty text for element with no textContent', () => {
    const el = {
      tagName: 'SVG'
    }
    expect(domText(el)).toEqual('')
  })
  it('should get text for input element', () => {
    const el = {
      innerText: '',
      textContent: '',
      value: 'Potato',
      tagName: 'INPUT'
    }
    expect(domText(el)).toEqual('Potato')
  })
  it('should get text for select element', () => {
    const el = {
      innerText: '',
      textContent: '',
      value: 'Potato',
      tagName: 'SELECT'
    }
    expect(domText(el)).toEqual('Potato')
  })
})

const divBuilder = (base = {}) => {
  const el = {
    tagName: 'div',
    nodeType: 1,
    getAttribute: function (attr) { return this[attr] },
    classList: [],
    parentNode: {
      childNodes: []
    },
    childNodes: [],
    ...base
  }
  el.parentNode.childNodes.push(el)
  return el
}

describe('xpath', () => {
  it('should throw error if given null', () => {
    expect(xpath).toThrow(TypeError)
  })
  it('should get xpath for top level div', () => {
    const el = divBuilder()
    el.parentNode.childNodes.unshift(divBuilder())
    expect(xpath(el)).toEqual('/html/div[2]')
  })
  it('should get xpath for text node', () => {
    const el = divBuilder()
    el.nodeType = 3
    expect(xpath(el)).toEqual('/html')
  })
  it('should get xpath for node with id', () => {
    const el = divBuilder()
    el.id = 'test'
    expect(xpath(el)).toEqual('//*[@id="test"]')
  })
  it('should get xpath for body', () => {
    const el = divBuilder()
    el.tagName = 'BODY'
    expect(xpath(el)).toEqual('/html/body')
  })
  it('should climb up and find the nearest id', () => {
    const el = divBuilder({
      parentNode: divBuilder({
        id: 'parent'
      })
    })
    expect(xpath(el)).toEqual('//*[@id=\"parent\"]/div')
  })
  it('should climb up and find the nearest name', () => {
    const el = divBuilder({
      parentNode: divBuilder({
        name: 'parent'
      })
    })
    expect(xpath(el)).toEqual('//*[@name=\"parent\"]/div')
  })
  it('should climb up and find the nearest data automation id', () => {
    const el = divBuilder({
      parentNode: divBuilder({
        'data-automation-id': 'parent'
      })
    })
    expect(xpath(el)).toEqual('//*[@data-automation-id=\"parent\"]/div')
  })
})

describe('getLocator', () => {
  it('should do nothing if it cant get attributes', () => {
    expect(getLocator({})).toEqual(undefined)
  })
  it('should get locator for element with just xpath', () => {
    const el = divBuilder({
      innerText: 'Potato',
      textContent: '<div>Potato</div>',
      classList: [],
      getAttribute: (attr) => {
        switch (attr) {
          default:
            return null
        }
      },
      id: 'test'
    })
    expect(getLocator(el)).toEqual('//*[@id="test"]')
  })
  it('should get locator for element with xpath and css selector', () => {
    const el = divBuilder({
      innerText: 'Potato',
      textContent: '<div>Potato</div>',
      classList: [
        'class1',
        'class2'
      ],
      getAttribute: (attr) => {
        switch (attr) {
          default:
            return null
        }
      },
      id: 'test'
    })

    global.document.querySelectorAll = (selector) => ([el])
    expect(getLocator(el)).toEqual('css=div.class1.class2')
  })
  it('should get locator for element with xpath css selector and name', () => {
    const el = divBuilder({
      innerText: 'Potato',
      textContent: '<div>Potato</div>',
      classList: [
        'class1',
        'class2'
      ],
      getAttribute: (attr) => {
        switch (attr) {
          case 'name':
            return 'test'
          default:
            return null
        }
      },
      id: 'test'
    })
    global.document.querySelectorAll = (selector) => ([el])
    expect(getLocator(el)).toEqual('name=test')
  })
  it('should get locator for element with xpath css selector, name and id', () => {
    const el = divBuilder({
      innerText: 'Potato',
      textContent: '<div>Potato</div>',
      classList: [
        'class1',
        'class2'
      ],
      id: 'testId'
    })

    global.document.querySelectorAll = (selector) => ([el])
    expect(getLocator(el)).toEqual('id=testId')
  })
  it('should get locator for element with xpath css selector, name and automationid', () => {
    const el = divBuilder({
      innerText: 'Potato',
      textContent: '<div>Potato</div>',
      classList: [
        'class1',
        'class2'
      ],
      automationid: 'testAutomationId',
      name: 'test'
    })
    global.document.querySelectorAll = (selector) => ([el])
    expect(getLocator(el)).toEqual('automationid=testAutomationId')
  })
  it('should get locator for element with xpath css selector, name, id, and data-automation-id', () => {
    const el = divBuilder({
      innerText: 'Potato',
      textContent: '<div>Potato</div>',
      classList: [
        'class1',
        'class2'
      ],
      name: 'test',
      'data-automation-id': 'testAutoId',
      id: 'test'
    })
    global.document.querySelectorAll = (selector) => ([el])
    expect(getLocator(el)).toEqual('automation-id=testAutoId')
  })
  it('should get locator and options for element with xpath css selector, name, id, and data-automation-id', () => {
    const el = divBuilder({
      innerText: 'Potato',
      textContent: '<div>Potato</div>',
      classList: [
        'class1',
        'class2'
      ],
      tagName: 'div',
      nodeType: 1,
      id: 'testId',
      name: 'test',
      'data-automation-id': 'testAutoId'
    })
    global.document.querySelectorAll = (selector) => ([el])
    const expected = {
      target: 'automation-id=testAutoId',
      targetOptions: [
        'automation-id=testAutoId',
        'id=testId',
        'name=test',
        'css=div.class1.class2',
        '//*[@data-automation-id="testAutoId"]'
      ]
    }
    expect(getLocator(el, true)).toEqual(expected)
  })
  it('should get locator and options for element with xpath css selector, name, data-auto-sel, id, and data-automation-id', () => {
    const el = divBuilder({
      getAttribute: function (attr) {
        if (attr === 'data-automation-id') return 'testAutoId'
        if (attr === 'data-auto-sel') return 'testAutoSel'
        return this[attr]
      },
      name: 'test',
      id: 'testId',
      innerText: 'Potato',
      textContent: '<div>Potato</div>',
      classList: [
        'class1',
        'class2'
      ]
    })
    el.parentNode.childNodes.push(el) // add itself to child nodes of parent to replicate dom
    global.document.querySelectorAll = (selector) => ([el])
    const expected = {
      target: 'automation-id=testAutoId',
      targetOptions: [
        'automation-id=testAutoId',
        'id=testId',
        'data-auto-sel=testAutoSel',
        'name=test',
        'css=div.class1.class2',
        '//*[@data-automation-id="testAutoId"]'
      ]
    }
    expect(getLocator(el, true)).toEqual(expected)
  })

  it('should get locator and options for element with xpath css selector, name, data-auto-sel, id, and data-automation-id and ignore the ID strategy', () => {
    const el = divBuilder({
      'data-automation-id': 'testAutoId',
      'data-auto-sel': 'testAutoSel',
      name: 'test',
      innerText: 'Potato',
      textContent: '<div>Potato</div>',
      classList: [
        'class1',
        'class2'
      ]
    })
    global.document.querySelectorAll = (selector) => ([el])
    const ignorePatterns = [
      'testId-.*'
    ]
    const expected = {
      target: 'automation-id=testAutoId',
      targetOptions: [
        'automation-id=testAutoId',
        'data-auto-sel=testAutoSel',
        'name=test',
        'css=div.class1.class2',
        '//*[@data-automation-id=\"testAutoId\"]'
      ]
    }
    expect(getLocator(el, true, ignorePatterns)).toEqual(expected)
  })

  it('should get locator and options for element with xpath css selector, name, data-auto-sel, id, and data-automation-id and not ignore the ID strategy', () => {
    const random = Math.random()
    const el = divBuilder({
      getAttribute: function (attr) {
        if (attr === 'data-automation-id') return 'testAutoId'
        if (attr === 'data-auto-sel') return 'testAutoSel'
        return this[attr]
      },
      id: `testingId-${random}`,
      name: 'test',
      innerText: 'Potato',
      textContent: '<div>Potato</div>',
      classList: [
        'class1',
        'class2'
      ]
    })
    global.document.querySelectorAll = (selector) => ([el])
    const ignorePatterns = [
      'testId-.*'
    ]
    const expected = {
      target: 'automation-id=testAutoId',
      targetOptions: [
        'automation-id=testAutoId',
        `id=testingId-${random}`,
        'data-auto-sel=testAutoSel',
        'name=test',
        'css=div.class1.class2',
        '//*[@data-automation-id="testAutoId"]'
      ]
    }
    expect(getLocator(el, true, ignorePatterns)).toEqual(expected)
  })
  it('should get locator for element that is a link and just return an xpath', () => {
    const el = {
      innerText: 'Potato',
      textContent: '<a>Potato</a>',
      classList: [],
      getAttribute: (attr) => {
        switch (attr) {
          default:
            return null
        }
      },
      tagName: 'a',
      nodeType: 1,
      id: 'test',
      parentNode: {
        childNodes: [
          {
            nodeType: 1,
            tagName: 'div'
          }
        ]
      }
    }
    el.parentNode.childNodes.push(el) // add itself to child nodes of parent to replicate dom
    global.document.querySelectorAll = (selector) => ([el])
    global.document.getElementsByTagName = (tag) => ([el])
    expect(getLocator(el)).toEqual('//*[@id="test"]')
  })
})

describe('Regex Replace', () => {
  it('should find match with Regex', () => {
    expect(regExpMatch('/.*9*./', 'pot9to')).toEqual('pot9to')
  })
  it('should find one digit', () => {
    expect(regExpMatch('/\\d/', '499')).toEqual('4')
  })
  it('should match partial word', () => {
    expect(regExpMatch('/A\\w*/', 'About')).toEqual('About')
  })
  it('should fail finding just one digit', () => {
    expect(regExpMatch('/\\d/', 'pot9to')).toEqual('9')
  })
  it('should find three digits', () => {
    expect(regExpMatch('/\\d\\d\\d/', 'this is just some 100')).toEqual('100')
  })
  it('should find digits with Decimal only', () => {
    expect(regExpMatch('/\\d*\\.?\\d+$/', '200,00 200.00')).toEqual('200.00')
  })
  it('should not allow any commas in number', () => {
    expect(regExpMatch('/(\\d+\\.)?\\d+$/', '200,000 400')).toEqual('400')
  })
  it('should find case senstive words ', () => {
    expect(regExpMatch('/([A-Z])\\w+/', 'potato and Superman')).toEqual('Superman')
  })
  it('should throw error if no match found ', () => {
    expect(regExpMatch.bind(null, '/\\d/', 'hello world')).toThrow('No match')
  })
})

describe('traverseJson', () => {
  it('should traverse to node speficied by property-chain', () => {
    expect(traverseJson({ a: { b: { c: 'test' } } }, ['a', 'b', 'c'])).toEqual('test')
  })
  it('should get original json if property-chain is empty', () => {
    const json = { a: 'test' }
    expect(traverseJson(json, [])).toEqual(json)
  })
})

describe('filterJson', () => {
  it('should filter JSON given list of nodes to delete', () => {
    expect(JSON.stringify(
      filterJson({ apple: { type: 'pome', color: 'red' }, orange: { type: 'citrus', color: 'orange' } }, [['apple', 'type'], ['orange', 'color']])
    )).toEqual(JSON.stringify(
      { apple: { color: 'red' }, orange: { type: 'citrus' } }
    ))
  })
  it('expect no change if property-chain is empty', () => {
    const json = { a: 'test' }
    expect(JSON.stringify(
      filterJson(json, [])
    )).toEqual(JSON.stringify(json))
  })
  it('expect no change non object value is passed', () => {
    expect(filterJson('test', [])).toEqual('test')
  })
})

describe('cloneJson', () => {
  it('should clone JSON', () => {
    expect(JSON.stringify(
      cloneJson({ a: 'test' })
    )).toEqual(JSON.stringify({ a: 'test' }))
  })
})

describe('setLocalStorage', () => {
  it('should set an item in local storage', () => {
    setLocalStorage('test', 'testValue')
    expect(getLocalStorage('test')).toEqual('testValue')
  })
})

describe('setSessionStorage', () => {
  it('should set an item in session storage', () => {
    setSessionStorage('test', 'testValue')
    expect(getSessionStorage('test')).toEqual('testValue')
  })
})
