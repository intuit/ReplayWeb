/**
 * Generates a config for @wdio/selenium-standalone-service
 * @param {Object} options An options object with version overrides
 * @param {string} options.seleniumVersion The version of selenium to use
 * @param {string} options.chromedriverVersion The version of selenium to use
 * @param {string} options.firefoxdriverVersion The version of firefoxdriver to use
 * @param {string} options.iedriverVersion The version of iedriver to use
 * @param {number} port The port to start selenium on
 * @returns {Object} A config object for @wdio/selenium-standalone-service
 */
export function getSeleniumConfig (options = {}, port = 4444) {
  // Set default values to use latest version
  const {
    seleniumVersion = '3.141.59',
    chromedriverVersion = '74.0.3729.6',
    firefoxdriverVersion = '0.24.0',
    iedriverVersion = '3.4.0'
  } = options
  return {
    seleniumArgs: ['-port', port],
    version: seleniumVersion,
    seleniumDownloadURL: 'https://selenium-release.storage.googleapis.com',
    drivers: {
      chrome: {
        version: chromedriverVersion,
        arch: process.arch,
        baseURL: 'https://chromedriver.storage.googleapis.com'
      },
      ie: {
        version: iedriverVersion,
        arch: process.arch,
        baseURL: 'https://selenium-release.storage.googleapis.com'
      },
      firefox: {
        version: firefoxdriverVersion,
        arch: process.arch,
        baseURL: 'https://github.com/mozilla/geckodriver/releases/download'
      }
    }
  }
}

/**
 * Generates an environment config for webdriverio
 * Switches environment using an environment variable ENV so it works in child processes of wdio
 *
 * @param {number} port The port to use locally
 * @returns {Object} An environment config
 */
export function getEnvironment (port = 4444) {
  const environments = {
    local: {
      hostname: '127.0.0.1',
      port: port,
      path: '/wd/hub',
      protocol: 'http'
    }
  }
  return environments[process.env.ENV || 'local']
}

/**
 * Generates an array of services for selenium and applitools if configured
 * @param {boolean} selenium Whether or not to add selenium-standalone to the services
 * @param {boolean} applitoolsWhether or not to add applitools to the services
 * @returns {Array} An array of strings with service names
 */
export function getServices (selenium, applitools) {
  return [
    selenium ? 'selenium-standalone' : false,
    applitools ? 'applitools' : false
  ].filter(e => e)
}

/**
 * Generates an array of capability objects to use for the test run
 * @param {Object} capabilities Additional capabilities to add to the defaults so they can be accessed with --capabilities
 * @param {string} flag The string flag from the command line, comma separated names of capabilities to use for the test run
 * @returns {Array} Array of capability objects
 */
export function getCapabilities (capabilities = {}, flag) {
  const defaultCapabilities = {
    chrome: {
      browserName: 'chrome',
      acceptInsecureCerts: true,
      'goog:chromeOptions': {
        args: []
      }
    },
    firefox: {
      browserName: 'firefox',
      acceptInsecureCerts: true
    },
    headless: {
      browserName: 'chrome',
      acceptInsecureCerts: true,
      'goog:chromeOptions': {
        args: ['headless']
      }
    }
  }
  const allCapabilities = {
    ...defaultCapabilities,
    ...capabilities
  }
  const caps = flag === undefined
    ? [defaultCapabilities.chrome]
    : flag.split(',').map(
      cap => {
        if (!allCapabilities[cap]) {
          throw new Error(`Capability with name "${cap}" not found. Available options are: [${Object.keys(allCapabilities).join(',')}]`)
        }
        // Make sure all capabilities accept insecure certs for automation unless specified to be false

        const aic = allCapabilities[cap].acceptInsecureCerts !== false
        return {
          ...allCapabilities[cap],
          acceptInsecureCerts: aic
        }
      }
    )
  return caps
}
