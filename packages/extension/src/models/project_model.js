import db from './db'
import { uid } from '../common/utils'

const table = db.projects

const model = {
  table,
  list () {
    return table.toArray()
  },
  get (id) {
    return table.where('id').equals(id).first()
  },
  insert (data) {
    if (!data.name) {
      throw new Error('Model Project - insert: missing name')
    }

    if (!data.projectPath) {
      throw new Error('Model Project - insert: missing projectPath')
    }

    if (!data.testPath) {
      throw new Error('Model Project - insert: missing testPath')
    }

    if (!data.blockPath) {
      throw new Error('Model Project - insert: missing blockPath')
    }

    data.updateTime = new Date() * 1
    data.id = uid()
    return table.add(data)
  },
  update (id, data) {
    return table.update(id, data)
  },
  remove (id) {
    return table.delete(id)
  },
  clear () {
    return table.clear()
  }
}

export default model
