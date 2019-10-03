import {
  regExpMatch,
  replaceAllFields,
  traverseJson,
  filterJson,
  setLocalStorage,
  getLocalStorage,
  setSessionStorage,
  getSessionStorage
} from '@replayweb/utils'
import {expect} from 'chai'
import {
  getAndWaitForElement,
  getExecElString,
  getSelector,
  fetchTable
} from './utilities'
import deepEqual from 'deep-equal'

/**
 * Logs message to the console when verbose
 * @private
 * @param {Object} Command - The command object to run
 * @param {string} Command.command - The command to execute
 * @param {string} Command.parameters - The parameters for the command
 * @param {Object} context - An object for static string replacements
 * @returns {Promise} - A promise chain of webdriverio commands
 */
export async function runCommand ({ command, parameters }, context, implicitWait, hooks) {
  const finalParameters = await replaceAllFields(parameters, context)
  await hooks.beforeCommand.promise({command, parameters: finalParameters}, context, browser)
  const tools = {getSelector, getAndWaitForElement, implicitWait, context, hooks}

  switch (command) {
    case 'assertAttribute': {
      const { target, attribute, expected } = finalParameters
      return getAndWaitForElement(target, implicitWait, {command, parameters: finalParameters}, context, hooks)
        .then(el => el.getAttribute(attribute))
        .then(attributeValue => {
          const re = expected.match(/^\/.+\/$/) ? regExpMatch(expected, attributeValue) : expected
          return expect(attributeValue).to.equal(re)
        })
    }

    case 'assertCheckboxState': {
      const {target, expected} = finalParameters
      return getAndWaitForElement(target, implicitWait, {command, parameters: finalParameters}, context, hooks)
        .then(el => {
          return Promise.all([el.getAttribute('type'), el.getAttribute('checked')]).then(([type, checked]) => {
            return expect(type === 'checkbox' && Boolean(checked) === Boolean(expected)).to.equal(true)
          })
        })
    }

    case 'assertClassDoesNotExist': {
      const { target, class: assertClass } = finalParameters
      return getAndWaitForElement(target, implicitWait, {command, parameters: finalParameters}, context, hooks)
        .then(el => el.getAttribute('class'))
        .then(classes => expect(classes.split(' ')).to.not.include(assertClass))
    }

    case 'assertClassExists': {
      const { target, class: assertClass } = finalParameters
      return getAndWaitForElement(target, implicitWait, {command, parameters: finalParameters}, context, hooks)
        .then(el => el.getAttribute('class'))
        .then(classes => expect(classes.split(' ')).to.include(assertClass))
    }

    case 'assertElementPresent': {
      const { target, timeout } = finalParameters
      return browser.$(getSelector(target))
        .then(el => el.waitForExist(parseInt(timeout) || implicitWait))
    }

    case 'assertElementNotPresent': {
      const { target, timeout } = finalParameters
      return browser.$(getSelector(target))
        .then(el => el.waitForExist(parseInt(timeout) || implicitWait, true))
    }

    case 'assertElementVisible': {
      const { target, timeout } = finalParameters
      return browser.$(getSelector(target))
        .then(el => el.waitForDisplayed(parseInt(timeout) || implicitWait))
    }

    case 'assertElementNotVisible': {
      const { target, timeout } = finalParameters
      return browser.$(getSelector(target))
        .then(el => el.waitForDisplayed(parseInt(timeout) || implicitWait, true))
    }

    case 'assertLocalStorage': {
      const {key, expected} = finalParameters
      return browser.execute(getLocalStorage, key)
        .then(value => expect(value).to.equal(expected))
    }

    case 'assertSessionStorage': {
      const {key, expected} = finalParameters
      return browser.execute(getSessionStorage, key)
        .then(value => expect(value).to.equal(expected))
    }

    case 'assertStyle': {
      const { target, property, expected } = finalParameters
      /*
      * using browser.execute for consistency between the extension and testrunner
      * browser.getCssProperty returns some styles in a different format
      * getComputedProperty for 'color' => rgb(X, X, X)
      * getCssProperty for 'color' => rgba(X, X, X, X)
      */

      // if the selector strategy is id, replace it with identifier to get an id in the form #someid so it works in queryselector
      const newTarget = target.indexOf('id=') === 0 ? target.replace('id=', 'identifier=') : target
      const execString = `return window.getComputedStyle(document.querySelector(\`${getSelector(newTarget)}\`))['${property}']`
      return getAndWaitForElement(target, implicitWait, {command, parameters: finalParameters}, context, hooks)
        .then(el => browser.execute(execString))
        .then(computed => {
          if (computed === undefined) {
            return Promise.reject(new Error(`style '${property}' not found on element ${target}`))
          }
          return expect(computed).to.equal(expected)
        })
    }

    case 'assertTableNotEmpty': {
      const { target } = finalParameters
      return fetchTable(target).then(
        table => expect(table).to.have.length.of.at.least(1)
      )
    }

    case 'assertText': {
      const { target, expected = '' } = finalParameters
      return getAndWaitForElement(target, implicitWait, {command, parameters: finalParameters}, context, hooks)
        .then(
          el => Promise.all([
            el.getText(),
            el.getValue()
          ])
            .then(([text, value]) => {
              const data = text !== '' ? text : value || ''
              const re = expected.match(/^\/.+\/$/) ? regExpMatch(expected, data) : expected
              return expect(data).to.equal(re)
            })
        )
    }

    case 'assertTitle': {
      const { expected } = finalParameters
      return browser.getTitle()
        .then(title => expect(title).to.equal(expected))
    }

    case 'assertUrl': {
      const { expected } = finalParameters
      return browser.getUrl()
        .then(url => expect(url).to.equal(expected))
    }

    case 'assertJsonInContext': {
      const { key, expected } = finalParameters

      return expect(deepEqual(context[key], expected)).to.equal(true)
    }

    // END ASSERTS
    // *************************************************************************
    case 'captureScreenshot': {
      return browser.takeScreenshot()
    }

    case 'clearValue': {
      const { target } = finalParameters
      return getAndWaitForElement(target, implicitWait, {command, parameters: finalParameters}, context, hooks)
        .then(el => el.clearValue())
    }

    case 'click':
    case 'clickAndWait': {
      const { target } = finalParameters
      getSelector(target)
      return getAndWaitForElement(target, implicitWait, {command, parameters: finalParameters}, context, hooks)
        .then(el => el.click())
    }

    case 'comment': {
      return Promise.resolve(true)
    }

    case 'debug': {
      return browser.debug()
    }

    case 'deleteAllCookies':
      return browser.deleteCookies()

    case 'dragAndDropToObject':
      const { startTarget, endTarget } = finalParameters
      return Promise.all([
        getAndWaitForElement(startTarget, implicitWait, {command, parameters: finalParameters}, context), hooks,
        getAndWaitForElement(endTarget, implicitWait, {command, parameters: finalParameters}, context, hooks)
      ]).then(([el, _]) => el.dragAndDrop(getSelector(endTarget)))

    case 'http': {
      const {
        url,
        method = 'GET',
        body,
        headers = {},
        key
      } = finalParameters
      return fetch(
        url,
        {
          method,
          body: body ? JSON.stringify(body) : undefined,
          headers: new Headers(headers)
        }
      )
        .then(res => {
          if (parseInt(res.status) >= 300) {
            return Promise.reject(new Error(`Error in ${method} call to ${url}:\nResponse code was ${res.status}`))
          }
          return res.json()
        })
        .then(value => {
          context[key] = value
        })
    }

    case 'mouseOver': {
      const { target } = finalParameters
      return getAndWaitForElement(target, implicitWait, {command, parameters: finalParameters}, context, hooks)
        .then(el => el.moveTo())
    }

    case 'mouseEvent': {
      const { target } = finalParameters
      const sel = getSelector(target)
      return ['mouseover', 'mousedown', 'mouseup', 'click']
        .reduce(
          (acc, cv) => acc.then(() => browser.execute(getExecElString(sel) + '.dispatchEvent(new MouseEvent("' + cv + '", { bubbles: true }))')),
          getAndWaitForElement(target, implicitWait, {command, parameters: finalParameters}, context, hooks)
        )
        .catch(e => {
          if (!e.message.includes('Cannot read property \'dispatchEvent\' of null')) {
            throw e
          }
        })
    }

    case 'open': {
      const { url } = finalParameters
      return browser.url(url).then(() => browser.pause(2000))
    }

    case 'pause': {
      const { millis } = finalParameters
      const time = isNaN(parseInt(millis)) ? 3000 : parseInt(millis)
      return browser.pause(time)
    }

    case 'refresh': {
      return browser.refresh()
    }

    case 'select': {
      const { target, value } = finalParameters
      const text = value.replace(/^label=/, '')
      return getAndWaitForElement(target, implicitWait, {command, parameters: finalParameters}, context, hooks)
        .then(el => el.selectByVisibleText(text))
    }

    case 'selectAndWait': {
      const { target, value } = finalParameters
      const text = value.replace(/^label=/, '')
      return getAndWaitForElement(target, implicitWait, {command, parameters: finalParameters}, context, hooks)
        .then(el => el.selectByVisibleText(text))
        .then(() => browser.pause(3000))
    }

    case 'selectFrame': {
      const { target } = finalParameters
      const sel = getSelector(target)
      if (target.split('=')[0] === 'index') {
        return browser.switchToFrame(parseInt(sel))
      } else if (target.split('=')[0] === 'relative') {
        // use null so webdriverio will select the main DOM
        return browser.switchToFrame(null)
      } else {
        return browser.$(getSelector(target))
          .then(el => browser.switchToFrame(el))
      }
    }

    case 'setContext': {
      const { key, value } = finalParameters
      return new Promise((resolve, reject) => {
        context[key] = value
        resolve(true)
      })
    }

    case 'setCookie': {
      const { name, value, domain = '.example.com' } = finalParameters
      return browser.setCookies({ name, value, domain })
    }

    case 'setEnvironment': {
      return new Promise((resolve, reject) => {
        Object.keys(finalParameters).forEach(key => {
          context[key] = finalParameters[key]
        })
        resolve(true)
      })
    }

    case 'setLocalStorage': {
      const { key, value } = finalParameters
      return browser.execute(setLocalStorage, key, value)
    }

    case 'setSession': {
      const { key, value } = finalParameters
      return browser.execute(setSessionStorage, key, value)
        .then(() => browser.refresh())
    }

    case 'storeValue': {
      const { target, key } = finalParameters
      return getAndWaitForElement(target, implicitWait, {command, parameters: finalParameters}, context, hooks)
        .then(
          el => Promise.all([
            el.getText(),
            el.getValue()
          ])
            .then(([text, value]) => {
              const data = text !== '' ? text : value || ''
              context[key] = data
            })
        )
    }

    case 'type': {
      const { target, value } = finalParameters
      return getAndWaitForElement(target, implicitWait, {command, parameters: finalParameters}, context, hooks)
        .then(el => el.setValue(value))
    }

    case 'filterJsonInContext': {
      const { key, resultKey } = finalParameters
      let { locateNode = [], deleteNodes = [] } = finalParameters
      // convert objects to arrays
      locateNode = Object.values(locateNode) // locateNode is a property chain
      deleteNodes = Object.values(deleteNodes).map((nodesToIgnore) => { // deleteNodes is a list of property chains
        return Object.values(nodesToIgnore)
      })

      const traverseResult = traverseJson(context[key], locateNode)
      const filterResult = filterJson(traverseResult, deleteNodes)

      context[resultKey] = filterResult
      break
    }

    default: {
      throw new Error(`Command "${command}" not supported yet. Do you need to update  @replayweb/testrunner?`)
    }
  }
}
