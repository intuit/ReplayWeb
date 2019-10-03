import storage from '../../../src/common/storage/ext_storage'

jest.mock('../../../src/common/web_extension', () => ({
  storage: {
    local: {
      get: jest.fn().mockImplementation((key) => Promise.resolve({ foo: 'bar' })),
      set: jest.fn().mockImplementation(() => Promise.resolve(true)),
      remove: jest.fn().mockImplementation(() => Promise.resolve(true)),
      clear: jest.fn().mockImplementation(() => Promise.resolve(true))
    },
    onChanged: {
      addListener: jest.fn()
    }
  }
}))

afterEach(() => {
  localStorage.clear()
  jest.clearAllMocks()
})
beforeEach(() => {
  localStorage.clear()
})

describe('storage', () => {
  describe('get', () => {
    it('returns value', async () => {
      const res = await storage.get('foo')
      expect(res).toBe('bar')
    })
  })

  describe('set', () => {
    it('returns value', async () => {
      const res = await storage.set('foo', 'bar')
      expect(res).toBe(true)
    })
  })

  describe('remove', () => {
    it('returns value', async () => {
      const res = await storage.remove('foo')
      expect(res).toBe(true)
    })
  })

  describe('clear', () => {
    it('returns value', async () => {
      const res = await storage.clear('foo')
      expect(res).toBe(true)
    })
  })

  describe('addListener', () => {
    it('sets callback', () => {
      storage.addListener(jest.fn())
    })
  })
})
