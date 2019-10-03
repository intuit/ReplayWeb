import localStorageAdapter from '../../../src/common/storage/localstorage_adapter'

afterEach(() => {
  localStorage.clear()
})
beforeEach(() => {
  localStorage.clear()
})

describe('localstorage_adapter', () => {
  describe('get', () => {
    it('returns value', async () => {
      localStorage.setItem('test', `{"foo": "bar"}`)
      const res = await localStorageAdapter.get('test')
      expect(res).toEqual({ test: { foo: 'bar' } })
    })
  })

  describe('set', () => {
    it('returns value', async () => {
      const res = await localStorageAdapter.set({
        foo: 1,
        bar: [1],
        baz: '1'
      })
      expect(res).toBe(true)
      expect(localStorage.getItem('foo')).toEqual('1')
      expect(localStorage.getItem('bar')).toEqual('[1]')
      expect(localStorage.getItem('baz')).toEqual('"1"')
    })
  })
  describe('remove', () => {
    it('returns value', async () => {
      localStorage.setItem('foo', 1)
      await localStorageAdapter.remove('foo')
      expect(localStorage.getItem('foo')).toBeNull()
    })
  })
  describe('clear', () => {
    it('returns value', async () => {
      localStorage.setItem('foo', 1)
      await localStorageAdapter.clear('foo')
      expect(localStorage.getItem('foo')).toBeNull()
    })
  })
  describe('addListener', () => {
    it('returns value', () => {
      localStorageAdapter.addListener()
    })
  })
})
