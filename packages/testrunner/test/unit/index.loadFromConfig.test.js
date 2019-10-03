import {
  loadFromConfig,
  __RewireAPI__ as loadFromConfigRewire
} from '../../src'

describe.only('loadFromConfig', () => {
  beforeEach(() => {
    // Setup mocks for other functions from testrunner
    loadFromConfigRewire.__Rewire__('runInParallel', () => ([
      './replay-12314/test12.js',
      './replay-12314/test1.js',
      './replay-12314/othertest.js',
      './replay-12314/test2.js',
      './replay-12314/test50.js'
    ]))
    loadFromConfigRewire.__Rewire__('runInParallelAllRegions', () => ([
      './replay-12314/test12.js',
      './replay-12314/test1.js',
      './replay-12314/othertest.js',
      './replay-12314/test2.js'
    ]))
  })
  afterEach(() => {
    loadFromConfigRewire.__ResetDependency__('fs')
  })
  describe('loadFromConfig', () => {
    it('should pull out specs and suites', () => {
      loadFromConfigRewire.__Rewire__('fs', {
        existsSync: () => true,
        readFileSync: () => JSON.stringify({
          testPath: './tests',
          blockPath: './blocks',
          suites: {
            someSuite: [
              'test1',
              'test2'
            ]
          }
        })
      })
      const {specs, suites} = loadFromConfig()
      expect(specs).toHaveLength(5)
      expect(suites).toHaveProperty('someSuite')
      expect(suites.someSuite).toHaveLength(2)
      expect(suites.someSuite).toEqual(expect.arrayContaining(['./replay-12314/test1.js']))
    })
    it('should pull out specs and no suites if not defined', () => {
      loadFromConfigRewire.__Rewire__('fs', {
        existsSync: () => true,
        readFileSync: () => JSON.stringify({
          testPath: './tests',
          blockPath: './blocks'
        })
      })
      const {specs, suites} = loadFromConfig()
      expect(specs).toHaveLength(5)
      expect(suites).toEqual({})
    })
    it('should throw error if invalid JSON in file', () => {
      loadFromConfigRewire.__Rewire__('fs', {
        existsSync: () => true,
        readFileSync: () => ('notJson')
      })
      expect(loadFromConfig.bind(null)).toThrow('replay.config.json did not have valid JSON')
    })
    it('should throw error if testPath does not exist', () => {
      loadFromConfigRewire.__Rewire__('fs', {
        existsSync: (path) => {
          if (path.includes('tests')) {
            return false
          }
          return true
        },
        readFileSync: () => JSON.stringify({
          testPath: './tests',
          blockPath: './blocks'
        })
      })
      expect(loadFromConfig.bind(null)).toThrow('testPath does not exist at')
    })
    it('should print warning if blockPath does not exist', () => {
      loadFromConfigRewire.__Rewire__('fs', {
        existsSync: (path) => {
          if (path.includes('blocks')) {
            return false
          }
          return true
        },
        readFileSync: () => JSON.stringify({
          testPath: './tests',
          blockPath: './blocks'
        })
      })
      let warning = ''
      global.console.warn = (message) => {
        warning = message
      }
      loadFromConfig()
      expect(warning).toEqual('blockPath is defined in replay.config.json but the path does not exist')
    })
    it('should continue normally if blockPath is not defined in config', () => {
      loadFromConfigRewire.__Rewire__('fs', {
        existsSync: () => true,
        readFileSync: () => JSON.stringify({
          testPath: './tests',
          suites: {
            someSuite: [
              'test1',
              'test2'
            ]
          }
        })
      })
      const { specs, suites } = loadFromConfig()
      expect(specs).toHaveLength(5)
      expect(suites).toHaveProperty('someSuite')
      expect(suites.someSuite).toHaveLength(2)
    })
    it('should throw error if config not found', () => {
      loadFromConfigRewire.__Rewire__('fs', {
        existsSync: () => false,
        readFileSync: () => ('notJson')
      })
      expect(loadFromConfig.bind(null)).toThrow('No replay.config.json found in the current directory')
    })
    it('should pull out specs and suites with runInAllRegions=true', () => {
      loadFromConfigRewire.__Rewire__('fs', {
        existsSync: () => true,
        readFileSync: () => JSON.stringify({
          testPath: './tests',
          blockPath: './blocks',
          suites: {
            someSuite: [
              'test1',
              'test2'
            ]
          }
        })
      })
      const {specs, suites} = loadFromConfig('.', true)
      expect(specs).toHaveLength(4)
      expect(suites).toHaveProperty('someSuite')
      expect(suites.someSuite).toHaveLength(2)
      expect(suites.someSuite).toEqual(expect.arrayContaining(['./replay-12314/test1.js']))
    })
  })
})
