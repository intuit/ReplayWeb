import {
  getElementByLocator,
  getFrameByLocator,
  fetchTable,
  __RewireAPI__ as runnerRewire
} from '../../src/common/command_runner'

jest.mock('../../src/common/web_extension', () => {})

afterAll(() => {
  runnerRewire.__ResetDependency__('scrollElementIntoView')
  runnerRewire.__ResetDependency__('getTableHeader')
  runnerRewire.__ResetDependency__('getElementByLocator')
  runnerRewire.__ResetDependency__('getFrameByLocator')
  runnerRewire.__ResetDependency__('fetchTable')
  runnerRewire.__ResetDependency__('run')
  runnerRewire.__ResetDependency__('getElementByXPath')
  runnerRewire.__ResetDependency__('frameDom')
})

describe('command_runner', () => {
  describe('fetchTable', () => {
    it('returns empty result', () => {
      runnerRewire.__Rewire__('getTableHeader', () => [])
      runnerRewire.__Rewire__('getElementByXPath', () => ({
        getElementsByTagName() {
          return []
        }
      }))
      const res = fetchTable('')
      expect(res).toEqual([])
    })
  })

  describe('getElementByLocator', () => {
    it('throws an error for bad locators', () => {
      try {
        getElementByLocator('')
        expect(true).toBe(false)
      } catch (err) {
        expect(err.toString()).toMatch(/invalid locator/)
      }
    })

    it('throws error for null element', () => {
      try {
        runnerRewire.__Rewire__('getElementByXPath', () => null)
        getElementByLocator('/test')
        expect(true).toBe(false)
      } catch (err) {
        expect(err.toString()).toMatch(
          /fail to find element based on the locator/
        )
      }
    })

    describe('returns an element', () => {
      it('for id', () => {
        const oldGetElementById = document.getElementById
        document.getElementById = () => {
          return true
        }
        const res = getElementByLocator('id=foobar')
        expect(res).toBe(true)
        document.getElementById = oldGetElementById
      })

      // TODO more tests ...
    })
  })

  describe('getFrameByLocator', () => {
    it('returns a simple sample value', () => {
      runnerRewire.__Rewire__('getElementByLocator', () => ({
        contentWindow: true,
        getAttribute: () => true
      }))
      const res = getFrameByLocator('', null)
      expect(res).toEqual({ frame: true })
    })

    it('throws an error if frameDom is empty', () => {
      runnerRewire.__Rewire__('getElementByLocator', () => {})
      try {
        getFrameByLocator('test', null)
        expect(true).toBe(false)
      } catch (err) {
        expect(err.toString()).toMatch(
          /The element found based on name=test is NOT a frame\/iframe/
        )
      }
    })

    // TODO more tests ...
  })
})
