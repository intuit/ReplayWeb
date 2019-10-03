import {
  runInParallelAllRegions,
  expandLoginBlockForAllRegions,
  __RewireAPI__ as runInParallelAllRegionsRewire
} from '../../src'

describe('runInParallelAllRegions', () => {
  afterEach(() => {
    runInParallelAllRegionsRewire.__ResetDependency__('fs')
    runInParallelAllRegionsRewire.__ResetDependency__('getJsonTestFiles')
    runInParallelAllRegionsRewire.__ResetDependency__('getAllBlockContents')
    runInParallelAllRegionsRewire.__ResetDependency__('expandLoginBlockForAllRegions')
  })
  describe('expandLoginBlockForAllRegions', () => {
    it('should return new commands with login blocks', () => {
      const cmds = [{key: 'value'}]
      const blocks = [
        {
          data: {
            commands: [
              {
                cmd: 'test',
                parameters: {
                  locale: 'en-ca'
                }
              }, {
                cmd: 'test',
                parameters: {
                  value: 'value'
                }
              }
            ]
          }
        }
      ]
      const allCmds = expandLoginBlockForAllRegions(cmds, blocks)
      expect(allCmds).toHaveLength(1)
      expect(allCmds[0].locale).toBe('en-ca')
      expect(allCmds[0].commands).toHaveLength(3)
    })

    it('should not throw error if blocks is empty', () => {
      const cmds = [{key: 'value'}]
      const blocks = []
      const allCmds = expandLoginBlockForAllRegions(cmds, blocks)
      expect(allCmds).toHaveLength(0)
    })
  })
  describe('runInParallelAllRegions', () => {
    it('should throw error if no json tests found', () => {
      let contents = ''
      runInParallelAllRegionsRewire.__Rewire__('fs', {
        existsSync: (path) => true,
        mkdtempSync: () => ('/test/.replay-tests-123'),
        writeFileSync: (path, cont) => (contents = cont)
      })
      runInParallelAllRegionsRewire.__Rewire__('getJsonTestFiles', (testsPath) => ([]))
      runInParallelAllRegionsRewire.__Rewire__('getAllBlockContents', (path) => [{cmd: 'test'}])
      expect(runInParallelAllRegions.bind(null, './tests', {loginBlockPath: './loginBlocks'})).toThrow('No test files found')
    })
    it('should throw error if loginBlocks path is undefined', () => {
      let contents = ''
      runInParallelAllRegionsRewire.__Rewire__('fs', {
        existsSync: (path) => true,
        mkdtempSync: () => ('/test/.replay-tests-123'),
        writeFileSync: (path, cont) => (contents = cont),
        readFileSync: (path) => ('{"key": "value"}')
      })
      runInParallelAllRegionsRewire.__Rewire__('getJsonTestFiles', (testsPath) => (['Test1.json']))
      runInParallelAllRegionsRewire.__Rewire__('getAllBlockContents', (path) => [])
      expect(runInParallelAllRegions.bind(null, './tests')).toThrow('loginBlockPath is undefined in replay.config.json but runInAllRegions is true')
    })
    it('should throw error if loginBlocks does not exist', () => {
      let contents = ''
      runInParallelAllRegionsRewire.__Rewire__('fs', {
        existsSync: (path) => false,
        mkdtempSync: () => ('/test/.replay-tests-123'),
        writeFileSync: (path, cont) => (contents = cont),
        readFileSync: (path) => ('{"key": "value"}')
      })
      runInParallelAllRegionsRewire.__Rewire__('getJsonTestFiles', (testsPath) => (['Test1.json']))
      runInParallelAllRegionsRewire.__Rewire__('getAllBlockContents', (path) => [])
      expect(runInParallelAllRegions.bind(null, './tests', {loginBlockPath: './loginBlocks'})).toThrow('loginBlockPath is defined in replay.config.json but the path does not exist')
    })
    it('should throw error if no login blocks', () => {
      let contents = ''
      runInParallelAllRegionsRewire.__Rewire__('fs', {
        existsSync: (path) => true,
        mkdtempSync: () => ('/test/.replay-tests-123'),
        writeFileSync: (path, cont) => (contents = cont),
        readFileSync: (path) => ('{"key": "value"}')
      })
      runInParallelAllRegionsRewire.__Rewire__('getJsonTestFiles', (testsPath) => (['Test1.json']))
      runInParallelAllRegionsRewire.__Rewire__('getAllBlockContents', (path) => [])
      expect(runInParallelAllRegions.bind(null, './tests', {loginBlockPath: './loginBlocks'})).toThrow('No login blocks found in path')
    })
    it('should write out test files with no blocks', () => {
      let contents = ''
      runInParallelAllRegionsRewire.__Rewire__('fs', {
        existsSync: (path) => true,
        mkdtempSync: () => ('/test/.replay-tests-123'),
        writeFileSync: (path, cont) => (contents = cont),
        readFileSync: (path) => ('{"key": "value"}')
      })
      runInParallelAllRegionsRewire.__Rewire__('getJsonTestFiles', (testsPath) => (['Test1.json']))
      runInParallelAllRegionsRewire.__Rewire__('expandLoginBlockForAllRegions',
        (commands, blocks) => ([{locale: 'en-ca', commands: [{key: 'value'}]}]))
      runInParallelAllRegionsRewire.__Rewire__('getAllBlockContents', (path) => {
        if (path.includes('loginBlocks')) return [{cmd: 'test'}]
        else return []
      })
      const testFiles = runInParallelAllRegions('./tests', {loginBlockPath: './loginBlocks'})
      expect(testFiles).toHaveLength(1)
      expect(testFiles[0]).toBe('/test/.replay-tests-123/Test1_en-ca.js')
      expect(contents).toEqual(expect.stringContaining('Test1 --> en-ca'))
    })

    it('should write out test files with login blocks and blocks', () => {
      let contentsENCA = ''
      let contentsFRCA = ''
      runInParallelAllRegionsRewire.__Rewire__('fs', {
        existsSync: (path) => true,
        mkdtempSync: () => ('/test/.replay-tests-123'),
        writeFileSync: (path, cont) => {
          if (path.includes('en-ca')) (contentsENCA = cont)
          else contentsFRCA = cont
        },
        readFileSync: (path) => ('{"key": "value"}')
      })
      runInParallelAllRegionsRewire.__Rewire__('getJsonTestFiles', (testsPath) => (['Test1.json']))
      runInParallelAllRegionsRewire.__Rewire__('getAllBlockContents', (testsPath) => {
        if (testsPath.includes('blocks')) return ['{"Commands": [{"cmd": "testCommand"}]}']
        else return ['{"Commands": [{"login-cmd-1": "testCommand"}]}', '{"Commands": [{"login-cm2": "testCommand"}]}']
      })
      runInParallelAllRegionsRewire.__Rewire__('expandLoginBlockForAllRegions', (commands, blocks) => {
        return [
          {locale: 'en-ca', commands: [{'login-enca': 'testCommand'}, {cmd: 'value'}]},
          {locale: 'fr-ca', commands: [{'login-frca': 'testCommand'}, {cmd: 'value'}]}
        ]
      })

      const testFiles = runInParallelAllRegions('./tests', {blockPath: './blocks', loginBlockPath: './loginBlocks'})
      expect(testFiles).toHaveLength(2)
      expect(testFiles[0]).toBe('/test/.replay-tests-123/Test1_en-ca.js')
      expect(contentsENCA).toEqual(expect.stringContaining('login-enca'))
      expect(contentsFRCA).toEqual(expect.stringContaining('login-frca'))
    })

    it('should write out test files with retries', () => {
      let contents = ''
      runInParallelAllRegionsRewire.__Rewire__('fs', {
        existsSync: (path) => true,
        mkdtempSync: () => ('/test/.replay-tests-123'),
        writeFileSync: (path, cont) => (contents = cont),
        readFileSync: (path) => ('{"key": "value"}')
      })
      runInParallelAllRegionsRewire.__Rewire__('getJsonTestFiles', (testsPath) => (['Test1.json']))
      runInParallelAllRegionsRewire.__Rewire__('getAllBlockContents', (testsPath) => {
        if (testsPath.includes('blocks')) return []
        else return ['{"Commands": [{"login-cmd-1": "testCommand"}]}']
      })
      runInParallelAllRegionsRewire.__Rewire__('expandLoginBlockForAllRegions', (commands, blocks) => {
        return [
          {locale: 'en-ca', commands: [{'login-enca': 'testCommand'}, {cmd: 'value'}]}
        ]
      })
      const testFiles = runInParallelAllRegions('./tests', {retries: 4, loginBlockPath: './loginBlocks'})
      expect(testFiles).toHaveLength(1)
      expect(testFiles[0]).toBe('/test/.replay-tests-123/Test1_en-ca.js')
      expect(contents).toEqual(expect.stringContaining('retries(4)'))
    })
    it('should write out test files with timeout', () => {
      let contents = ''
      runInParallelAllRegionsRewire.__Rewire__('fs', {
        existsSync: (path) => true,
        mkdtempSync: () => ('/test/.replay-tests-123'),
        writeFileSync: (path, cont) => (contents = cont),
        readFileSync: (path) => ('{"key": "value"}')
      })
      runInParallelAllRegionsRewire.__Rewire__('getJsonTestFiles', (testsPath) => (['Test1.json']))
      runInParallelAllRegionsRewire.__Rewire__('getAllBlockContents', (testsPath) => {
        if (testsPath.includes('blocks')) return []
        else return ['{"Commands": [{"login-cmd-1": "testCommand"}]}']
      })
      runInParallelAllRegionsRewire.__Rewire__('expandLoginBlockForAllRegions', (commands, blocks) => {
        return [
          {locale: 'en-ca', commands: [{'login-enca': 'testCommand'}, {cmd: 'value'}]}
        ]
      })
      const testFiles = runInParallelAllRegions('./tests', {timeout: 5678, loginBlockPath: './loginBlocks'})
      expect(testFiles).toHaveLength(1)
      expect(testFiles[0]).toBe('/test/.replay-tests-123/Test1_en-ca.js')
      expect(contents).toEqual(expect.stringContaining('timeout(5678)'))
    })
    it('Should write test files with passing metadata', () => {
      let contents = ''
      runInParallelAllRegionsRewire.__Rewire__('fs', {
        existsSync: (path) => true,
        mkdtempSync: () => ('/test/.replay-tests-123'),
        writeFileSync: (path, cont) => (contents = cont),
        readFileSync: (path) => ('{"commands": [{"key": "value"}], "metadata": {"md-key": "md-value"}}')
      })
      runInParallelAllRegionsRewire.__Rewire__('getJsonTestFiles', (testsPath) => (['Test1.json']))
      runInParallelAllRegionsRewire.__Rewire__('getAllBlockContents', (testsPath) => {
        if (testsPath.includes('blocks')) return []
        else return ['{"Commands": [{"login-cmd-1": "testCommand"}]}']
      })
      runInParallelAllRegionsRewire.__Rewire__('expandLoginBlockForAllRegions', (commands, blocks) => {
        return [
          {locale: 'en-ca', commands: [{'login-enca': 'testCommand'}, {cmd: 'value'}]}
        ]
      })
      const testFiles = runInParallelAllRegions('./tests', {timeout: 5678, loginBlockPath: './loginBlocks'})
      expect(testFiles).toHaveLength(1)
      expect(testFiles[0]).toBe('/test/.replay-tests-123/Test1_en-ca.js')
      console.log('----- contents -------')
      console.log(contents)
      expect(contents).toEqual(expect.stringContaining('{"md-key":"md-value"}'))
    })
  })
})
