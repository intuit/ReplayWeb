import model from '../../src/models/suite_model'

jest.mock('../../src/models/db', () => {
  const suites = {
    toArray: jest.fn().mockImplementation(() => [1, 2, 3]),
    delete: jest.fn().mockImplementation(() => true),
    add: jest.fn().mockImplementation(() => true),
    update: jest.fn().mockImplementation(() => true),
    clear: jest.fn().mockImplementation(() => true),
    first: jest.fn().mockImplementation(() => true),
    bulkAdd: jest.fn().mockImplementation(() => true),
    bulkPut: jest.fn().mockImplementation(() => true)
  }
  suites.where = jest.fn().mockImplementation(() => suites)
  suites.equals = jest.fn().mockImplementation(() => suites)
  return { suites }
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('suite_model', () => {
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
      it('throws error for no name', () => {
        try {
          model.insert({})
          expect(false).toBe(true)
        } catch (err) {
          expect(err.toString()).toMatch(/insert: missing name/)
        }
      })

      it('throws error for no data', () => {
        try {
          model.insert({ name: 'test' })
          expect(false).toBe(true)
        } catch (err) {
          expect(err.toString()).toMatch(/insert: missing data/)
        }
      })

      it('returns value', () => {
        const res = model.insert({ name: 'test', data: 'test' })
        expect(res).toBe(true)
      })
    })

    describe('bulkInsert', () => {
      it('returns value for no data', () => {
        const res = model.bulkInsert([])
        expect(res).toBe(true)
      })

      it('throws error for no name', () => {
        try {
          model.bulkInsert([{}])
          expect(false).toBe(true)
        } catch (err) {
          expect(err.toString()).toMatch(/insert: missing name/)
        }
      })

      it('throws error for no data', () => {
        try {
          model.bulkInsert([{ name: 'test' }])
          expect(false).toBe(true)
        } catch (err) {
          expect(err.toString()).toMatch(/insert: missing data/)
        }
      })

      it('returns value', () => {
        const res = model.bulkInsert([{ name: 'test', data: 'test' }])
        expect(res).toBe(true)
      })
    })

    describe('bulkUpdate', () => {
      it('returns value for no data', () => {
        const res = model.bulkUpdate([])
        expect(res).toBe(true)
      })

      it('throws error for no name', () => {
        try {
          model.bulkUpdate([{}])
          expect(false).toBe(true)
        } catch (err) {
          expect(err.toString()).toMatch(/insert: missing name/)
        }
      })

      it('throws error for no data', () => {
        try {
          model.bulkUpdate([{ name: 'test' }])
          expect(false).toBe(true)
        } catch (err) {
          expect(err.toString()).toMatch(/insert: missing data/)
        }
      })

      it('returns value', () => {
        const res = model.bulkUpdate([{ name: 'test', data: 'test' }])
        expect(res).toBe(true)
      })
    })

    describe('update', () => {
      it('returns value', () => {
        const res = model.update(1, {})
        expect(res).toBe(true)
      })
    })

    describe('bulkRemove', () => {
      it('returns value', async () => {
        const res = await model.update([{}])
        expect(res).toBe(true)
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
})
