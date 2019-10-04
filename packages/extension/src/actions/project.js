import { logMessage, nativeMessage } from './utilities'
import {
  setTestCases,
  setBlocks,
  setSuites,
  importTestCases,
  importBlocks,
  importSuites
} from './editor'
import { changeModalState } from './app'
import { selectFolder, makeDirectory } from './filesystem'
import storage from '../common/storage'
import testCaseModel from '../models/test_case_model'
import blockModel from '../models/block-model'
import projectModel from '../models/project_model'
import suiteModel from '../models/suite_model'
import { message } from 'antd'
import { types as T } from './action_types'

export function existingConfig (exists) {
  return {
    type: T.EXISTING_CONFIG,
    exists
  }
}

export function setPathPurpose (purpose) {
  return {
    type: T.SET_PURPOSE,
    purpose
  }
}

export function fileError () {
  return {
    type: T.FILE_ERROR
  }
}

export function listProjects (projects) {
  return {
    type: T.LIST_PROJECTS,
    data: projects
  }
}

export function clearProjectSetup () {
  return {
    type: T.CLEAR_PROJECT_SETUP
  }
}

// Thunk Actions

export function createProject (newProject) {
  return (dispatch, getState) => {
    const suites = getState().projectSetup.suites
    return projectModel
      .insert(newProject)
      .then(projectId => projectModel.get(projectId))
      .then(project => {
        dispatch({
          type: T.CREATE_PROJECT,
          data: project,
          post ({ dispatch, getState }) {
            dispatch(selectProject(project))
          }
        })
        dispatch(writeProjectConfig({ ...project, suites }))
        dispatch(logMessage({ type: 'Create Project', project }))
      })
  }
}

export function updateProject (project) {
  return (dispatch, getState) => {
    return projectModel.update(project.id, project)
      .then(() => projectModel.get(project.id))
      .then(updatedProject => {
        dispatch(selectProject(updatedProject))
        dispatch(writeProjectConfig(updatedProject))
        dispatch(logMessage({ type: 'Update Project', project: updatedProject }))
      })
  }
}

export function removeProject (project) {
  return (dispatch, getState) => {
    return projectModel
      .remove(project.id)
      .then(() => Promise.all([
        testCaseModel.removeByProject(project),
        blockModel.removeByProject(project)
      ]))
      .then(() => {
        dispatch({
          type: T.DELETE_PROJECT,
          data: project,
          post ({ dispatch, getState }) {
            projectModel.list().then(projects => {
              const firstProject = projects[0]
              dispatch(selectProject(firstProject))
            })
          }
        })
        dispatch(logMessage({ type: 'Remove Project', project }))
      })
  }
}

export function editProject (id) {
  return (dispatch, getState) => {
    return projectModel.get(id)
      .then(project => dispatch({
        type: T.EDIT_PROJECT,
        project
      }))
  }
}

export function listDirectory (dir) {
  return (dispatch, getState) => {
    return nativeMessage({
      type: 'listDir',
      data: dir
    })
      .then(list => dispatch(selectFolder(dir, list)))
      .catch(e => dispatch(fileError()))
  }
}

export function selectProjectFolder () {
  return (dispatch, getState) => {
    const { purpose } = getState().projectSetup
    const { folder } = getState().files
    if (purpose === T.PROJECT_PATH) {
      dispatch(checkForExistingConfig(folder))
    }
    dispatch({
      type: purpose,
      path: folder
    })
    dispatch(changeModalState('browser', false))
  }
}

export function writeProjectConfig (project, reason = 'Updated replay.config.json') {
  return (dispatch, getState) => {
    const { projectPath, testPath, blockPath, shareLinks } = project
    const existingSuites = getState().editor.suites.map(s => ({
      [s.name]: s.data.tests
    })).reduce((acc, cv) => ({ ...acc, ...cv }), {})
    // If there are suites on disk, write those out because its the initial setup
    const suites = project.suites
      ? project.suites
      : existingSuites
    // Read in current config on disk to get options not stored in UI
    return nativeMessage({
      type: 'listDir',
      data: projectPath
    })
      .then(list => list.filter(i => i.name === 'replay.config.json'))
      .then(filtered => {
        if (filtered.length === 0) {
          return Promise.resolve({ data: {} })
        } else {
          return nativeMessage({
            type: 'readFile',
            filepath: `${projectPath}/replay.config.json`
          })
        }
      })
      .then(({ data }) => nativeMessage({
        type: 'saveFile',
        data: {
          folder: projectPath,
          fileName: 'replay.config',
          data: { testPath, blockPath, suites, shareLinks, runOptions: data.runOptions }
        }
      }))
      .then(() => Promise.all([
        makeDirectory(`${projectPath}/${testPath.replace('./', '')}`),
        makeDirectory(`${projectPath}/${blockPath.replace('./', '')}`)
      ]))
      .then(() => reason && message.success(reason))
      .then(() => dispatch(logMessage({ type: 'Write Project Config', project })))
      .catch(e => message.error('Error saving: ' + JSON.stringify(e), 2))
  }
}

export function checkForExistingConfig (folder) {
  return (dispatch, getState) => {
    return nativeMessage({
      type: 'listDir',
      data: folder
    })
      .then(list => list.filter(i => i.name === 'replay.config.json'))
      .then(filtered => {
        if (filtered.length === 0) {
          dispatch(existingConfig(false))
        } else {
          dispatch(existingConfig(true))
          return nativeMessage({
            type: 'readFile',
            filepath: `${folder}/replay.config.json`
          })
            .then(({ data }) => {
              if (data && data.testPath) {
                dispatch({
                  type: T.TEST_PATH,
                  path: data.testPath
                })
              }
              if (data && data.blockPath) {
                dispatch({
                  type: T.BLOCK_PATH,
                  path: data.blockPath
                })
              }
              if (data && data.suites) {
                dispatch({
                  type: T.EXISTING_SUITES,
                  suites: data.suites
                })
              } else {
                dispatch({
                  type: T.EXISTING_SUITES,
                  suites: {}
                })
              }
            })
        }
      })
      .catch(console.error)
  }
}

export function reloadProjectFiles (project) {
  return (dispatch, getState) => {
    const filepathsToData = files => nativeMessage({
      type: 'readFiles',
      filepaths: files.filter(f => f.name.includes('.json')).map(f => f.fullpath)
    })
      .then(response => response.files.map(f => ({
        name: f.testName,
        data: f.data
      })))

    const currentProject = project || getState().editor.project

    return Promise.all([
      nativeMessage({
        type: 'listDir',
        data: `${currentProject.projectPath}/${currentProject.testPath.replace('./', '')}`
      })
        .then(filepathsToData),
      nativeMessage({
        type: 'listDir',
        data: `${currentProject.projectPath}/${currentProject.blockPath.replace('./', '')}`
      })
        .then(filepathsToData),
      nativeMessage({
        type: 'readFile',
        filepath: `${currentProject.projectPath}/replay.config.json`
      })
        .then((data) => {
          currentProject.shareLinks = (data && data.data && data.data.shareLinks) || []
          return data
        })
        .then(({ data }) => data && data.suites ? data.suites : [])
        .then(suites => Object.keys(suites).map(s => ({
          name: s,
          data: {
            tests: suites[s]
          }
        })))
    ])
      .then(([testCases, blocks, suites]) => {
        dispatch(importTestCases(testCases))
        dispatch(importBlocks(blocks))
        dispatch(importSuites(suites))
      })
  }
}

export function selectProject (project) {
  return (dispatch, getState) => {
    return Promise.all([
      testCaseModel.listByProject(project),
      blockModel.listByProject(project),
      suiteModel.listByProject(project)
    ]).then(([testCases, blocks, suites]) => {
      dispatch({
        type: T.SELECT_PROJECT,
        data: project,
        post: ({ dispatch, getState }) => {
          storage.set('project', project.id)
          dispatch(setTestCases(testCases))
          dispatch(setBlocks(blocks))
          dispatch(setSuites(suites))
        }
      })
    })
      .then(() => {
        if (project.projectPath) {
          dispatch(reloadProjectFiles(project))
        }
      })
  }
}
