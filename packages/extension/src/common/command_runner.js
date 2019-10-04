import { delay, until, asyncUntil } from './utils'
import Ext from './web_extension'
import log from './log'
import dragMock from './drag_mock'
import inspector from './inspector'
import {
  assignABTest,
  regExpMatch,
  replaceAllFields,
  traverseJson,
  filterJson,
  setLocalStorage,
  getLocalStorage,
  setSessionStorage,
  getSessionStorage
} from '@replayweb/utils'
import deepEqual from 'deep-equal'
const { domText } = inspector

const HIGHLIGHT_TIMEOUT = 500

const getElementByXPath = xpath => {
  const snapshot = document.evaluate(
    xpath,
    document.body,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  )

  return snapshot.snapshotItem(0)
}

// Note: parse the locator and return the element found accordingly
export const getElementByLocator = str => {
  const i = str.indexOf('=')
  let el

  if (/^\//.test(str)) {
    el = getElementByXPath(str)
  } else if (i === -1) {
    throw new Error('getElementByLocator: invalid locator, ' + str)
  } else {
    const method = str.substr(0, i)
    const value = str.substr(i + 1)

    switch (method && method.toLowerCase()) {
      case 'id':
        el = document.getElementById(value)
        break

      case 'name':
        el = document.getElementsByName(value)[0]
        break

      case 'identifier':
        el =
          document.getElementById(value) || document.getElementsByName(value)[0]
        break

      case 'automation-id':
        el = document.querySelector(`[data-automation-id="${value}"]`)
        break

      case 'automationid':
        el = document.querySelector(`automationid="${value}"]`)
        break

      case 'data-auto-sel':
        el = document.querySelector(`[data-auto-sel="${value}"]`)
        break

      case 'link': {
        const links = [].slice.call(document.getElementsByTagName('a'))
        // Note: there are cases such as 'link=exact:xxx'
        let realVal = value.replace(/^exact:/, '')
        // Note: position support. eg. link=Download@POS=3
        const match = realVal.match(/^(.+)@POS=(\d+)$/i)
        let index = 0

        if (match) {
          realVal = match[1]
          index = parseInt(match[2]) - 1
        }

        // Note: use textContent instead of innerText to avoid influence from text-transform
        const candidates = links.filter(a => domText(a) === realVal)
        el = candidates[index]
        break
      }

      case 'css':
        el = document.querySelector(value)
        break

      case 'xpath':
        el = getElementByXPath(value)
        break

      default:
        throw new Error(
          'getElementByLocator: unsupported locator method, ' + method
        )
    }
  }

  if (!el) {
    throw new Error(
      'getElementByLocator: fail to find element based on the locator, ' + str
    )
  }

  return el
}

export const getFrameByLocator = (str, helpers) => {
  const i = str.indexOf('=')

  // Note: try to parse format of 'index=0' and 'relative=top/parent'
  if (i !== -1) {
    const method = str.substr(0, i)
    const value = str.substr(i + 1)

    switch (method) {
      case 'id': {
        const frameEl = document.getElementById(value)
        const frames = Array.from(window.frames)
        const frame = frames.find(f => f === frameEl.contentWindow)
        if (!frame) {
          throw new Error(`Frame not found with id=${value}`)
        }
        return { frame }
      }
      case 'name': {
        const frameEl = document.getElementsByName(value)[0]
        const frames = Array.from(window.frames)
        const frame = frames.find(f => f === frameEl.contentWindow)
        if (!frame) {
          throw new Error(`Frame not found with name=${value}`)
        }
        return { frame }
      }
      case 'index': {
        const index = parseInt(value, 10)
        const frames = window.frames
        const frame = frames[index]

        if (!frame) {
          throw new Error(
            `Frame index out of range (index ${value} in ${frames.length} frames`
          )
        }

        return { frame }
      }

      case 'relative': {
        if (value === 'top') {
          return { frame: window.top }
        }

        if (value === 'parent') {
          return { frame: window.parent }
        }

        throw new Error('Unsupported relative type, ' + value)
      }
      case 'title': {
        const frameEl = getElementByXPath(
          `.//*[contains(@${method} ,"${value}")]`
        )
        const frames = Array.from(window.frames)
        const frame = frames.find(f => f === frameEl.contentWindow)
        if (!frame) {
          throw new Error(
            `Frame not found with xpath=${getElementByXPath(
              `.//*[contains(@${method} ,"${value}")]`
            )}`
          )
        }
        return { frame }
      }
    }
  }

  // Note: consider it as name, if no '=' found and it has no xpath pattern
  if (i === -1 && !/^\//.test(str)) {
    str = 'name=' + str
  }

  const frameDom = getElementByLocator(str)

  if (!frameDom || !frameDom.contentWindow) {
    throw new Error(`The element found based on ${str} is NOT a frame/iframe`)
  }

  // Note: for those iframe/frame that don't have src, they won't load content_script.js
  // so we have to inject the script by ourselves
  if (!frameDom.getAttribute('src')) {
    const file = Ext.extension.getURL('content_script.js')
    const doc = frameDom.contentDocument
    const s = doc.constructor.prototype.createElement.call(doc, 'script')

    s.setAttribute('type', 'text/javascript')
    s.setAttribute('src', file)

    doc.documentElement.appendChild(s)
    s.parentNode.removeChild(s)

    // helpers.hackAlertConfirmPrompt(doc)
  }

  // Note: can't reurn the contentWindow directly, because Promise 'resolve' will
  // try to test its '.then' method, which will cause a cross origin violation
  // so, we wrap it in an object
  return { frame: frameDom.contentWindow }
}

function scrollElementIntoView(el) {
  el.scrollIntoView()
  window.scrollBy(0, -50)
}

function getTableHeader(tableElementLocator) {
  const tableElement = getElementByXPath(tableElementLocator)
  const trs = Array.from(tableElement.getElementsByTagName('tr'))
  const allThs = trs.map(tr => Array.from(tr.getElementsByTagName('th')))
  const tds = allThs
    .reduce((acc, cv) => acc.concat(cv), []) // reduce 2D array into 1D array
    .map(th => domText(th).trim()) // get the text for all elements
  const headerRow = tds.filter(thText => thText !== '') // filter out all empty cells
  return headerRow
}

export const fetchTable = tableElementLocator => {
  const headerList = getTableHeader(tableElementLocator)
  const tableElement = getElementByXPath(tableElementLocator)
  const trs = Array.from(tableElement.getElementsByTagName('tr'))
  const allTds = trs.map(tr => Array.from(tr.getElementsByTagName('td')))
  const tableMap = allTds.map(tds => tds.map(td => domText(td).trim()))
  const tableWithoutHeader = tableMap.filter((row, i) => {
    // to remove multiple headers
    const header = Array.from(row).filter(
      (cellText, index) => headerList[index] === cellText
    )
    return header.length !== headerList.length && i !== 0
  })
  return tableWithoutHeader
}

export const run = async (commandObject, csIpc, helpers) => {
  const { command, parameters, extra, context } = commandObject
  const delayWithTimeoutStatus = (type, timeout, promise) => {
    return new Promise((resolve, reject) => {
      let past = 0

      const timer = setInterval(() => {
        past += 1000
        csIpc.ask('CS_TIMEOUT_STATUS', {
          type,
          total: timeout,
          past
        })

        if (past >= timeout) {
          clearInterval(timer)
        }
      }, 1000)

      const p = promise.then(val => {
        clearInterval(timer)
        return val
      })

      resolve(p)
    })
  }
  const wrap = (fn, genOptions) => (...args) => {
    const options = genOptions(...args)

    return new Promise((resolve, reject) => {
      try {
        resolve(fn(...args))
      } catch (e) {
        reject(new Error(options.errorMsg))
      }
    })
  }
  const __getFrameByLocator = wrap(getFrameByLocator, locator => ({
    errorMsg: `time out when looking for frame '${locator}'`
  }))
  const __getElementByLocator = wrap(getElementByLocator, locator => ({
    errorMsg: `time out when looking for element '${locator}'`
  }))

  const setValueForElement = (el, value) => {
    const tag = el.tagName.toLowerCase()

    if (tag !== 'input' && tag !== 'textarea') {
      throw new Error(
        'run command: element found is neither input nor textarea'
      )
    }

    if (extra.playScrollElementsIntoView) scrollElementIntoView(el)
    if (extra.playHighlightElements) helpers.highlightDom(el, HIGHLIGHT_TIMEOUT)

    // Found this solution for event dispatching here:
    // https://github.com/facebook/react/issues/11488#issuecomment-347775628
    const previousValue = el.value

    const focusEvent = new Event('focus', { bubbles: true })
    focusEvent.simulated = true
    el.dispatchEvent(focusEvent)

    const inputEvent = new Event('input', { bubbles: true })
    inputEvent.simulated = true // for React 15
    const tracker = el._valueTracker

    if (tracker) {
      // for React 16
      tracker.setValue(previousValue || value)
    }

    el.value = value
    el.dispatchEvent(inputEvent)
    el.dispatchEvent(new Event('change', { bubbles: false, cancelable: true }))
    el.dispatchEvent(new Event('blur'))

    return true
  }

  const finalParameters = await replaceAllFields(parameters, context)

  switch (command) {
    case 'selectFrame': {
      const { target } = finalParameters
      return __getFrameByLocator(target, helpers).then(frameWindow => {
        if (!frameWindow) {
          throw new Error('Invalid frame/iframe')
        }
        return frameWindow
      })
    }

    case 'assertAttribute': {
      const { target, attribute, expected } = finalParameters
      return __getElementByLocator(target).then(el => {
        const attributeValue = el.getAttribute(attribute)
        const expectation = expected.match(/^\/.+\/$/)
          ? regExpMatch(expected, attributeValue)
          : expected
        if (attributeValue !== expectation) {
          throw new Error(
            `attribute ${attribute} had value: ${attributeValue}, but expected ${expected}`
          )
        }
        return true
      })
    }

    case 'assertCheckboxState': {
      const { target, expected } = finalParameters
      return __getElementByLocator(target).then(el => {
        if (!el) {
          throw new Error(`element ${target} was not found`)
        } else if (el.type !== 'checkbox' || el.checked !== Boolean(expected)) {
          throw new Error(
            'element is either not a checkbox or is not the correct state'
          )
        } else {
          return true
        }
      })
    }

    case 'assertClassDoesNotExist': {
      const { target, class: assertClass } = finalParameters
      return __getElementByLocator(target).then(el => {
        if (el.classList.contains(assertClass)) {
          throw new Error(
            `class ${assertClass} found in classes: "${el.classList.value}"`
          )
        }
        return true
      })
    }

    case 'assertClassExists': {
      const { target, class: assertClass } = finalParameters
      return __getElementByLocator(target).then(el => {
        if (!el.classList.contains(assertClass)) {
          throw new Error(
            `class not found, \n\texpected: "${assertClass}", \n\tactual: "${el.classList.value}"`
          )
        }
        return true
      })
    }

    case 'assertElementPresent': {
      const { target, timeout } = finalParameters
      return asyncUntil(
        'assertElementPresent',
        () =>
          __getElementByLocator(target)
            .then(el => ({ pass: true, result: el }))
            .catch(e => ({ pass: false })),
        500,
        timeout,
        `'${target}' element not present`
      )
    }

    case 'assertElementNotPresent': {
      const { target, timeout } = finalParameters
      return asyncUntil(
        'assertElementNotPresent',
        () =>
          __getElementByLocator(target)
            .then(el => ({ pass: false, result: el }))
            .catch(e => ({ pass: true })),
        500,
        timeout,
        `'${target}' element is present but was not expected to be`
      )
    }

    case 'assertElementVisible': {
      const { target, timeout } = finalParameters
      return asyncUntil(
        'assertElementVisible',
        () =>
          __getElementByLocator(target)
            .then(el => {
              if (window.getComputedStyle(el).display !== 'none') {
                return { pass: true, result: true }
              } else {
                throw new Error(
                  `'${target}' is not visible but was expected to be`
                )
              }
            })
            .catch(e => ({ pass: false })),
        500,
        timeout,
        `'${target} is not visible' but was expected to be`
      )
    }

    case 'assertElementNotVisible': {
      const { target, timeout } = finalParameters
      return asyncUntil(
        'assertElementNotVisible',
        () =>
          __getElementByLocator(target)
            .then(el => {
              if (window.getComputedStyle(el).display === 'none') {
                return { pass: true, result: true }
              } else {
                throw new Error(
                  `'${target}' is visible but was not expected to be`
                )
              }
            })
            .catch(e => ({ pass: false })),
        500,
        timeout,
        `'${target}' is visible but was not expected to be`
      )
    }

    case 'assertLocalStorage': {
      const { key, expected } = finalParameters
      const value = getLocalStorage(key)
      if (value !== expected) {
        throw new Error(
          `Local Storage value did not match: \n\texpected: "${expected}", \n\tactual: "${value}"`
        )
      }
      return true
    }

    case 'assertSessionStorage': {
      const { key, expected } = finalParameters
      const value = getSessionStorage(key)
      if (value !== expected) {
        throw new Error(
          `Session Storage value did not match: \n\texpected: "${expected}", \n\tactual: "${value}"`
        )
      }
      return true
    }

    case 'assertStyle': {
      const { target, property, expected } = finalParameters
      return __getElementByLocator(target).then(el => {
        const computed = window.getComputedStyle(el)
        if (computed[property] === undefined) {
          throw new Error(`style '${property}' not found on element ${target}`)
        }
        if (computed[property] !== expected) {
          throw new Error(
            `style did not match, \n\texpected: "${expected}", \n\tactual: "${computed[property]}"`
          )
        }
        return true
      })
    }

    case 'assertText': {
      const { target, expected = '' } = finalParameters
      return __getElementByLocator(target).then(el => {
        const text = domText(el)
        const expectation = expected.match(/^\/.+\/$/)
          ? regExpMatch(expected, text)
          : expected
        if (text !== expectation) {
          throw new Error(
            `text not matched, \n\texpected: "${expectation}", \n\tactual: "${text}"`
          )
        }
        return true
      })
    }

    case 'assertTableNotEmpty': {
      const { target } = finalParameters
      if (fetchTable(target).length === 0) {
        throw new Error(`Table is empty : ${target}`)
      }
      return true
    }

    case 'assertTitle': {
      const { expected } = finalParameters
      if (expected !== document.title) {
        throw new Error(
          `title not matched, \n\texpected: "${expected}", \n\tactual: "${document.title}"`
        )
      }

      return true
    }

    case 'assertUrl': {
      const { expected } = finalParameters
      if (expected !== top.location.href) {
        return {
          log: {
            error: `location not matched, \n\texpected: "${expected}, \n\tactual: "${top.location.href}"`
          }
        }
      }
      return true
    }

    case 'assertJsonInContext': {
      const { key, expected } = finalParameters

      return deepEqual(context[key], expected)
    }

    // END ASSERTS
    // *************************************************************************

    case 'captureScreenshot': {
      return csIpc.ask('CS_CAPTURE_SCREENSHOT', {}).then(url => ({
        screenshot: {
          url,
          name: url.split('/').slice(-1)[0]
        }
      }))
    }

    case 'clearValue': {
      const { target } = finalParameters
      return __getElementByLocator(target).then(el =>
        setValueForElement(el, '')
      )
    }
    case 'click':
    case 'clickAndWait': {
      const { target } = finalParameters
      return __getElementByLocator(target).then(el => {
        try {
          if (extra.playScrollElementsIntoView) scrollElementIntoView(el)
          if (extra.playHighlightElements)
            helpers.highlightDom(el, HIGHLIGHT_TIMEOUT)
        } catch (e) {
          log.error('error in scroll and highlight')
        }

        el.click()
        return true
      })
    }

    case 'comment': {
      return true
    }

    // Placeholder, testrunner will actually do browser.debug
    case 'debug': {
      return true
    }

    case 'deleteAllCookies': {
      return csIpc
        .ask('CS_DELETE_ALL_COOKIES', {
          url: window.location.origin
        })
        .then(() => true)
    }

    case 'dragAndDropToObject': {
      const { startTarget, endTarget } = finalParameters
      return Promise.all([
        __getElementByLocator(startTarget),
        __getElementByLocator(endTarget)
      ]).then(([$src, $tgt]) => {
        dragMock.dragStart($src).drop($tgt)
        return true
      })
    }

    case 'http': {
      const {
        url,
        method = 'GET',
        body,
        headers = {},
        key,
        text = false
      } = finalParameters
      return fetch(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: new Headers(headers)
      })
        .then(res => {
          if (parseInt(res.status) >= 300) {
            return Promise.reject(
              new Error(
                `Error in ${method} call to ${url}:\nResponse code was ${res.status}`
              )
            )
          }
          return text ? res.text() : res.json()
        })
        .then(value => ({
          context: [{ key, value }]
        }))
    }

    case 'mouseOver': {
      const { target } = finalParameters
      return __getElementByLocator(target).then(el => {
        try {
          if (extra.playScrollElementsIntoView) scrollElementIntoView(el)
          if (extra.playHighlightElements)
            helpers.highlightDom(el, HIGHLIGHT_TIMEOUT)
        } catch (e) {
          log.error('error in scroll and highlight', e.message)
        }

        el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
        return true
      })
    }

    case 'mouseEvent': {
      const { target } = finalParameters
      return __getElementByLocator(target).then(el => {
        el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
        el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
        el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
        el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        return true
      })
    }

    case 'open':
      const { url } = finalParameters
      return until('document.body', () => {
        return {
          pass: !!document.body,
          result: document.body
        }
      }).then(() => {
        window.location.href = url
        return true
      })

    case 'pause': {
      const { millis } = finalParameters
      const time = isNaN(parseInt(millis)) ? 3000 : parseInt(millis)

      return delayWithTimeoutStatus('pause', time, delay(() => true, time))
    }

    case 'refresh':
      setTimeout(() => window.location.reload(), 0)
      return true

    case 'select':
    case 'selectAndWait': {
      const { target, value } = finalParameters
      return __getElementByLocator(target).then(el => {
        const text = value.replace(/^label=/, '')
        const options = [].slice.call(el.getElementsByTagName('option'))
        const option = options.find(op => domText(op) === text)

        if (!option) {
          throw new Error(`cannot find option with label '${text}'`)
        }

        if (extra.playScrollElementsIntoView) scrollElementIntoView(el)
        if (extra.playHighlightElements)
          helpers.highlightDom(el, HIGHLIGHT_TIMEOUT)

        el.value = option.value
        option.selected = true
        const event = document.createEvent('HTMLEvents')
        event.initEvent('change', true, true)
        el.dispatchEvent(event)

        return true
      })
    }

    case 'setContext': {
      const { key, value } = finalParameters
      return {
        context: [{ key, value }]
      }
    }

    case 'setCookie': {
      const { name, value, domain = '.example.com' } = finalParameters
      return csIpc
        .ask('CS_SET_COOKIES', {
          url: window.location.origin,
          name,
          value,
          domain
        })
        .then(() => true)
    }

    case 'setEnvironment': {
      return {
        context: Object.keys(finalParameters).map(key => ({
          key: key,
          value: finalParameters[key]
        }))
      }
    }

    case 'setLocalStorage': {
      const { key, value } = finalParameters
      return setLocalStorage(key, value)
    }

    case 'setSession': {
      const { key, value } = finalParameters
      return setSessionStorage(key, value)
    }

    case 'storeValue': {
      const { target, key } = finalParameters
      return __getElementByLocator(target).then(el => ({
        context: [
          {
            key,
            value: domText(el)
          }
        ]
      }))
    }

    case 'type': {
      const { target, value } = finalParameters
      return __getElementByLocator(target)
        .then(el => setValueForElement(el, value))
        .catch(e => {
          if (/This input element accepts a filename/i.test(e.message)) {
            throw new Error(
              'Sorry, upload can not be automated Chrome (API limitation).'
            )
          }

          throw e
        })
    }

    case 'filterJsonInContext': {
      const { key, resultKey } = finalParameters
      let { locateNode = [], deleteNodes = [] } = finalParameters
      // convert objects to arrays
      locateNode = Object.values(locateNode) // locateNode is a property chain
      deleteNodes = Object.values(deleteNodes).map(nodesToIgnore => {
        // deleteNodes is a list of property chains
        return Object.values(nodesToIgnore)
      })

      const traverseResult = traverseJson(context[key], locateNode)
      const filterResult = filterJson(traverseResult, deleteNodes)

      context[resultKey] = filterResult

      return {
        context: [{ resultKey, filterResult }]
      }
    }

    default:
      throw new Error(`Command ${command} not supported yet`)
  }
}
