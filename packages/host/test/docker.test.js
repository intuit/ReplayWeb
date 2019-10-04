import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {
  imageName,
  pullImage,
  findLocalImages,
  startOrchestrator,
  __RewireAPI__ as dockerRewire
} from '../src/lib/docker'
chai.use(chaiAsPromised)
const expect = chai.expect

describe('Docker', () => {
  describe('imageName', () => {
    it('should produce remote image name with default parameter', () => {
      expect(imageName()).to.equal('docker.example.com/dev/test/replayui/team/crossbrowser-local-orchestrator:latest')
    })
    it('should produce remote image name', () => {
      expect(imageName(false)).to.equal('docker.example.com/dev/test/replayui/team/crossbrowser-local-orchestrator:latest')
    })
    it('should produce local image name', () => {
      expect(imageName(true)).to.equal('replay/crossbrowser-local-orchestrator:latest')
    })
  })
  describe('pullImage', () => {
    afterEach(() => {
      dockerRewire.__ResetDependency__('docker')
    })
    it('should throw error if pull has an error', () => {
      dockerRewire.__Rewire__('docker', {
        pull: (image, cb) => {
          cb(new Error('Something went wrong'))
        }
      })
      return expect(pullImage('')).to.eventually.be.rejectedWith('Something went wrong')
    })
    it('should throw error if it finishes with an error', () => {
      dockerRewire.__Rewire__('docker', {
        pull: (image, cb) => {
          cb(undefined, null)
        },
        modem: {
          followProgress: (s, f, p) => {
            f(new Error('Something went wrong at the end'))
          }
        }
      })
      return expect(pullImage('')).to.eventually.be.rejectedWith('Something went wrong at the end')
    })
    it('should resolve with the output from docker', () => {
      dockerRewire.__Rewire__('docker', {
        pull: (image, cb) => {
          cb(undefined, null)
        },
        modem: {
          followProgress: (s, f, p) => {
            p() // call the progress callback
            f(undefined, { success: true })
          }
        }
      })
      return expect(pullImage('')).to.eventually.have.property('success')
    })
  })
  describe('findLocalImages', () => {
    afterEach(() => {
      dockerRewire.__ResetDependency__('docker')
    })
    it('should find images with matching RepoTags', () => {
      dockerRewire.__Rewire__('docker', {
        listImages: () => Promise.resolve([
          { RepoTags: ['wrongtag'] },
          { RepoTags: ['replay/crossbrowser-local-orchestrator:12'] },
          { RepoTags: ['replay/crossbrowser-local-orchestrator:latest'] }
        ])
      })
      return expect(findLocalImages('replay/crossbrowser-local-orchestrator:latest')).to.eventually.have.property('length', 1)
    })
  })
  describe('startOrchestrator', () => {
    afterEach(() => {
      dockerRewire.__ResetDependency__('findLocalImages')
      dockerRewire.__ResetDependency__('pullImage')
      dockerRewire.__ResetDependency__('imageName')
    })
    beforeEach(() => {
      dockerRewire.__Rewire__('pullImage', () => Promise.resolve({}))
      dockerRewire.__Rewire__('imageName', (local) => local ? 'local' : 'remote')
    })
    it('should pull remote image if no local images', () => {
      dockerRewire.__Rewire__('docker', {
        // make con.start() return the config for validation
        createContainer: (config) => Promise.resolve({ start: () => Promise.resolve(config) })
      })
      dockerRewire.__Rewire__('findLocalImages', () => Promise.resolve([]))
      return expect(startOrchestrator(3000)).to.eventually.have.property('Image', 'remote')
    })
    it('should use local image if available', () => {
      dockerRewire.__Rewire__('docker', {
        // make con.start() return the config for validation
        createContainer: (config) => Promise.resolve({ start: () => Promise.resolve(config) })
      })
      dockerRewire.__Rewire__('findLocalImages', () => Promise.resolve(['local']))
      return expect(startOrchestrator(3000)).to.eventually.have.property('Image', 'local')
    })
    it('should use provided port', () => {
      dockerRewire.__Rewire__('docker', {
        // make con.start() return the config for validation
        createContainer: (config) => Promise.resolve({ start: () => Promise.resolve(config) })
      })
      dockerRewire.__Rewire__('findLocalImages', () => Promise.resolve(['local']))
      return startOrchestrator(5467)
        .then(details => expect(details.Env[0]).to.equal('PORT=5467'))
    })
  })
})
