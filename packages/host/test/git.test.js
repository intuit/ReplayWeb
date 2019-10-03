import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {
  getCurrentVersion,
  fetchChanges,
  fetchTags,
  checkoutTag,
  switchToTag,
  __RewireAPI__ as gitRewire
} from '../src/lib/git'
chai.use(chaiAsPromised)
const expect = chai.expect

describe('git', () => {
  afterEach(() => {
    gitRewire.__ResetDependency__('git')
    gitRewire.__ResetDependency__('promiseExec')
  })
  describe('getCurrentVersion', () => {
    it('should reject if there is an error', () => {
      gitRewire.__Rewire__('git', {
        branch: () => Promise.reject('Something went wrong')
      })
      return expect(getCurrentVersion()).to.eventually.be.rejectedWith('Something went wrong')
    })
    it('should resolve if there is no error', () => {
      gitRewire.__Rewire__('git', {
        branch: () => Promise.resolve({
          current: 'master'
        })
      })
      return expect(getCurrentVersion()).to.eventually.become('master')
    })
  })
  describe('fetchChanges', () => {
    it('should reject if there is an error', () => {
      gitRewire.__Rewire__('git', {
        fetch: () => Promise.reject('Something went wrong')
      })
      return expect(fetchChanges()).to.eventually.be.rejectedWith('Something went wrong')
    })
    it('should resolve if there is no error', () => {
      gitRewire.__Rewire__('git', {
        fetch: () => Promise.resolve({
          raw: "Fetching origin"
        })
      })
      return expect(fetchChanges()).to.eventually.have.property('raw', 'Fetching origin')
    })
  })
  describe('fetchTags', () => {
    it('should reject if there is an error', () => {
      gitRewire.__Rewire__('git', {
        tags: (_, cb) => cb(new Error('Something went wrong'))
      })
      return expect(fetchTags()).to.eventually.be.rejectedWith('Something went wrong')
    })
    it('should resolve if there is no error', () => {
      gitRewire.__Rewire__('git', {
        tags: (_, cb) => cb(undefined, {all: [1,2,3]})
      })
      return expect(fetchTags()).to.eventually.become([1,2,3])
    })
  })
  describe('checkoutTag', () => {
    it('should reject if there is an error', () => {
      gitRewire.__Rewire__('git', {
        checkout: () => Promise.reject('Something went wrong')
      })
      return expect(checkoutTag()).to.eventually.be.rejectedWith('Something went wrong')
    })
    it('should resolve if there is no error', () => {
      gitRewire.__Rewire__('git', {
        checkout: () => Promise.resolve()
      })
      return expect(checkoutTag()).to.eventually.be.fulfilled
    })
  })
  describe('switchToTag', () => {
    afterEach(() => {
      gitRewire.__ResetDependency__('fetchChanges')
      gitRewire.__ResetDependency__('fetchTags')
      gitRewire.__ResetDependency__('checkoutTag')
    })
    it('should reject if there is an error in fetchChanges', () => {
      gitRewire.__Rewire__('fetchChanges', () => Promise.reject('Something went wrong in fetchChanges'))
      return expect(switchToTag()).to.eventually.be.rejectedWith('Something went wrong in fetchChanges')
    })
    it('should reject if there is an error in fetchTags', () => {
      gitRewire.__Rewire__('fetchChanges', () => Promise.resolve())
      gitRewire.__Rewire__('fetchTags', () => Promise.reject('Something went wrong in fetchTags'))
      return expect(switchToTag()).to.eventually.be.rejectedWith('Something went wrong in fetchTags')
    })
    it('should resolve if tag is found', () => {
      gitRewire.__Rewire__('fetchChanges', () => Promise.resolve())
      gitRewire.__Rewire__('fetchTags', () => Promise.resolve([1,2,3]))
      gitRewire.__Rewire__('checkoutTag', (t) => Promise.resolve(`Checked out ${t}`))
      return expect(switchToTag(1)).to.eventually.become('Checked out 1')
    })
    it('should reject if tag is not found', () => {
      gitRewire.__Rewire__('fetchChanges', () => Promise.resolve())
      gitRewire.__Rewire__('fetchTags', () => Promise.resolve([1,2,3]))
      gitRewire.__Rewire__('checkoutTag', (t) => Promise.resolve(`Checked out ${t}`))
      return expect(switchToTag(4)).to.eventually.be.rejectedWith('Tag not found: 4')
    })
  })
})
