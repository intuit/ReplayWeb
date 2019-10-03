import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {
  expandHome,
  getDirectoryContents,
  readFile,
  readFiles,
  saveFile,
  deleteFile,
  makeDirectory,
  __RewireAPI__ as filesystemRewire
} from '../src/lib/filesystem'
chai.use(chaiAsPromised)
const expect = chai.expect

describe('Filesystem', () => {
  describe('expandHome', () => {
    it('should not modify a path with no ~', () => {
      expect(expandHome('/absolute/path')).to.equal('/absolute/path')
    })
    it('should expand ~', () => {
      global.process.env.HOME = '/potato'
      expect(expandHome('~/absolute/path')).to.equal('/potato/absolute/path')
    })
  })
  describe('makeDirectory', () => {
    beforeEach(() => {
      filesystemRewire.__Rewire__('expandHome', () => '/test')
    })
    afterEach(() => {
      filesystemRewire.__ResetDependency__('fs')
      filesystemRewire.__ResetDependency__('expandHome')
    })
    it('should create a directory', () => {
      // mock fs
      filesystemRewire.__Rewire__('mkdirp', (path, cb) =>{
        cb(undefined)
      })
      expect(makeDirectory('~/test')).to.eventually.be.fulfilled
    })
    it('should throw an error if mkdirp fails', () => {
      // mock fs
      filesystemRewire.__Rewire__('mkdirp', (path, cb) =>{
        cb(new Error('fakeError'))
      })
      expect(makeDirectory('~/test')).to.eventually.be.rejectedWith('fakeError')
    })
  })
  describe('getDirectoryContents', () => {
    beforeEach(() => {
      filesystemRewire.__Rewire__('expandHome', () => '/test')
    })
    afterEach(() => {
      filesystemRewire.__ResetDependency__('fs')
      filesystemRewire.__ResetDependency__('expandHome')
    })
    it('should list files from directory', () => {
      // mock fs
      filesystemRewire.__Rewire__('fs', {
        readdirSync: () => ['Test.json'],
        lstatSync: () => ({
          isDirectory: () => false
        })
      })
      const contents = getDirectoryContents('~/test')
      expect(contents).to.have.length(1)
      expect(contents[0].name).to.equal('Test.json')
      expect(contents[0].isDirectory).to.be.false
      expect(contents[0].fullpath).to.equal('~/test/Test.json')
    })
    it('should list files from directory and filter dot files/folders', () => {
      // mock fs
      filesystemRewire.__Rewire__('fs', {
        readdirSync: () => ['..', 'Test.json', '.'],
        lstatSync: () => ({
          isDirectory: () => false
        })
      })
      const contents = getDirectoryContents('~/test')
      expect(contents).to.have.length(1)
      expect(contents[0].name).to.equal('Test.json')
      expect(contents[0].isDirectory).to.be.false
      expect(contents[0].fullpath).to.equal('~/test/Test.json')
    })
    it('should list folders from directory and filter dot files/folders', () => {
      // mock fs
      filesystemRewire.__Rewire__('fs', {
        readdirSync: () => ['..', 'tests', '.'],
        lstatSync: () => ({
          isDirectory: () => true
        })
      })
      const contents = getDirectoryContents('~/test')
      expect(contents).to.have.length(1)
      expect(contents[0].name).to.equal('tests')
      expect(contents[0].isDirectory).to.be.true
      expect(contents[0].fullpath).to.equal('~/test/tests')
    })
  })
  describe('readFile', () => {
    afterEach(() => {
      filesystemRewire.__ResetDependency__('fs')
      filesystemRewire.__ResetDependency__('expandHome')
    })
    beforeEach(() => {
      filesystemRewire.__Rewire__('expandHome', () => '/test')
    })
    it('should throw error if file data is not json', () => {
      filesystemRewire.__Rewire__('fs', {
        readFileSync: () => 'REJECT'
      })
      expect(readFile).to.throw('Unexpected token')
    })
    it('should read the file contents', () => {
      filesystemRewire.__Rewire__('fs', {
        readFileSync: () => '{"Commands": []}'
      })
      const contents = readFile('~/test.json')
      expect(contents.file).to.equal('~/test.json')
      expect(contents.testName).to.equal('test')
      expect(contents.data).to.have.property('Commands')
    })
  })
  describe('readFiles', () => {
    afterEach(() => {
      filesystemRewire.__ResetDependency__('readFile')
    })
    beforeEach(() => {
      filesystemRewire.__Rewire__('readFile', (fp) => ({
        file: fp,
        testName: fp.split('.')[0],
        data: {Commands: []}
      }))
    })
    it('should ignore non-json files', () => {
      const files = readFiles(['a.json', 'b.json', 'c.csv'])
      expect(files).to.have.length(2)
    })
  })
  describe('saveFile', () => {
    afterEach(() => {
      filesystemRewire.__ResetDependency__('fs')
      filesystemRewire.__ResetDependency__('expandHome')
    })
    beforeEach(() => {
      filesystemRewire.__Rewire__('expandHome', () => '/test')
    })
    it('should throw error if filesystem has a problem', () => {
      filesystemRewire.__Rewire__('fs', {
        writeFileSync: () => {
          throw new Error('EACCES')
        }
      })
      expect(saveFile.bind(null, '/test', 'a.json', {Commands: []})).to.throw('EACCES')
    })
    it('should write file', () => {
      filesystemRewire.__Rewire__('fs', {
        writeFileSync: () => {}
      })
      const response = saveFile('/test', 'a', {Commands: []})
      expect(response.fullpath).to.equal('/test/a.json')
      expect(response.JSONdata).to.equal('{\n  "Commands": []\n}')
    })
  })
  describe('deleteFile', () => {
    afterEach(() => {
      filesystemRewire.__ResetDependency__('fs')
      filesystemRewire.__ResetDependency__('expandHome')
    })
    beforeEach(() => {
      filesystemRewire.__Rewire__('expandHome', () => '/test')
    })
    it('should throw error if filesystem has a problem', () => {
      filesystemRewire.__Rewire__('fs', {
        unlinkSync: () => {
          throw new Error('EACCES')
        }
      })
      expect(deleteFile.bind(null, '/test', 'a.json')).to.throw('EACCES')
    })
    it('should delete file', () => {
      const mockUnlink = jest.fn()
      filesystemRewire.__Rewire__('fs', {
        unlinkSync: mockUnlink
      })
      deleteFile('/test', 'a')
      expect(mockUnlink.mock.calls).to.have.length(1)
    })
  })
})
