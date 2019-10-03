import {removeTemporaryFiles, __RewireAPI__ as removeTemporaryFilesRewire} from '../../src'

describe('removeTemporaryFiles', () => {
  beforeEach(() => {
    global.browser = {}
    global.process.cwd = () => ('/test')
  })
  afterEach(() => {
    removeTemporaryFilesRewire.__ResetDependency__('fs')
    removeTemporaryFilesRewire.__ResetDependency__('process')
  })
  it('should remove temporary files if they are not directories', () => {
    const unlinked = []
    removeTemporaryFilesRewire.__Rewire__('fs', {
      readdirSync: (path) => (['.replay-tests-123']),
      lstatSync: () => ({isDirectory: () => false}),
      unlinkSync: (path) => unlinked.push(path)
    })
    removeTemporaryFiles()
    expect(unlinked).toHaveLength(1)
  })
  it('should remove temporary files if they are not directories and filter', () => {
    const unlinked = []
    removeTemporaryFilesRewire.__Rewire__('fs', {
      readdirSync: (path) => (['.replay-tests-123', '.babelrc']),
      lstatSync: () => ({isDirectory: () => false}),
      unlinkSync: (path) => unlinked.push(path)
    })
    removeTemporaryFiles()
    expect(unlinked).toHaveLength(1)
  })
  it('should remove temporary files if they are are directories', () => {
    const unlinked = []
    const rmdirs = []
    removeTemporaryFilesRewire.__Rewire__('fs', {
      readdirSync: (path) => path === '/test/.replay-tests-123' ? ['SomeTest.json'] : ['.replay-tests-123'],
      lstatSync: () => ({isDirectory: () => true}),
      unlinkSync: (path) => unlinked.push(path),
      rmdirSync: (path) => rmdirs.push(path)
    })
    removeTemporaryFiles()
    expect(unlinked).toHaveLength(1)
    expect(rmdirs).toHaveLength(1)
  })
  it('should remove temporary files if they are are directories and filter', () => {
    const unlinked = []
    const rmdirs = []
    removeTemporaryFilesRewire.__Rewire__('fs', {
      readdirSync: (path) => path === '/test/.replay-tests-123' ? ['SomeTest.json'] : ['.replay-tests-123', 'src'],
      lstatSync: () => ({isDirectory: () => true}),
      unlinkSync: (path) => unlinked.push(path),
      rmdirSync: (path) => rmdirs.push(path)
    })
    removeTemporaryFiles()
    expect(unlinked).toHaveLength(1)
    expect(rmdirs).toHaveLength(1)
  })
})
