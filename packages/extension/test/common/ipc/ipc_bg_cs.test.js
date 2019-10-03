import {
  openBgWithCs,
  csInit,
  bgInit,
  __RewireAPI__ as ipcRewire
} from '../../../src/common/ipc/ipc_bg_cs'

jest.mock('../../../src/common/log', () => jest.fn())

afterEach(() => {
  jest.clearAllMocks()
  ipcRewire.__ResetDependency__('Ext')
  ipcRewire.__ResetDependency__('openBgWithCs')
  ipcRewire.__ResetDependency__('csInit')
  ipcRewire.__ResetDependency__('bgInit')
})

describe('ipc_bg_cs', () => {
  describe('openBgWithCs', () => {
    it('returns value', async () => {
      ipcRewire.__Rewire__('Ext', ({
        runtime: {
          onMessage: {
            addListener: jest.fn()
          },
          sendMessage: jest.fn()
        },
        tabs: {
          sendMessage: jest.fn()
        }
      }))
      const res = openBgWithCs('')
      expect(res).toEqual({
        ipcCs: expect.any(Function),
        ipcBg: expect.any(Function)
      })
      const ipcCs = res.ipcCs()
      try {
        await ipcCs.ask(1, '', [])
        expect(false).toBe(true)
      } catch (err) {
        expect(err.toString()).toMatch(/onAsk timeout {2}for cmd "1", args/)
      }
      const onAskRes = ipcCs.onAsk(jest.fn())
      expect(onAskRes).toBe(undefined)
      const destroyRes = ipcCs.destroy()
      expect(destroyRes).toBe(undefined)
    })
  })

  describe('csInit', () => {
    it('exits early if no url', () => {
      const mockSendMessage = jest.fn()
      ipcRewire.__Rewire__('Ext', ({
        extension: {},
        runtime: {
          sendMessage: mockSendMessage
        }
      }))
      const res = csInit()
      expect(res).toBe(undefined)
      expect(mockSendMessage).not.toHaveBeenCalled()
    })

    it('returns value', () => {
      const mockSendMessage = jest.fn()
      ipcRewire.__Rewire__('Ext', ({
        extension: {
          getURL: jest.fn()
        },
        runtime: {
          sendMessage: mockSendMessage
        }
      }))
      const mockOpenBgWithCs = jest.fn()
      ipcRewire.__Rewire__('openBgWithCs', mockOpenBgWithCs)
      const res = csInit()
      expect(res).toBe(undefined)
      expect(mockSendMessage).toHaveBeenCalledTimes(1)
      expect(mockSendMessage).toHaveBeenCalledWith({
        cuid: expect.any(String),
        type: 'CONNECT'
      })
      expect(mockOpenBgWithCs).toHaveBeenCalledTimes(1)
      expect(mockOpenBgWithCs).toHaveBeenCalledWith(expect.any(String))
    })
  })

  describe('bgInit', () => {
    it('returns value', () => {
      const mockAddListener = jest.fn()
      ipcRewire.__Rewire__('Ext', ({
        runtime: {
          onMessage: {
            addListener: mockAddListener
          }
        }
      }))
      const mockFn = jest.fn()
      const res = bgInit(mockFn)
      expect(res).toBe(undefined)
      expect(mockAddListener).toHaveBeenCalledTimes(1)
      expect(mockAddListener).toHaveBeenCalledWith(expect.any(Function))
      expect(mockFn).not.toHaveBeenCalled()
    })
  })
})
