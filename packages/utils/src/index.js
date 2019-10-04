import moment from 'moment'
import 'es6-promise/auto'
import 'isomorphic-fetch'

const RANDOM_MAX = 1000

export const availableReplacements = {
  random: {
    description: `Replaced with a random number between 0 and ${RANDOM_MAX}`,
    action: getRandomNumber
  },
  todaysDate: {
    description: 'Replaced with todays date',
    action: getTodaysDate
  },
  millis: {
    description: 'Replaced with current time in milliseconds',
    action: getMillis
  }
}
async function getMillis() {
  return Date.now()
}

async function getRandomNumber() {
  return Math.floor(Math.random() * RANDOM_MAX)
}

async function getTodaysDate() {
  return moment().format('MM/D/YYYY')
}

//* ****************************************************************************

export function getAllMatches(regex, str) {
  const results = []
  let match
  while ((match = regex.exec(str)) !== null) {
    results.push(match)
  }
  return results
}

async function resolveMatches(string, defaults, context) {
  const matches = getAllMatches(/\{([\w|.]*?)\}/g, string)
  return Promise.all(
    matches.map(async match => {
      const parts = match[1].split('.')
      // Descend into the context object for replacements like
      // {someObject.someProperty}
      // with context like {someObject: {someProperty: 'a'}}
      const currentContext = parts
        .slice(0, parts.length - 1)
        .reduce((acc, cv) => acc[cv], context)
      if (process && process.env && process.env[match[1]]) {
        return { old: match[0], new: process.env[match[1]] }
      } else if (defaults[match[1]]) {
        const result = await defaults[match[1]].action()
        return { old: match[0], new: result }
      } else if (currentContext[parts[parts.length - 1]]) {
        return { old: match[0], new: currentContext[parts[parts.length - 1]] }
      }
    })
  )
}

/**
 * Performs string replacements to the given string
 * @async
 * @param {string} string - The string to perform replacements on
 * @param {Object} context - An object for synchronous replacements
 * @param {Object} defaults - An object for asynchronous replacements, mostly just for dependency injection, should probably not be overridden
 * @returns {Promise<string>} - Returns a promise that resolves to the resulting string
 */
export async function doReplace(
  string,
  context = {},
  defaults = availableReplacements
) {
  const replaceMatches = results =>
    results
      .filter(r => r !== undefined)
      .reduce((acc, cv) => acc.replace(cv.old, () => cv.new), string)
  const re = /\{([\w|.]*?)\}/g
  if (re.test(string)) {
    const result = replaceMatches(
      await resolveMatches(string, defaults, context)
    )
    return result === string ? result : doReplace(result, context)
  }
  return string
}

/**
 * Performs replacements on all the fields in an object
 * @async
 * @param {Object} obj - The object to perform replacements on
 * @param {Object} context - The context to replace with
 * @return {Object} - A copy of the original object fields with the values replaced
 */
export const replaceAllFields = (obj, context) =>
  Object.keys(obj).reduce(
    async (acc, cv) => ({
      ...(await acc),
      [cv]:
        typeof obj[cv] === 'object'
          ? await replaceAllFields(obj[cv], context)
          : await doReplace(obj[cv], context)
    }),
    Promise.resolve({})
  )

/**
 * Replaces `runBlock` commands with their contents
 * @param {Array} commands - The array of commands containing `runBlock` commands
 * @param {Array} blocks - The blocks associated with the commands
 * @returns {Array} - The commands with the blocks replaced with their contents
 */
export function expandBlocks(commands = [], blocks = []) {
  return commands.reduce((current, nextCommand, index) => {
    if (nextCommand.command === 'runBlock') {
      const blockName = nextCommand.parameters.block
      const block = blocks.find(({ name }) => name === blockName)
      if (!block) {
        throw new Error(`Block "${blockName}" does not exist`)
      }
      // Also label this command so that we know that this is a block
      const commands = block.data.commands.map(command =>
        Object.assign({}, command, { isBlock: true })
      )
      return current.concat(expandBlocks(commands, blocks))
    }
    return current.concat(nextCommand)
  }, [])
}

/**
 * Gets the text for a given DOM element
 * @param {Object} el - The DOM element to extract text from
 * @returns {string} - The text from the element
 */
export function domText(el) {
  if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
    return el.value
  }
  const it = el.innerText
  const tc = el.textContent
  return tc
    ? tc.substr(tc.toUpperCase().indexOf(it.toUpperCase()), it.length)
    : ''
}

/**
 * Gets the xpath for the given DOM element
 * @async
 * @param {string} dom - The dom element to get the xpath for
 * @param {string} cur - The current dom element
 * @param {Array} list - The current list of elements in the xpath
 * @param {Array<string>} ignorePatterns - An array of regular expression strings to use for ignoring generated identifiers when recording. Does not ignore patterns across several nodes
 * @returns {string} - The xpath for the given element
 */
export function xpath(dom, cur, list, ignorePatterns = []) {
  const ignore = ignorePatterns.map(p => new RegExp(p))
  const shouldIgnore = st => ignore.find(reg => reg.test(st))

  const getTagIndex = function(dom) {
    return Array.from(dom.parentNode.childNodes)
      .filter(function(item) {
        return item.nodeType === dom.nodeType && item.tagName === dom.tagName
      })
      .reduce(function(prev, node, i) {
        if (prev !== null) return prev
        return node === dom ? i + 1 : prev
      }, null)
  }

  const name = function(dom) {
    if (!dom) return null
    if (dom.nodeType === 3) return '@text'

    const index = getTagIndex(dom)
    const count = Array.from(dom.parentNode.childNodes).filter(function(item) {
      return item.nodeType === dom.nodeType && item.tagName === dom.tagName
    }).length
    const tag = dom.tagName.toLowerCase()
    return count > 1 ? tag + '[' + index + ']' : tag
  }

  function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.ANY_TYPE, null)
  }

  // Call this recursively once overhead is loaded
  const xpathRecur = function(dom, cur, list) {
    if (!dom) return null

    if (!cur) {
      if (dom.nodeType === 3) {
        return xpathRecur(dom.parentNode)
      } else {
        return xpathRecur(dom, dom, [])
      }
    }

    if (!cur.parentNode) {
      return ['html'].concat(list)
    }

    if (cur.tagName === 'BODY') {
      return ['html', 'body'].concat(list)
    }

    const dataAutoId = cur.getAttribute('data-automation-id')
    if (dataAutoId) {
      const selector = [`*[@data-automation-id="${dataAutoId}"]`]
      if (!shouldIgnore(selector)) return selector.concat(list)
    }

    const autoId = cur.getAttribute('automationid')
    if (autoId && !shouldIgnore(autoId)) {
      const selector = `*[@automationid="${autoId}"]`
      if (!shouldIgnore(selector)) return [selector].concat(list)
    }

    if (cur.id && !shouldIgnore(cur.id)) {
      const selector = `*[@id="${cur.id}"]`
      if (!shouldIgnore(selector)) return [selector].concat(list)
    }

    const dataAutoSel = cur.getAttribute('data-auto-sel')
    if (dataAutoSel && !shouldIgnore(dataAutoSel)) {
      const selector = `*[@data-auto-sel="${dataAutoSel}"]`
      if (!shouldIgnore(selector)) return [selector].concat(list)
    }

    const elName = cur.getAttribute('name')
    if (elName && !shouldIgnore(elName)) {
      const selector = `*[@name="${elName}"]`
      if (!shouldIgnore(selector)) return [selector].concat(list)
    }

    const classes = Array.from(cur.classList)
    if (classes.length > 0) {
      const classString = classes
        .map(c => `contains(@class, "${c}")`)
        .join(' and ')
      const selector = `${cur.tagName.toLowerCase()}[${classString}]`
      let found = 0
      const iterator = getElementByXpath('//' + selector)
      while (iterator.iterateNext()) found++
      if (found === 1 && !shouldIgnore(selector)) return [selector].concat(list)
    }

    return xpathRecur(dom, cur.parentNode, [name(cur)].concat(list))
  }

  const parts = xpathRecur(dom, cur, list)
  const prefix = parts[0] === 'html' ? '/' : '//'
  const ret = prefix + parts.join('/')

  return ret
}

/**
 * Gets the locator for a given DOM element
 * @async
 * @param {Object} el - The DOM element to get a locator for
 * @param {boolean} withAllOptions - whether or not to return all the locator options
 * @param {Array<string>} ignorePatterns - An array of regular expression strings to use for ignoring generated identifiers when recording
 * @returns {(string|Object)} - Returns the locator or an object with all locator options
 */
export function getLocator(el, withAllOptions, ignorePatterns = []) {
  if (!el.getAttribute) return

  const ignore = ignorePatterns.map(p => new RegExp(p))
  const notIgnored = locator => !ignore.find(reg => reg.test(locator))
  const id = el.getAttribute('id')
  const name = el.getAttribute('name')
  const dataAutomation = el.getAttribute('data-automation-id')
  const automationId = el.getAttribute('automationid')
  const dataAutoSel = el.getAttribute('data-auto-sel')
  const classes = Array.from(el.classList)
  const candidates = []

  // we want data-automation-id to be the highest priority, rename to 'automation-id' for more semantic representation
  if (dataAutomation && dataAutomation.length) {
    candidates.push(`automation-id=${dataAutomation}`)
  }

  if (automationId && automationId.length) {
    candidates.push(`automationid=${automationId}`)
  }

  if (id && id.length) {
    candidates.push(`id=${id}`)
  }

  if (dataAutoSel && dataAutoSel.length) {
    candidates.push(`data-auto-sel=${dataAutoSel}`)
  }

  if (name && name.length) {
    candidates.push(`name=${name}`)
  }

  if (classes.length > 0) {
    const selector =
      el.tagName.toLowerCase() + classes.map(c => '.' + c).join('')
    const els = document.querySelectorAll(selector)

    // Note: to use css selector, we need to make sure that selecor is unique
    if (els[0] === el) {
      candidates.push(`css=${selector}`)
    }
  }

  candidates.push(xpath(el))
  const validCandidates = ignorePatterns.length
    ? candidates.filter(notIgnored)
    : candidates

  if (withAllOptions) {
    return {
      target: validCandidates[0],
      targetOptions: validCandidates
    }
  }
  return validCandidates[0]
}
/**
 * Logs a message
 * @async
 * @param {Object} params - The parameters for the splunk message
 * @returns {Promise<Object>} - Returns a promise that resolves to a status code
 */
export function log(params) {
  console.log(params)
  return new Promise((resolve, reject) => {
    resolve({
      status: 202
    })
  })
}

/**
 * Retrieves the string match when matching a string against a regular expression.
 * @param {value} regex - Pass Regular Expresion
 * @param {text} text - The dom get Text by the Locator
 * @returns {string} - Return a string that contains a matching string from text against regular expression
 * @throws {Error} - Thrown if match was not found
 */
export function regExpMatch(value, text) {
  const group = value.match(/^\/(.+)\/$/)
  const re = new RegExp(group[1])
  const match = text.match(re)
  if (match) {
    return match[0]
  } else {
    throw new Error(
      `No match found with regular expression: /${group[1]}/ for text: ${text}`
    )
  }
}

/**
 * Helper function to traverse json and returns value at node.
 * @private
 * @param {Object} JSON object that needs to be traversed
 * @param {Array} list of properties in order of traversal
 */
export const traverseJson = (json, propertyChain) => {
  if (propertyChain.length === 0) {
    return json
  }
  const key = propertyChain.shift()
  return traverseJson(json[key], propertyChain)
}

/**
 * Helper function that filter json and returns reduced value.
 * @private
 * @param {Object} JSON object that needs to be filtered
 * @param {Array} list of property chain
 */
export const filterJson = (json, propertyChainList) => {
  if (typeof json !== 'object') {
    return json
  }

  const traverseDelete = (json, propertyChain) => {
    if (propertyChain.length === 0) {
      // do nothing
    } else if (propertyChain.length === 1) {
      delete json[propertyChain[0]]
    } else {
      const key = propertyChain.shift()
      traverseDelete(json[key], propertyChain)
    }
  }

  const jsonCopy = cloneJson(json)
  propertyChainList.forEach(propertyChain => {
    traverseDelete(jsonCopy, propertyChain)
  })

  return jsonCopy
}

/**
 * Helper function that clone json and make deep copy.
 * @private
 * @param {Object} JSON object that needs to be cloned
 */
export const cloneJson = json => {
  return JSON.parse(JSON.stringify(json))
}

/**
 * Function to set a value for a key in local storage
 * @param {string} key - The key to set the value for
 * @param {string} value - The value to set for the key
 */
export const setLocalStorage = (key, value) =>
  window.localStorage.setItem(key, value)

/**
 * Function to get a value for a key in local storage
 * @param {string} key - The key to get the value for
 */
export const getLocalStorage = key => window.localStorage.getItem(key)

/**
 * Function to set a value for a key in session storage
 * @param {string} key - The key to set the value for
 * @param {string} value - The value to set for the key
 */
export const setSessionStorage = (key, value) =>
  window.sessionStorage.setItem(key, value)

/**
 * Function to get a value for a key in session storage
 * @param {string} key - The key to get the value for
 */
export const getSessionStorage = key => window.sessionStorage.getItem(key)
