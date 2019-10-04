import { uid, pick, compose, updateIn, on, map } from '../common/utils'
import db from './db'
import { commandsMap } from '../common/commands'
const table = db.testCases

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
      throw new Error('Model TestCase - insert: missing name')
    }

    if (!data.data) {
      throw new Error('Model TestCase - insert: missing data')
    }

    data.updateTime = new Date() * 1
    data.id = uid()
    return table.add(normalizeTestCase(data))
  },
  bulkInsert (tcs) {
    const list = tcs.map(data => {
      if (!data.name) {
        throw new Error('Model TestCase - insert: missing name')
      }

      if (!data.data) {
        throw new Error('Model TestCase - insert: missing data')
      }

      data.updateTime = new Date() * 1
      data.id = uid()

      return normalizeTestCase(data)
    })

    return table.bulkAdd(list)
  },
  bulkUpdate (tcs) {
    const list = tcs.map(data => {
      if (!data.name) {
        throw new Error('Model TestCase - insert: missing name')
      }

      if (!data.data) {
        throw new Error('Model TestCase - insert: missing data')
      }

      data.updateTime = new Date() * 1
      // data.id         = uid()

      return normalizeTestCase(data)
    })

    return table.bulkPut(list)
  },
  update (id, data) {
    return table.update(id, normalizeTestCase(data))
  },
  bulkRemove (tcs) {
    return tcs.reduce((acc, cv) => acc.then(() => table.delete(cv.id)), Promise.resolve())
  },
  remove (id) {
    return table.delete(id)
  },
  clear () {
    return table.clear()
  }
}

export default model

export const normalizeCommand = (command) => {
  return compose(
    cmd => {
      return updateIn(
        ['parameters'],
        params => {
          return commandsMap[cmd.command] && commandsMap[cmd.command].parameters ? pick(commandsMap[cmd.command].parameters.map(f => f.name), params) : params
        },
        cmd
      )
    },
    cmd => pick(['command', 'parameters'], cmd)
  )(command)
}

export const normalizeTestCase = (testCase) => {
  return compose(
    on('data'),
    on('commands'),
    map
  )(normalizeCommand)(testCase)
}

export const commandWithoutBaseUrl = (baseUrl) => (command) => {
  if (command.command !== 'open') return command

  return {
    ...command,
    parameters: {
      ...command.parameters,
      url: (baseUrl + '/' + command.parameters.url).replace(/\/+/g, '/')
    }
  }
}

export const eliminateBaseUrl = (testCase) => {
  if (!testCase.baseUrl) return testCase
  return compose(
    on('data'),
    on('commands'),
    map
  )(commandWithoutBaseUrl(testCase.baseUrl))(testCase)
}
