import {
  getEnvironment,
  getSeleniumConfig,
  getServices,
  getCapabilities
} from '../../src/configuration'

describe('configuration', () => {
  beforeEach(() => {
    delete process.env.ENV
  })
  describe('getSeleniumConfig', () => {
    it('should return the default config', () => {
      const seleniumConfig = getSeleniumConfig()
      expect(seleniumConfig.version).toBe('3.141.59')
    })
    it('should return the override the port config', () => {
      const seleniumConfig = getSeleniumConfig(undefined, 3000)
      expect(seleniumConfig.seleniumArgs[1]).toBe(3000)
    })
    it('should return the override the selenium version', () => {
      const seleniumConfig = getSeleniumConfig({
        seleniumVersion: '1.2.3'
      })
      expect(seleniumConfig.version).toBe('1.2.3')
    })
    it('should return the override the chrome version', () => {
      const seleniumConfig = getSeleniumConfig({
        chromedriverVersion: '1.2.3'
      })
      expect(seleniumConfig.drivers.chrome.version).toBe('1.2.3')
    })
    it('should return the override the firefox version', () => {
      const seleniumConfig = getSeleniumConfig({
        firefoxdriverVersion: '1.2.3'
      })
      expect(seleniumConfig.drivers.firefox.version).toBe('1.2.3')
    })
    it('should return the override the ie version', () => {
      const seleniumConfig = getSeleniumConfig({
        iedriverVersion: '1.2.3'
      })
      expect(seleniumConfig.drivers.ie.version).toBe('1.2.3')
    })
  })
  describe('getEnvironment', () => {
    it('should return local environment if process.env.ENV is not defined', () => {
      const env = getEnvironment()
      expect(env.hostname).toBe('127.0.0.1')
      expect(env.port).toBe(4444)
    })
    it('should change port of local environment', () => {
      const env = getEnvironment(3000)
      expect(env.hostname).toBe('127.0.0.1')
      expect(env.port).toBe(3000)
    })
  })
  describe('getServices', () => {
    it('should return an empty array when no parameters', () => {
      const services = getServices()
      expect(services).toEqual([])
    })
    it('should return empty array if selenium is set to false', () => {
      const services = getServices(false)
      expect(services).toEqual([])
    })
    it('should return selenium array if provided', () => {
      const services = getServices(true)
      expect(services).toEqual(['selenium-standalone'])
    })
    it('should return applitools array if provided', () => {
      const services = getServices(false, true)
      expect(services).toEqual(['applitools'])
    })
    it('should return both if provided', () => {
      const services = getServices(true, true)
      expect(services).toEqual(['selenium-standalone', 'applitools'])
    })
  })
  describe('getCapabilities', () => {
    it('should return chrome if no flag', () => {
      const caps = getCapabilities()
      const { browserName } = caps[0]
      expect(browserName).toBe('chrome')
    })
    it('should return firefox if cli flag is provided', () => {
      const caps = getCapabilities({}, 'firefox')
      const { browserName } = caps[0]
      expect(browserName).toBe('firefox')
    })
    it('should return added capability if cli flag is provided; should return true for acceptInsecureCerts if not defined', () => {
      const caps = getCapabilities(
        {
          test: {
            browserName: 'test'
          }
        },
        'test'
      )
      const { browserName, acceptInsecureCerts } = caps[0]
      expect(browserName).toBe('test')
      expect(acceptInsecureCerts).toBe(true)
    })
    it('should return chrome and firefox if they are a comma separated list', () => {
      const caps = getCapabilities({}, 'chrome,firefox')
      const { browserName } = caps[0]
      const { browserName: secondBrowser } = caps[1]
      expect(browserName).toBe('chrome')
      expect(secondBrowser).toBe('firefox')
    })
    it('should throw an error if capability name doesnt exist', () => {
      expect(getCapabilities.bind(null, {}, 'ie')).toThrow(
        `Capability with name "ie" not found. Available options are: [chrome,firefox,headless]`
      )
    })
    it('should return true if acceptInsecureCerts flag set to true', () => {
      const caps = getCapabilities(
        {
          test: {
            browserName: 'test',
            acceptInsecureCerts: true
          }
        },
        'test'
      )
      const { browserName, acceptInsecureCerts } = caps[0]
      expect(browserName).toBe('test')
      expect(acceptInsecureCerts).toBe(true)
    })
    it('should return false if acceptInsecureCerts flag set to false', () => {
      const caps = getCapabilities(
        {
          test: {
            browserName: 'test',
            acceptInsecureCerts: false
          }
        },
        'test'
      )
      const { browserName, acceptInsecureCerts } = caps[0]
      expect(browserName).toBe('test')
      expect(acceptInsecureCerts).toBe(false)
    })
  })
})
