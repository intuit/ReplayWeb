import { uid, compose, on, map } from '../common/utils'
import { normalizeCommand } from './test_case_model'
import db from './db'

const table = db.blocks

const model = {
  table,
  list () {
    return table.toArray()
  },
  listByProject (project) {
    return table
      .where('projectId')
      .equals(project.id)
      .toArray()
  },
  removeByProject (project) {
    return table
      .where('projectId')
      .equals(project.id)
      .delete()
  },
  insert (data) {
    if (!data.name) {
      throw new Error('Model Blocks - insert: missing name')
    }

    if (!data.data) {
      throw new Error('Model Blocks - insert: missing data')
    }

    data.updateTime = new Date() * 1
    data.id = uid()
    return table.add(normalizeBlock(data))
  },
  bulkInsert (blocks) {
    const list = blocks.map(data => {
      if (!data.name) {
        throw new Error('Model Blocks - insert: missing name')
      }

      if (!data.data) {
        throw new Error('Model Blocks - insert: missing data')
      }

      data.updateTime = new Date() * 1
      data.id = uid()

      return normalizeBlock(data)
    })

    return table.bulkAdd(list)
  },
  bulkUpdate (blocks) {
    const list = blocks.map(data => {
      if (!data.name) {
        throw new Error('Model Blocks - insert: missing name')
      }

      if (!data.data) {
        throw new Error('Model Blocks - insert: missing data')
      }

      data.updateTime = new Date() * 1
      // data.id         = uid()

      return normalizeBlock(data)
    })

    return table.bulkPut(list)
  },
  update (id, data) {
    return table.update(id, normalizeBlock(data))
  },
  bulkRemove (blocks) {
    return blocks.reduce((acc, cv) => acc.then(() => table.delete(cv.id)), Promise.resolve())
  },
  remove (id) {
    return table.delete(id)
  },
  clear () {
    return table.clear()
  }
}

export default model

export const normalizeBlock = block => {
  return compose(on('data'), on('commands'), map)(normalizeCommand)(block)
}
