import db from './db'
import { uid } from '../common/utils'

const table = db.suites

const model = {
  table,
  list () {
    return table.toArray()
  },
  listByProject (project) {
    return table.where('projectId').equals(project.id).toArray()
  },
  removeByProject (project) {
    return table.where('projectId').equals(project.id).delete()
  },
  insert (data) {
    if (!data.name) {
      throw new Error('Model Suite - insert: missing name')
    }

    if (!data.data) {
      throw new Error('Model Suite - insert: missing data')
    }

    data.updateTime = new Date() * 1
    data.id = uid()
    return table.add(data)
  },
  bulkInsert (suites) {
    const list = suites.map(data => {
      if (!data.name) {
        throw new Error('Model Suite - insert: missing name')
      }

      if (!data.data) {
        throw new Error('Model Suite - insert: missing data')
      }

      data.updateTime = new Date() * 1
      data.id = uid()

      return data
    })

    return table.bulkAdd(list)
  },
  bulkUpdate (suites) {
    const list = suites.map(data => {
      if (!data.name) {
        throw new Error('Model TestCase - insert: missing name')
      }

      if (!data.data) {
        throw new Error('Model TestCase - insert: missing data')
      }

      data.updateTime = new Date() * 1

      return data
    })

    return table.bulkPut(list)
  },
  update (id, data) {
    return table.update(id, data)
  },
  bulkRemove (suites) {
    return suites.reduce((acc, cv) => acc.then(() => table.delete(cv.id)), Promise.resolve())
  },
  remove (id) {
    return table.delete(id)
  },
  clear () {
    return table.clear()
  }
}

export default model
