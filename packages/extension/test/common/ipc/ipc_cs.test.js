afterEach(() => {
  jest.clearAllMocks()
})

describe('ipc_cs', () => {
  describe('ipc', () => {
    it('returns the result of csInit', () => {
      jest.doMock('../../../src/common/ipc/ipc_bg_cs', () => ({
        csInit: () => true
      }))
      const ipc = require('../../../src/common/ipc/ipc_cs')
      expect(ipc.default).toBe(true)
    })

    // TODO more tests ...
  })
})
