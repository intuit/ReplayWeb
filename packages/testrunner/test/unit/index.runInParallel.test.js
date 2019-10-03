import {
  runInParallel,
  getAllBlockContents,
  getJsonTestFiles,
  getJsonFiles,
  log,
  __RewireAPI__ as runInParallelRewire
} from '../../src'

describe('runInParallel', () => {
  beforeEach(() => {
    // Setup mocks for other functions from testrunner
  })
  afterEach(() => {
    runInParallelRewire.__ResetDependency__('fs')
  })
  describe('getAllBlockContents', () => {
    it('should transform block file into {name, data}', () => {
      runInParallelRewire.__Rewire__('fs', {
        readdirSync: () => (['Block1.json']),
        statSync: () => ({
          isDirectory: () => (false)
        }),
        readFileSync: () => ('{"key": "value"}')
      })
      const blocks = getAllBlockContents('./blockPath')
      expect(blocks).toHaveLength(1)
      expect(blocks[0]).toHaveProperty('name', 'Block1')
      expect(blocks[0].data).toHaveProperty('key', 'value')
    })
    it('should throw error if invalid JSON in file', () => {
      runInParallelRewire.__Rewire__('fs', {
        readdirSync: () => (['Block1.json']),
        readFileSync: () => ('notJson')
      })
      expect(getAllBlockContents.bind(null, './blockPath')).toThrow('a')
    })
    it('should log a sub-directory if found', () => {
      runInParallelRewire.__Rewire__('fs', {
        readdirSync: (dir) => {
          switch (dir) {
            case './blockPath':
              return ['dir1']
            default:
              return []
          }
        },
        statSync: (item) => ({
          isDirectory: () => {
            switch (item) {
              case './blockPath':
                case 'blockPath/dir1':
                  return true
              default:
                return false
            }
          }
        })
      })
      const logFn = jest.fn( (msg, bool) => {
        if (bool) {
          return msg
        }
      })
      runInParallelRewire.__Rewire__('log', logFn)
      const expectedLogData = 'index.getAllBlockContents; sub-directory found:\tblockPath/dir1'
      getAllBlockContents('./blockPath')
      expect(logFn.mock.calls.length).toBe(1)
      expect(logFn.mock.results[0].value).toMatch(expectedLogData)
    })
  })
  describe('getJsonFiles', () => {
    it('should return only files that end in .json', () => {
      runInParallelRewire.__Rewire__('fs', {
        readdirSync: () => (['Test1.json', 'Test2.js']),
        statSync: () => ({
          isDirectory: () => (false)
        })
      })
      const files = getJsonFiles('./testPath')
      expect(files).toHaveLength(1)
      expect(files[0]).toBe('testPath/Test1.json')
    })
    it('should get only files that end in .json if there are multiple', () => {
      runInParallelRewire.__Rewire__('fs', {
        readdirSync: () => (['Test1.json', 'Test2.json', 'Test3.js']),
        statSync: () => ({
          isDirectory: () => (false)
        })
      })
      const files = getJsonFiles('./testPath')
      const expected = ['testPath/Test1.json', 'testPath/Test2.json']
      expect(files).toHaveLength(2)
      expect(files.sort()).toEqual(expected.sort())
    })
    it('should return all .json files from parent directory and all sub-directories and use callback for all sub-directories found', () => {
      runInParallelRewire.__Rewire__('fs', {
        readdirSync: (dir) => {
          switch(dir) {
            case './testPath':
              return ['dir1','dir2','dir3','File.json'];
            case 'testPath/dir1':
              return ['File1.json', 'File1.js'];
            case 'testPath/dir2':
              return ['File2.json', 'File2.js'];
            case 'testPath/dir3':
              return ['File3.json', 'File3.js'];
            default:
              return [];
          }
        },
        statSync: (item) => ({
          isDirectory: () => {
            switch (item) {
              case './testPath':
              case 'testPath/dir1':
              case 'testPath/dir2':
              case 'testPath/dir3':
                return true
              default:
                return false
            }
          }
        })
      })
      const subDirs = new Array()
      const files = getJsonFiles('./testPath', (subDir) => {
        subDirs.push(subDir)
      })
      const expected = ['testPath/File.json', 'testPath/dir1/File1.json', 'testPath/dir2/File2.json', 'testPath/dir3/File3.json']
      const expectedSubDirs = ['testPath/dir1', 'testPath/dir2', 'testPath/dir3']
      expect(files).toHaveLength(4)
      expect(files.sort()).toEqual(expected.sort())
      expect(subDirs).toHaveLength(3)
      expect(subDirs.sort()).toEqual(expectedSubDirs.sort())
    })
    it('should retrieve .json files and work properly even if callback is not a function', () => {
      runInParallelRewire.__Rewire__('fs', {
        readdirSync: () => (['Test1.json', 'Test2.js']),
        statSync: () => ({
          isDirectory: () => (false)
        })
      })
      const files = getJsonFiles('./testPath', {})
      expect(files).toHaveLength(1)
      expect(files[0]).toBe('testPath/Test1.json')
    })
  })
  describe('getJsonTestFiles', () => {
    it('should get only the file specified by the --test flag', () => {
      runInParallelRewire.__Rewire__('fs', {
        readdirSync: () => (['Test1.json', 'Test2.json']),
        statSync: () => ({
          isDirectory: () => (false)
        })
      })
      runInParallelRewire.__Rewire__('argv', {
        test: 'Test2'
      })
      const testFiles = getJsonTestFiles('./testPath')
      expect(testFiles).toHaveLength(1)
      expect(testFiles[0]).toBe('Test2.json')
    })
    it('should get only the file specified by the --startsWith flag', () => {
      runInParallelRewire.__Rewire__('fs', {
        readdirSync: () => (['aTest1.json', 'Test2.json', 'aTest3.json']),
        statSync: () => ({
          isDirectory: () => (false)
        })
      })
      runInParallelRewire.__Rewire__('argv', {
        startsWith: 'aTest'
      })
      const testFiles = getJsonTestFiles('./testPath')
      expect(testFiles).toHaveLength(2)
      expect(testFiles[0]).toBe('aTest1.json')
      expect(testFiles[1]).toBe('aTest3.json')
    })
    it('should return all .json files found if argv has no "test" or "startsWith" properties', () => {
      runInParallelRewire.__Rewire__('fs', {
        readdirSync: () => (['aTest1.json', 'Test2.json', 'aTest3.json']),
        statSync: () => ({
          isDirectory: () => (false)
        })
      })
      runInParallelRewire.__Rewire__('argv', {})
      const expectedFiles = ['aTest1.json', 'Test2.json', 'aTest3.json']
      const testFiles = getJsonTestFiles('./testPath')
      expect(testFiles).toHaveLength(3)
      expect(testFiles.sort()).toEqual(expectedFiles.sort())
    })
    it('should log a sub-directory if found', () => {
      runInParallelRewire.__Rewire__('fs', {
        readdirSync: (dir) => {
          switch (dir) {
            case './testPath':
              return ['dir1']
            default:
              return []
          }
        },
        statSync: (item) => ({
          isDirectory: () => {
            switch (item) {
              case './testPath':
              case 'testPath/dir1':
                return true
              default:
                return false
            }
          }
        })
      })
      const logFn = jest.fn( (msg, bool) => {
        if (bool) {
          return msg
        }
      })
      runInParallelRewire.__Rewire__('log', logFn)
      const expectedLogData = 'index.getJsonTestFiles; sub-directory found:\ttestPath/dir1'
      getJsonTestFiles('./testPath')
      expect(logFn.mock.calls.length).toBe(1)
      expect(logFn.mock.results[0].value).toMatch(expectedLogData)
    })
  })
  describe('runInParallel', () => {
    it('should throw error if no json tests found', () => {
      let contents = ''
      runInParallelRewire.__Rewire__('fs', {
        mkdtempSync: () => ('/test/.replay-tests-123'),
        writeFileSync: (path, cont) => (contents = cont)
      })
      runInParallelRewire.__Rewire__('getJsonTestFiles', (testsPath) => ([]))
      expect(runInParallel.bind(null, './tests')).toThrow('No test files found')
    })
    it('should write out test files with no blocks', () => {
      let contents = ''
      runInParallelRewire.__Rewire__('fs', {
        mkdtempSync: () => ('/test/.replay-tests-123'),
        writeFileSync: (path, cont) => (contents = cont)
      })
      runInParallelRewire.__Rewire__('getJsonTestFiles', (testsPath) => (['Test1.json']))
      const testFiles = runInParallel('./tests')
      expect(testFiles).toHaveLength(1)
      expect(testFiles[0]).toBe('/test/.replay-tests-123/Test1.js')
      expect(contents).toEqual(expect.stringContaining('Test1.json'))
    })
    it('should write out test files with blocks', () => {
      let contents = ''
      runInParallelRewire.__Rewire__('fs', {
        mkdtempSync: () => ('/test/.replay-tests-123'),
        writeFileSync: (path, cont) => (contents = cont)
      })
      runInParallelRewire.__Rewire__('getJsonTestFiles', (testsPath) => (['Test1.json']))
      runInParallelRewire.__Rewire__('getAllBlockContents', (testsPath) => (['{"Commands": [{"cmd": "testCommand"}]}']))
      const testFiles = runInParallel('./tests', {blockPath: './blocks'})
      expect(testFiles).toHaveLength(1)
      expect(testFiles[0]).toBe('/test/.replay-tests-123/Test1.js')
      expect(contents).toEqual(expect.stringContaining('testCommand'))
    })
    it('should write out test files with retries', () => {
      let contents = ''
      runInParallelRewire.__Rewire__('fs', {
        mkdtempSync: () => ('/test/.replay-tests-123'),
        writeFileSync: (path, cont) => (contents = cont)
      })
      runInParallelRewire.__Rewire__('getJsonTestFiles', (testsPath) => (['Test1.json']))
      const testFiles = runInParallel('./tests', {retries: 4})
      expect(testFiles).toHaveLength(1)
      expect(testFiles[0]).toBe('/test/.replay-tests-123/Test1.js')
      expect(contents).toEqual(expect.stringContaining('retries(4)'))
    })
    it('should write out test files with timeout', () => {
      let contents = ''
      runInParallelRewire.__Rewire__('fs', {
        mkdtempSync: () => ('/test/.replay-tests-123'),
        writeFileSync: (path, cont) => (contents = cont)
      })
      runInParallelRewire.__Rewire__('getJsonTestFiles', (testsPath) => (['Test1.json']))
      const testFiles = runInParallel('./tests', {timeout: 5678})
      expect(testFiles).toHaveLength(1)
      expect(testFiles[0]).toBe('/test/.replay-tests-123/Test1.js')
      expect(contents).toEqual(expect.stringContaining('timeout(5678)'))
    })
  })
})
