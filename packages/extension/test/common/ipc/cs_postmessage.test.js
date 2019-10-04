import { postMessage, onMessage } from '../../../src/common/ipc/cs_postmessage'

describe('cs-postmessage', () => {
  describe('postMessage', () => {
    it('throws an error if no postMessage key', async () => {
      try {
        await postMessage(null, null, null)
        expect(false).toBe(true)
      } catch (err) {
        expect(err.toString()).toMatch(/targetWin is not a window/)
      }
    })

    it('throws an error if no addEventListener/removeEventListener', async () => {
      try {
        await postMessage({ postMessage: jest.fn() }, null, null)
        expect(false).toBe(true)
      } catch (err) {
        expect(err.toString()).toMatch(/myWin is not a window/)
      }
    })

    it('processes valid data', () => {
      jest.useFakeTimers()
      const mockPostMessage = jest.fn()
      const targetWin = {
        postMessage: mockPostMessage
      }
      const mockAddEventListener = jest.fn()
      const myWin = {
        addEventListener: mockAddEventListener,
        removeEventListener: jest.fn()
      }
      postMessage(targetWin, myWin, {})
      expect(setTimeout).toHaveBeenCalledTimes(1)
      expect(mockPostMessage).toHaveBeenCalledTimes(1)
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          isRequest: true,
          payload: {},
          secret: expect.any(Number),
          type: 'SELENIUM_IDE_CS_MSG'
        },
        '*'
      )
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'message',
        expect.any(Function)
      )
    })
  })

  describe('onMessage', () => {
    it('throws an error if no addEventListener/removeEventListener', () => {
      try {
        onMessage({}, jest.fn())
        expect(false).toBe(true)
      } catch (err) {
        expect(err.toString()).toMatch(/csOnMessage: not a window/)
      }
    })

    it('adds event listener and returns fn', () => {
      const mockAddEventListener = jest.fn()
      const mockRemoveEventListener = jest.fn()
      const win = {
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener
      }
      const res = onMessage(win, jest.fn())
      expect(mockAddEventListener).toHaveBeenCalledTimes(1)
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'message',
        expect.any(Function)
      )
      expect(mockRemoveEventListener).not.toHaveBeenCalled()
      expect(res).toEqual(expect.any(Function))
      res()
      expect(mockRemoveEventListener).toHaveBeenCalledTimes(1)
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'message',
        expect.any(Function)
      )
    })
  })
})
