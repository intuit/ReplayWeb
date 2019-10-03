import model, {
  normalizeBlock,
  __RewireAPI__ as modelRewire
} from '../../src/models/block-model'

jest.mock('../../src/models/db', () => {
  const blocks = {
    toArray: jest.fn().mockImplementation(() => [1, 2, 3]),
    delete: jest.fn().mockImplementation(() => true),
    add: jest.fn().mockImplementation(() => true),
    bulkAdd: jest.fn().mockImplementation(() => true),
    bulkPut: jest.fn().mockImplementation(() => true),
    update: jest.fn().mockImplementation(() => true),
    clear: jest.fn().mockImplementation(() => true)
  }
  blocks.where = jest.fn().mockImplementation(() => blocks)
  blocks.equals = jest.fn().mockImplementation(() => blocks)
  return { blocks }
})

afterEach(() => {
  jest.clearAllMocks()
  modelRewire.__ResetDependency__('normalizeBlock')
})

describe('block-model', () => {
  describe('model', () => {
    describe('list', () => {
      it('returns value', () => {
        const res = model.list()
        expect(res).toEqual([1, 2, 3])
      })
    })

    describe('listByProject', () => {
      it('returns value', () => {
        const res = model.listByProject({ id: 1 })
        expect(res).toEqual([1, 2, 3])
      })
    })

    describe('removeByProject', () => {
      it('returns value', () => {
        const res = model.removeByProject({ id: 1 })
        expect(res).toBe(true)
      })
    })

    describe('insert', () => {
      it('throws error if no name', () => {
        try {
          model.insert({})
          expect(true).toBe(false)
        } catch (err) {
          expect(err.toString()).toMatch(/insert: missing name/)
        }
      })

      it('throws error if no data', () => {
        try {
          model.insert({ name: 'test' })
          expect(true).toBe(false)
        } catch (err) {
          expect(err.toString()).toMatch(/insert: missing data/)
        }
      })

      it('returns value', () => {
        modelRewire.__Rewire__('normalizeBlock', (data) => data)
        const res = model.insert({ name: 'test', data: 'test' })
        expect(res).toBe(true)
      })
    })

    describe('bulkInsert', () => {
      it('returns value for empty data', () => {
        const res = model.bulkInsert([])
        expect(res).toBe(true)
      })

      it('throws error for some data without name', () => {
        modelRewire.__Rewire__('normalizeBlock', (data) => data)
        const blocks = [{}]
        try {
          model.bulkInsert(blocks)
          expect(true).toBe(false)
        } catch (err) {
          expect(err.toString()).toMatch(/insert: missing name/)
        }
      })

      it('returns value for some data', () => {
        modelRewire.__Rewire__('normalizeBlock', (data) => data)
        const blocks = [{ name: 'test' }]
        try {
          model.bulkInsert(blocks)
          expect(true).toBe(false)
        } catch (err) {
          expect(err.toString()).toMatch(/insert: missing data/)
        }
      })

      it('returns value for some data', () => {
        modelRewire.__Rewire__('normalizeBlock', (data) => data)
        const blocks = [{ name: 'test', data: 'test' }]
        const res = model.bulkInsert(blocks)
        expect(res).toBe(true)
      })
    })

    describe('bulkUpdate', () => {
      it('returns value for empty data', () => {
        const res = model.bulkUpdate([])
        expect(res).toBe(true)
      })

      it('throws error for some data without name', () => {
        modelRewire.__Rewire__('normalizeBlock', (data) => data)
        const blocks = [{}]
        try {
          model.bulkUpdate(blocks)
          expect(true).toBe(false)
        } catch (err) {
          expect(err.toString()).toMatch(/insert: missing name/)
        }
      })

      it('returns value for some data', () => {
        modelRewire.__Rewire__('normalizeBlock', (data) => data)
        const blocks = [{ name: 'test' }]
        try {
          model.bulkUpdate(blocks)
          expect(true).toBe(false)
        } catch (err) {
          expect(err.toString()).toMatch(/insert: missing data/)
        }
      })

      it('returns value for some data', () => {
        modelRewire.__Rewire__('normalizeBlock', (data) => data)
        const blocks = [{ name: 'test', data: 'test' }]
        const res = model.bulkUpdate(blocks)
        expect(res).toBe(true)
      })
    })

    describe('update', () => {
      it('returns value', () => {
        modelRewire.__Rewire__('normalizeBlock', (data) => data)
        const res = model.update(1, {})
        expect(res).toBe(true)
      })
    })

    describe('bulkRemove', () => {
      it('returns value', async () => {
        const res = await model.bulkRemove([])
        expect(res).toBe(undefined)
      })
    })

    describe('remove', () => {
      it('returns value', () => {
        const res = model.remove(1)
        expect(res).toBe(true)
      })
    })

    describe('clear', () => {
      it('returns value', () => {
        const res = model.clear()
        expect(res).toBe(true)
      })
    })
  })

  describe('normalizeBlock', () => {
    it('returns value', () => {
      const block = { data: { commands: [] } }
      const res = normalizeBlock(block)
      expect(res).toEqual(block)
    })
  })
})
