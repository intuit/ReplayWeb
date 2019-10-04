import { logMessage, nativeMessage } from './utilities'
import { importTestCases, importBlocks } from './editor'
import { reloadProjectFiles } from './project'
import { message } from 'antd'
import * as C from '../common/constant'
import { types as T } from './action_types'

export function makeDirectory (folder) {
  return nativeMessage({
    type: 'mkdir',
    data: folder
  })
}

export function selectFolder (folder, contents) {
  return {
    type: T.SELECT_FOLDER,
    folder,
    contents
  }
}

export function readFile (filepath) {
  return (dispatch, getState) => {
    const isTestCaseMode = getState().editor.status === C.EDITOR_STATUS.TESTS
    nativeMessage({
      type: 'readFile',
      filepath
    })
      .then(res => {
        const test = {
          name: res.testName,
          data: res.data
        }
        return test
      })
      .then(file => dispatch(isTestCaseMode ? importTestCases([file]) : importBlocks([file])))
      .catch(console.error)
  }
}

export function readFiles (filepaths) {
  return (dispatch, getState) => {
    const isTestCaseMode = getState().editor.status === C.EDITOR_STATUS.TESTS
    nativeMessage({
      type: 'readFiles',
      filepaths
    })
      .then(response =>
        response.files.map(f => ({
          name: f.testName,
          data: f.data
        }))
      )
      .then(files => {
        dispatch(isTestCaseMode ? importTestCases(files) : importBlocks(files))
        return files
      })
      .then(tcs =>
        message.success(`Successfully imported ${tcs.length} ${isTestCaseMode ? 'test cases' : 'blocks'}`)
      )
      .catch(e => message.error('Error importing: ' + JSON.stringify(e), 2))
  }
}

export function saveFile (fileName, data, test = true) {
  return (dispatch, getState) => {
    const project = getState().editor.project
    const folder = test
      ? `${project.projectPath}/${project.testPath.replace('./', '')}`
      : `${project.projectPath}/${project.blockPath.replace('./', '')}`
    nativeMessage({
      type: 'saveFile',
      data: {
        folder,
        fileName,
        data
      }
    })
      .then(() => dispatch(reloadProjectFiles()))
      .then(() => message.success(`${fileName} saved successfully.`))
      .then(() => dispatch(logMessage({ type: 'Save File' })))
      .catch(e => message.error('Error saving: ' + JSON.stringify(e), 2))
  }
}

export function deleteFile (fileName, test = true) {
  return (dispatch, getState) => {
    const project = getState().editor.project
    const folder = test
      ? `${project.projectPath}/${project.testPath.replace('./', '')}`
      : `${project.projectPath}/${project.blockPath.replace('./', '')}`
    nativeMessage({
      type: 'deleteFile',
      data: {
        folder,
        fileName
      }
    })
      .then(() => dispatch(reloadProjectFiles()))
      .then(() => dispatch(logMessage({ type: 'Delete File' })))
      .catch(e => message.error('Error deleting: ' + JSON.stringify(e), 2))
  }
}

export function saveAllFiles (files, test = true) {
  return (dispatch, getState) => {
    files.forEach(file => {
      dispatch(saveFile(file.name, { commands: file.data.commands }, test))
    })
  }
}
