import {
  getDefaults,
  getDefaultsVideoPlusAllure,
  __RewireAPI__ as getDefaultsRewire,
  __RewireAPI__ as getDefaultsVideoPlusAllureRewire
} from '../../src'

describe('getDefaults', () => {
  afterEach(() => {
    getDefaultsRewire.__ResetDependency__('argv')
    getDefaultsRewire.__ResetDependency__('removeTemporaryFiles')
  })
  it('should return default config if no options provided', () => {
    const conf = getDefaults()
    expect(conf.seleniumArgs.version).toBe('3.141.59')
    expect(conf.reporters[1][1]).toHaveProperty(
      'outputDir',
      './target/surefire-reports'
    )
    expect(conf.seleniumInstallArgs.drivers.chrome.version).toBe('74.0.3729.6')
    expect(conf.services).toEqual(['selenium-standalone'])
    expect(conf.capabilities).toHaveLength(1)
    expect(conf.capabilities[0].browserName).toBe('chrome')
  })
  it('should return getDefaultsVideoPlusAllure config when options provided', () => {
    const conf = getDefaultsVideoPlusAllure()
    expect(conf.seleniumArgs.version).toBe('3.141.59')
    expect(conf.seleniumInstallArgs.drivers.chrome.version).toBe('74.0.3729.6')
    expect(conf.capabilities).toHaveLength(1)
    expect(conf.capabilities[0].browserName).toBe('chrome')
  })
  it('should change selenium settings', () => {
    const conf = getDefaults({
      selenium: {
        chromedriverVersion: '2.41'
      }
    })
    expect(conf.seleniumArgs.version).toBe('3.141.59')
    expect(conf.seleniumInstallArgs.drivers.chrome.version).toBe('2.41')
    expect(conf.services).toEqual(['selenium-standalone'])
    expect(conf.capabilities).toHaveLength(1)
    expect(conf.capabilities[0].browserName).toBe('chrome')
  })
  it('should change log directory', () => {
    const conf = getDefaults({
      logDir: './log'
    })
    expect(conf.seleniumArgs.version).toBe('3.141.59')
    expect(conf.reporters[1][1]).toHaveProperty('outputDir', './log')
    expect(conf.seleniumInstallArgs.drivers.chrome.version).toBe('74.0.3729.6')
    expect(conf.services).toEqual(['selenium-standalone'])
    expect(conf.capabilities).toHaveLength(1)
    expect(conf.capabilities[0].browserName).toBe('chrome')
  })
  it('should format log file correctly', () => {
    const conf = getDefaults()
    const { outputFileFormat } = conf.reporters[1][1]
    expect(outputFileFormat).toBeDefined()
    expect(outputFileFormat({ cid: '0-0' })).toBe('junit-results-0-0.xml')
    expect(conf.seleniumArgs.version).toBe('3.141.59')
    expect(conf.seleniumInstallArgs.drivers.chrome.version).toBe('74.0.3729.6')
    expect(conf.services).toEqual(['selenium-standalone'])
    expect(conf.capabilities).toHaveLength(1)
    expect(conf.capabilities[0].browserName).toBe('chrome')
  })
  it('should add applitools to services if configured', () => {
    const conf = getDefaults({
      applitools: true
    })
    expect(conf.seleniumArgs.version).toBe('3.141.59')
    expect(conf.seleniumInstallArgs.drivers.chrome.version).toBe('74.0.3729.6')
    expect(conf.services).toEqual(['selenium-standalone', 'applitools'])
    expect(conf.capabilities).toHaveLength(1)
    expect(conf.capabilities[0].browserName).toBe('chrome')
  })
  it('should not start selenium if --selenium-started flag is used', () => {
    getDefaultsRewire.__Rewire__('argv', {
      'selenium-started': true
    })
    const conf = getDefaults()
    expect(conf.seleniumArgs.version).toBe('3.141.59')
    expect(conf.seleniumInstallArgs.drivers.chrome.version).toBe('74.0.3729.6')
    expect(conf.services).toEqual([])
    expect(conf.capabilities).toHaveLength(1)
    expect(conf.capabilities[0].browserName).toBe('chrome')
  })
  it('should change port for --port flag', () => {
    getDefaultsRewire.__Rewire__('argv', {
      port: 3000
    })
    const conf = getDefaults()
    expect(conf.port).toBe(3000)
    expect(conf.seleniumArgs.version).toBe('3.141.59')
    expect(conf.seleniumInstallArgs.drivers.chrome.version).toBe('74.0.3729.6')
    expect(conf.services).toEqual(['selenium-standalone'])
    expect(conf.capabilities).toHaveLength(1)
    expect(conf.capabilities[0].browserName).toBe('chrome')
  })
  it('should change capabilities for --capabilities flag', () => {
    getDefaultsRewire.__Rewire__('argv', {
      caps: 'firefox'
    })
    const conf = getDefaults()
    expect(conf.seleniumArgs.version).toBe('3.141.59')
    expect(conf.seleniumInstallArgs.drivers.chrome.version).toBe('74.0.3729.6')
    expect(conf.services).toEqual(['selenium-standalone'])
    expect(conf.capabilities).toHaveLength(1)
    expect(conf.capabilities[0].browserName).toBe('firefox')
  })
  it('should be able to execute onComplete', () => {
    const removeSpy = jest.fn()
    getDefaultsRewire.__Rewire__('removeTemporaryFiles', removeSpy)
    const conf = getDefaults()
    conf.onComplete()
    expect(conf.seleniumArgs.version).toBe('3.141.59')
    expect(conf.seleniumInstallArgs.drivers.chrome.version).toBe('74.0.3729.6')
    expect(conf.services).toEqual(['selenium-standalone'])
    expect(conf.capabilities).toHaveLength(1)
    expect(conf.capabilities[0].browserName).toBe('chrome')
    expect(removeSpy).toHaveBeenCalled()
  })
  it('should be able to execute onComplete for getDefaultsVideoPlusAllure() to remove removeTemporaryFiles', () => {
    const removeSpy = jest.fn()
    getDefaultsVideoPlusAllureRewire.__Rewire__(
      'removeTemporaryFiles',
      removeSpy
    )
    const conf = getDefaultsVideoPlusAllure()
    conf.onComplete()
    expect(conf.seleniumArgs.version).toBe('3.141.59')
    expect(conf.seleniumInstallArgs.drivers.chrome.version).toBe('74.0.3729.6')
    expect(conf.capabilities).toHaveLength(1)
    expect(conf.capabilities[0].browserName).toBe('chrome')
    expect(removeSpy).toHaveBeenCalled()
  })
})
