import model from '../../src/models/project_model'

jest.mock('../../src/models/db', () => {
  const projects = {
    toArray: jest.fn().mockImplementation(() => [1, 2, 3]),
    delete: jest.fn().mockImplementation(() => true),
    add: jest.fn().mockImplementation(() => true),
    update: jest.fn().mockImplementation(() => true),
    clear: jest.fn().mockImplementation(() => true),
    first: jest.fn().mockImplementation(() => true)
  }
  projects.where = jest.fn().mockImplementation(() => projects)
  projects.equals = jest.fn().mockImplementation(() => projects)
  return { projects }
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('project_model', () => {
  describe('model', () => {
    describe('list', () => {
      it('returns value', () => {
        const res = model.list()
        expect(res).toEqual([1, 2, 3])
      })
    })

    describe('get', () => {
      it('returns value', () => {
        const res = model.get(1)
        expect(res).toBe(true)
      })
    })

    describe('insert', () => {
      it('throws error for no name', () => {
        try {
          model.insert({})
          expect(true).toBe(false)
        } catch (err) {
          expect(err.toString()).toMatch(/insert: missing name/)
        }
      })

      it('throws error for no projectPath', () => {
        try {
          model.insert(
            { name: 'test' }
          )
          expect(true).toBe(false)
        } catch (err) {
          expect(err.toString()).toMatch(/insert: missing projectPath/)
        }
      })

      it('throws error for no testPath', () => {
        try {
          model.insert(
            { name: 'test', projectPath: 'test' }
          )
          expect(true).toBe(false)
        } catch (err) {
          expect(err.toString()).toMatch(/insert: missing testPath/)
        }
      })

      it('throws error for no blockPath', () => {
        try {
          model.insert(
            { name: 'test', projectPath: 'test', testPath: 'test' }
          )
          expect(true).toBe(false)
        } catch (err) {
          expect(err.toString()).toMatch(/insert: missing blockPath/)
        }
      })

      it('returns value', () => {
        const res = model.insert(
          { name: 'test', projectPath: 'test', testPath: 'test', blockPath: 'test' }
        )
        expect(res).toBe(true)
      })
    })

    describe('update', () => {
      it('returns value', () => {
        const res = model.update(1, {})
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
