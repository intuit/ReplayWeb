import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {
  messageHandler,
  __RewireAPI__ as indexRewire
} from '../src/lib'
chai.use(chaiAsPromised)
const expect = chai.expect

describe('index', () => {
  afterEach(() => {
    indexRewire.__ResetDependency__('makeDirectory')
    indexRewire.__ResetDependency__('getDirectoryContents')
    indexRewire.__ResetDependency__('readFile')
    indexRewire.__ResetDependency__('readFiles')
    indexRewire.__ResetDependency__('saveFile')
    indexRewire.__ResetDependency__('startOrchestrator')
    indexRewire.__ResetDependency__('whoami')
    indexRewire.__ResetDependency__('checkExecutable')
    indexRewire.__ResetDependency__('switchToTag')
    indexRewire.__ResetDependency__('getCurrentVersion')
    indexRewire.__ResetDependency__('buildPackage')
  })
  it('failure callback should be triggered if message is invalid type', () => {
    indexRewire.__Rewire__('getDirectoryContents', () => {
      throw new Error('filesystem error')
    })
    const msg = {
      type: 'fakeType'
    }
    const push = jest.fn()
    const done = jest.fn()
    messageHandler(msg, push, done)
    expect(push.mock.calls).to.have.length(1)
    expect(push.mock.calls[0][0]).to.have.property('success', false)
  })
  describe('mkdir', () => {
    it('success callback should be triggered if it succeeds', () => {
      indexRewire.__Rewire__('makeDirectory', () => Promise.resolve())
      const msg = {
        type: 'mkdir',
        data: '/'
      }
      const push = jest.fn()
      const done = jest.fn()
      return messageHandler(msg, push, done)
        .then(() => Promise.all([
          expect(push.mock.calls).to.have.length(1),
          expect(push.mock.calls[0][0]).to.have.property('success', true)
        ]))
    })
    it('failure callback should be triggered if it fails', () => {
      indexRewire.__Rewire__('makeDirectory', () => Promise.reject(new Error('filesystem error')))
      const msg = {
        type: 'mkdir',
        data: '/'
      }
      const push = jest.fn()
      const done = jest.fn()
      return messageHandler(msg, push, done)
        .then(() => Promise.all([
          expect(push.mock.calls).to.have.length(1),
          expect(push.mock.calls[0][0]).to.have.property('success', false)
        ]))
    })
  })
  describe('listDir', () => {
    it('success callback should be triggered if it succeeds', () => {
      indexRewire.__Rewire__('getDirectoryContents', () => ['/test'])
      const msg = {
        type: 'listDir',
        data: '/'
      }
      const push = jest.fn()
      const done = jest.fn()
      messageHandler(msg, push, done)
      expect(push.mock.calls).to.have.length(1)
      expect(push.mock.calls[0][0]).to.have.property('success', true)
    })
    it('failure callback should be triggered if it fails', () => {
      indexRewire.__Rewire__('getDirectoryContents', () => {
        throw new Error('filesystem error')
      })
      const msg = {
        type: 'listDir',
        data: '/'
      }
      const push = jest.fn()
      const done = jest.fn()
      messageHandler(msg, push, done)
      expect(push.mock.calls).to.have.length(1)
      expect(push.mock.calls[0][0]).to.have.property('success', false)
    })
  })
  describe('readFile', () => {
    it('success callback should be triggered if it succeeds', () => {
      indexRewire.__Rewire__('readFile', () => ({ data: '{"Commands: []"}' }))
      const msg = {
        type: 'readFile',
        filepath: '/test.json'
      }
      const push = jest.fn()
      const done = jest.fn()
      messageHandler(msg, push, done)
      expect(push.mock.calls).to.have.length(1)
      expect(push.mock.calls[0][0]).to.have.property('success', true)
    })
    it('failure callback should be triggered if it fails', () => {
      indexRewire.__Rewire__('readFile', () => {
        throw new Error('filesystem error')
      })
      const msg = {
        type: 'readFile',
        filepath: '/test.json'
      }
      const push = jest.fn()
      const done = jest.fn()
      messageHandler(msg, push, done)
      expect(push.mock.calls).to.have.length(1)
      expect(push.mock.calls[0][0]).to.have.property('success', false)
    })
  })
  describe('readFiles', () => {
    it('success callback should be triggered if it succeeds', () => {
      indexRewire.__Rewire__('readFiles', () => [{ data: '{"Commands: []"}' }, { data: '{"Commands: []"}' }])
      const msg = {
        type: 'readFiles',
        filepaths: ['/test.json', '/test2.json']
      }
      const push = jest.fn()
      const done = jest.fn()
      messageHandler(msg, push, done)
      expect(push.mock.calls).to.have.length(1)
      expect(push.mock.calls[0][0]).to.have.property('success', true)
    })
    it('failure callback should be triggered if it fails', () => {
      indexRewire.__Rewire__('readFiles', () => {
        throw new Error('filesystem error')
      })
      const msg = {
        type: 'readFiles',
        filepaths: ['/test.json', '/test2.json']
      }
      const push = jest.fn()
      const done = jest.fn()
      messageHandler(msg, push, done)
      expect(push.mock.calls).to.have.length(1)
      expect(push.mock.calls[0][0]).to.have.property('success', false)
    })
  })
  describe('saveFile', () => {
    it('success callback should be triggered if it succeeds', () => {
      indexRewire.__Rewire__('saveFile', () => ({ fullpath: '/test.json' }))
      const msg = {
        type: 'saveFile',
        data: {
          folder: '/',
          fileName: 'test',
          data: { Commands: [] }
        }
      }
      const push = jest.fn()
      const done = jest.fn()
      messageHandler(msg, push, done)
      expect(push.mock.calls).to.have.length(1)
      expect(push.mock.calls[0][0]).to.have.property('success', true)
    })
    it('failure callback should be triggered if it fails', () => {
      indexRewire.__Rewire__('saveFile', () => {
        throw new Error('filesystem error')
      })
      const msg = {
        type: 'saveFile',
        data: {
          folder: '/',
          fileName: 'test',
          data: { Commands: [] }
        }
      }
      const push = jest.fn()
      const done = jest.fn()
      messageHandler(msg, push, done)
      expect(push.mock.calls).to.have.length(1)
      expect(push.mock.calls[0][0]).to.have.property('success', false)
    })
  })
  describe('deleteFile', () => {
    it('success callback should be triggered if it succeeds', () => {
      indexRewire.__Rewire__('deleteFile', () => {})
      const msg = {
        type: 'deleteFile',
        data: {
          folder: '/',
          fileName: 'test'
        }
      }
      const push = jest.fn()
      const done = jest.fn()
      messageHandler(msg, push, done)
      expect(push.mock.calls).to.have.length(1)
      expect(push.mock.calls[0][0]).to.have.property('success', true)
    })
    it('failure callback should be triggered if it fails', () => {
      indexRewire.__Rewire__('deleteFile', () => {
        throw new Error('filesystem error')
      })
      const msg = {
        type: 'deleteFile',
        data: {
          folder: '/',
          fileName: 'test'
        }
      }
      const push = jest.fn()
      const done = jest.fn()
      messageHandler(msg, push, done)
      expect(push.mock.calls).to.have.length(1)
      expect(push.mock.calls[0][0]).to.have.property('success', false)
    })
  })
  describe('checkExecutable', () => {
    it('success callback should be triggered if it succeeds', () => {
      indexRewire.__Rewire__('checkExecutable', () => Promise.resolve('/usr/local/bin/docker'))
      const msg = {
        type: 'checkExecutable',
        executable: 'docker'
      }
      const push = jest.fn()
      const done = jest.fn()
      return messageHandler(msg, push, done)
        .then(() => Promise.all([
          expect(push.mock.calls).to.have.length(1),
          expect(push.mock.calls[0][0]).to.have.property('success', true)
        ]))
    })
    it('failure callback should be triggered if it fails', () => {
      indexRewire.__Rewire__('checkExecutable', () => Promise.reject(new Error('shell error')))
      const msg = {
        type: 'checkExecutable',
        executable: 'docker'
      }
      const push = jest.fn()
      const done = jest.fn()
      return messageHandler(msg, push, done)
        .then(() => Promise.all([
          expect(push.mock.calls).to.have.length(1),
          expect(push.mock.calls[0][0]).to.have.property('success', false)
        ]))
    })
  })
  describe('whoami', () => {
    it('success callback should be triggered if it succeeds', () => {
      indexRewire.__Rewire__('whoami', () => Promise.resolve('testUser'))
      const msg = {
        type: 'whoami'
      }
      const push = jest.fn()
      const done = jest.fn()
      return messageHandler(msg, push, done)
        .then(() => Promise.all([
          expect(push.mock.calls).to.have.length(1),
          expect(push.mock.calls[0][0]).to.have.property('success', true)
        ]))
    })
    it('failure callback should be triggered if it fails', () => {
      indexRewire.__Rewire__('whoami', () => Promise.reject(new Error('shell error')))
      const msg = {
        type: 'whoami'
      }
      const push = jest.fn()
      const done = jest.fn()
      return messageHandler(msg, push, done)
        .then(() => Promise.all([
          expect(push.mock.calls).to.have.length(1),
          expect(push.mock.calls[0][0]).to.have.property('success', false)
        ]))
    })
  })
  describe('startOrchestrator', () => {
    it('success callback should be triggered if it succeeds', () => {
      indexRewire.__Rewire__('startOrchestrator', () => Promise.resolve({ data: {} }))
      const msg = {
        type: 'startOrchestrator'
      }
      const push = jest.fn()
      const done = jest.fn()
      return messageHandler(msg, push, done)
        .then(() => Promise.all([
          expect(push.mock.calls).to.have.length(1),
          expect(push.mock.calls[0][0]).to.have.property('success', true)
        ]))
    })
    it('failure callback should be triggered if it fails', () => {
      indexRewire.__Rewire__('startOrchestrator', () => Promise.reject(new Error('docker error')))
      const msg = {
        type: 'startOrchestrator'
      }
      const push = jest.fn()
      const done = jest.fn()
      return messageHandler(msg, push, done)
        .then(() => Promise.all([
          expect(push.mock.calls).to.have.length(1),
          expect(push.mock.calls[0][0]).to.have.property('success', false)
        ]))
    })
  })
  describe('version', () => {
    it('success callback should be triggered if it succeeds', () => {
      indexRewire.__Rewire__('getCurrentVersion', () => Promise.resolve({ data: {} }))
      const msg = {
        type: 'version'
      }
      const push = jest.fn()
      const done = jest.fn()
      return messageHandler(msg, push, done)
        .then(() => Promise.all([
          expect(push.mock.calls).to.have.length(1),
          expect(push.mock.calls[0][0]).to.have.property('success', true)
        ]))
    })
    it('failure callback should be triggered if it fails', () => {
      indexRewire.__Rewire__('getCurrentVersion', () => Promise.reject(new Error('git error')))
      const msg = {
        type: 'version'
      }
      const push = jest.fn()
      const done = jest.fn()
      return messageHandler(msg, push, done)
        .then(() => Promise.all([
          expect(push.mock.calls).to.have.length(1),
          expect(push.mock.calls[0][0]).to.have.property('success', false)
        ]))
    })
  })
  describe('update', () => {
    it('success callback should be triggered if it succeeds', () => {
      indexRewire.__Rewire__('switchToTag', () => Promise.resolve({ data: {} }))
      indexRewire.__Rewire__('buildPackage', () => Promise.resolve({ data: {} }))
      indexRewire.__Rewire__('getCurrentVersion', () => Promise.resolve({ data: {} }))
      const msg = {
        type: 'update'
      }
      const push = jest.fn()
      const done = jest.fn()
      return messageHandler(msg, push, done)
        .then(() => Promise.all([
          expect(push.mock.calls).to.have.length(1),
          expect(push.mock.calls[0][0]).to.have.property('success', true)
        ]))
    })
    it('failure callback should be triggered if it fails in switchToTag', () => {
      indexRewire.__Rewire__('switchToTag', () => Promise.reject(new Error('git error')))
      const msg = {
        type: 'update'
      }
      const push = jest.fn()
      const done = jest.fn()
      return messageHandler(msg, push, done)
        .then(() => Promise.all([
          expect(push.mock.calls).to.have.length(1),
          expect(push.mock.calls[0][0]).to.have.property('success', false)
        ]))
    })
    it('failure callback should be triggered if it fails in buildPackage', () => {
      indexRewire.__Rewire__('switchToTag', () => Promise.resolve({ data: {} }))
      indexRewire.__Rewire__('buildPackage', () => Promise.reject(new Error('git error')))
      const msg = {
        type: 'update'
      }
      const push = jest.fn()
      const done = jest.fn()
      return messageHandler(msg, push, done)
        .then(() => Promise.all([
          expect(push.mock.calls).to.have.length(1),
          expect(push.mock.calls[0][0]).to.have.property('success', false)
        ]))
    })
    it('failure callback should be triggered if it fails in getCurrentVersion', () => {
      indexRewire.__Rewire__('switchToTag', () => Promise.resolve({ data: {} }))
      indexRewire.__Rewire__('buildPackage', () => Promise.resolve({ data: {} }))
      indexRewire.__Rewire__('getCurrentVersion', () => Promise.reject(new Error('git error')))
      const msg = {
        type: 'update'
      }
      const push = jest.fn()
      const done = jest.fn()
      return messageHandler(msg, push, done)
        .then(() => Promise.all([
          expect(push.mock.calls).to.have.length(1),
          expect(push.mock.calls[0][0]).to.have.property('success', false)
        ]))
    })
  })
})
