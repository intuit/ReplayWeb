import ipcPromise from '../../../src/common/ipc/ipc_promise'

describe('ipc_promise', () => {
  describe('serialize', () => {
    it('returns value', () => {
      const mockAsk = jest.fn().mockImplementation(() => true)
      const mockSend = jest.fn().mockImplementation(() => true)
      const mockOnAsk = jest.fn().mockImplementation(() => true)
      const mockDestroy = jest.fn().mockImplementation(() => true)
      const obj = {
        ask: mockAsk,
        send: mockSend,
        onAsk: mockOnAsk,
        destroy: mockDestroy
      }
      const cmd = 'open'
      const args = [{ target: 'google.com' }]
      const timeout = 1000

      const res = ipcPromise.serialize(obj)
      const askRes = res.ask(cmd, args, timeout)
      expect(askRes).toBe(true)
      expect(mockAsk).toHaveBeenCalledTimes(1)
      expect(mockAsk).toHaveBeenCalledWith(cmd, JSON.stringify(args), timeout)
      const sendRes = res.send(cmd, args, timeout)
      expect(sendRes).toBe(true)
      expect(mockSend).toHaveBeenCalledTimes(1)
      expect(mockSend).toHaveBeenCalledWith(cmd, JSON.stringify(args), timeout)
      const onAskRes = res.onAsk(jest.fn())
      expect(onAskRes).toBe(true)
      expect(mockOnAsk).toHaveBeenCalledTimes(1)
      expect(mockOnAsk).toHaveBeenCalledWith(expect.any(Function))
      const destroyRes = res.destroy()
      expect(destroyRes).toBe(true)
      expect(mockDestroy).toHaveBeenCalledTimes(1)
    })
  })

  describe('create function', () => {
    it('returns value', async () => {
      jest.useFakeTimers()
      const mockAsk = jest.fn()
      const mockAnswer = jest.fn()
      const mockTimeout = 1000
      const mockOnAnswer = jest.fn()
      const mockOnAsk = jest.fn()
      const mockDestroy = jest.fn()
      const options = {
        ask: mockAsk,
        answer: mockAnswer,
        timeout: mockTimeout,
        onAnswer: mockOnAnswer,
        onAsk: mockOnAsk,
        destroy: mockDestroy
      }
      const cmd = 'open'
      const args = [{ target: 'google.com' }]
      const timeout = 1000

      const res = ipcPromise(options)
      expect(res).toEqual({
        ask: expect.any(Function),
        send: expect.any(Function),
        onAsk: expect.any(Function),
        destroy: expect.any(Function)
      })
      expect(mockOnAnswer).toHaveBeenCalledTimes(1)
      expect(mockOnAnswer).toHaveBeenCalledWith(expect.any(Function))
      expect(mockOnAsk).toHaveBeenCalledTimes(1)
      expect(mockOnAsk).toHaveBeenCalledWith(expect.any(Function))
      res.ask(cmd, args, timeout)
      expect(setTimeout).toHaveBeenCalledTimes(1)
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000)
      const mockOnAskHandler = jest.fn().mockImplementation(() => {})
      res.onAsk(mockOnAskHandler)
      expect(mockOnAskHandler).not.toHaveBeenCalled()
      expect(mockAnswer).not.toHaveBeenCalled()
      res.destroy()
      expect(mockDestroy).toHaveBeenCalledTimes(1)
    })
  })
})
