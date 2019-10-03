import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {
  promiseExec,
  whoami,
  checkExecutable,
  buildPackage,
  __RewireAPI__ as shellRewire
} from '../src/lib/shell'
chai.use(chaiAsPromised)
const expect = chai.expect

describe('Shell', () => {
  afterEach(() => {
    shellRewire.__ResetDependency__('exec')
    shellRewire.__ResetDependency__('promiseExec')
  })
  describe('promiseExec', () => {
    it('should reject if there is an error', () => {
      shellRewire.__Rewire__('exec', (s, cb) => {
        cb(new Error('Something went wrong'), null, null)
      })
      return expect(promiseExec('whoami')).to.eventually.be.rejectedWith('Something went wrong')
    })
    it('should resolve if there is no error', () => {
      shellRewire.__Rewire__('exec', (s, cb) => {
        cb(undefined, 'testUser', null)
      })
      return expect(promiseExec('whoami')).to.eventually.become('testUser')
    })
  })
  describe('whoami', () => {
    it('should reject if there is an error', () => {
      shellRewire.__Rewire__('promiseExec', (s) => Promise.reject(new Error('promiseExec failed')))
      return expect(whoami()).to.eventually.be.rejectedWith('promiseExec failed')
    })
    it('should resolve if there is no error', () => {
      shellRewire.__Rewire__('promiseExec', (s, cb) => Promise.resolve('testUser1'))
      return expect(whoami()).to.eventually.become('testUser1')
    })
  })
  describe('checkExecutable', () => {
    it('should reject if there is an error', () => {
      shellRewire.__Rewire__('promiseExec', (s) => Promise.reject(new Error('promiseExec failed')))
      return expect(checkExecutable('docker')).to.eventually.be.rejectedWith('promiseExec failed')
    })
    it('should resolve if there is no error', () => {
      shellRewire.__Rewire__('promiseExec', (s, cb) => Promise.resolve('/usr/local/bin/docker'))
      return expect(checkExecutable('docker')).to.eventually.become('/usr/local/bin/docker')
    })
  })
  describe('buildPackage', () => {
    it('should reject if there is an error', () => {
      shellRewire.__Rewire__('promiseExec', (s) => Promise.reject(new Error('promiseExec failed')))
      return expect(buildPackage()).to.eventually.be.rejectedWith('promiseExec failed')
    })
    it('should resolve if there is no error', () => {
      shellRewire.__Rewire__('promiseExec', (s, cb) => Promise.resolve())
      return expect(buildPackage()).to.eventually.be.fulfilled
    })
  })
})
