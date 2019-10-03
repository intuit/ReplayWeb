/**
 * Logs message to the console when verbose
 * @private
 * @param {string} message - The message to log
 * @param {boolean} verbose - Whether or not to log
 */
export function log(message, verbose = false) {
  if (verbose) {
    console.log(message)
  }
}

/**
 * Wrapper for dynamic importing of plugins
 * @param {string} packageName - The name of the plugin package to attempt to import
 * @param {any} parameters - The parameters to construct the plugin with
 * @returns Constructed Plugin
 */
export function tryRequire(packageName, parameters) {
  try {
    const pack = require(packageName)
    return new pack(parameters)
  } catch (e) {
    throw new Error(`Could not find plugin: "${packageName}", did you forget to install it? -- Actual error: ${e}`)
  }
}

/**
 * Wrapper to parse plugins with and without parameters
 * @param {string|array} data - String or object representing the plugin
 * @returns Constructed Plugin
 */
export function loadPlugin(data) {
  if (typeof data === 'string') {
    return tryRequire(data, {})
  } else if (Array.isArray(data)) {
    const [name, parameters] = data
    return tryRequire(name, parameters)
  } else {
    console.error(`Invalid plugin format: ${JSON.stringify(data)}`)
    console.error('Acceptable formats:')
    console.error("string: the package name that is the plugin")
    console.error("array: the package name that is the plugin")
    console.error("      0 - the package name that is the plugin")
    console.error("      1 - an options object that gets passed to the plugin constructor")
    throw new Error(`Invalid plugin format: ${JSON.stringify(data)}`)
  }
}

/**
 * Gets the executable string for using a selector in the console
 * @private
 * @param {string} selector - The selector to get the string for
 * @returns {string} - A string that can be used by `browser.execute` to access an element
 */
export function getExecElString(selector) {
  if ((/^\//.test(selector))) {
    return `document.evaluate(\`${selector}\`, document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0)`
  } else {
    const el = selector.replace('\\:', '\\\\:')
    return `document.querySelector(\`${el}\`)`
  }
}

/**
 * Helper function to retrieve and wait for elements, for commands where specific existence behavior doesn't matter
 * @private
 * @param {string} target The target to get an element for, in the replay form, eg: id=test
 * @param {number} timeout How long to wait for the element to exist
 */
export const getAndWaitForElement = async (target, timeout = 7000, command, context, hooks) => {
  const element = await browser.$(getSelector(target))
    .then(el => el.waitForExist(timeout).then(() => el))
  if (hooks) {
    await hooks.onElement.promise(element, browser, command, context, process.env.REPLAY_TEST_NAME || '')
  }
  return element
}

/**
 * Helper function to wait for multiple elements
 * Previously this function used Promise.all to fetch elements at the same time
 * This was changed to build the array sequentially because saucelabs was having trouble processing parallel commands
 * @private
 * @param {Array} targets The targets to retrieve
 * @param {number} timeout How long to wait for each target
 */
export const waitForElements = (targets, timeout) => targets.reduce(
  (acc, cv) => acc.then(
    elements => getAndWaitForElement(cv, timeout)
    .then(el => elements.concat(el))
  ),
  Promise.resolve([])
)

/**
 * Unpacks the target into a selector for webdriverio
 * @private
 * @param {string} str - The target that needs to be converted into a selector
 * @returns {string} - The webdriverio compatible selector
 */
export function getSelector(str) {
  const i = str.indexOf('=')
  // is it an xpath selector?
  if ((/^\//.test(str))) {
    return str
  } else if (i === -1) {
    throw new Error(`${str} is not a valid selector`)
  } else {
    const method = str.substr(0, i)
    const value = str.substr(i + 1)
    switch (method && method.toLowerCase()) {
      case 'automation-id':
        return `[data-automation-id="${value}"]`

      case 'automationid':
        return `[automationid="${value}"]`

      case 'id':
        return `//*[@id=\"${value.replace(':', '\\:')}\"]`

      case 'title':
        return `.//*[contains(@${method} ,"${value}")]`

      case 'data-auto-sel':
        return `[data-auto-sel="${value}"]`

      case 'name':
        return `[name="${value}"]`

      case 'identifier':
        return `#${value}`

      case 'link': {
        // const links = [].slice.call(document.getAndWaitForElementsByTagName('a'))
        // Note: there are cases such as 'link=exact:xxx'
        let realVal = value.replace(/^exact:/, '')
        // Note: position support. eg. link=Download@POS=3
        let match = realVal.match(/^(.+)@POS=(\d+)$/i)
        if (match) {
          realVal = match[1]
        }
        return `=${realVal}` // http://webdriver.io/guide/usage/selectors.html
      }

      case 'css': {
        return value
      }

      case 'xpath': {
        return value
      }
      case 'index': {
        return value
      }
    }
  }
}

async function getTableHeader(tableElementLocator) {
  const trs = await browser.$$(getSelector(`${tableElementLocator}//tr`))
  const allThs = await Promise.all(trs.map((_, index) => browser.$$(getSelector(`${tableElementLocator}//tr[${index}]//th`))))
  const tds = allThs.reduce((acc, cv) => acc.concat(cv), []) // reduce 2D array into 1D array
    .map(async th => (await th.getText()).trim()) // get the text for all elements
  const headerRow = (await Promise.all(tds)).filter(thText => thText !== '') // filter out all empty cells
  return headerRow
}

export async function fetchTable(tableElementLocator) {
  const headerList = await getTableHeader(tableElementLocator)
  const trs = await browser.$$(getSelector(`${tableElementLocator}//tr`))
  const fullRows = await Promise.all(trs.map((_, index) => browser.$$(getSelector(`${tableElementLocator}//tr[${index}]//td`))))
  const tableMap = await Promise.all(fullRows.map(tds => Promise.all(tds.map(async td => (await td.getText()).trim()))))
  const tableWithoutHeader = tableMap.filter((row, i) => { //to remove multiple headers
    const header = row.filter((cellText, index) => headerList[index] === cellText)
    return header.length!==headerList.length && i !== 0
  })
  return tableWithoutHeader
}
