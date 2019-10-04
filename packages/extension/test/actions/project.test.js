import { types as T } from '../../src/actions/action_types'
import { mockStore } from '../utils'
import {
  existingConfig,
  setPathPurpose,
  fileError,
  listProjects,
  clearProjectSetup,
  createProject,
  updateProject,
  removeProject,
  editProject,
  listDirectory,
  selectProjectFolder,
  writeProjectConfig,
  checkForExistingConfig,
  reloadProjectFiles,
  selectProject,
  __RewireAPI__ as projectRewire
} from '../../src/actions/project'
import * as C from '../../src/common/constant'
jest.mock('../../src/actions/editor')
jest.mock('../../src/actions/filesystem')
jest.mock('../../src/actions/utilities')
jest.mock('../../src/actions/app')
jest.mock('../../src/common/storage')
jest.mock('../../src/models/project_model')
jest.mock('../../src/models/test_case_model')
jest.mock('../../src/models/suite_model')
jest.mock('../../src/models/block-model')
jest.mock('antd')

describe('project actions', () => {
  afterEach(() => {
    require('../../src/actions/utilities').default.__reset()
    projectRewire.__ResetDependency__('writeProjectConfig')
    projectRewire.__ResetDependency__('nativeMessage')
    projectRewire.__ResetDependency__('checkForExistingConfig')
    projectRewire.__ResetDependency__('selectProject')
    projectRewire.__ResetDependency__('fileError')
    projectRewire.__ResetDependency__('reloadProjectFiles')
    projectRewire.__ResetDependency__('message')
  })
  beforeEach(() => {
    projectRewire.__Rewire__('message', {
      success: () => {},
      error: () => {}
    })
  })
  describe('plain actions', () => {
    it('should format object correctly for existingConfig', () => {
      const action = existingConfig(true)
      expect(action.type).toEqual(T.EXISTING_CONFIG)
      expect(action.exists).toEqual(true)
    })
    it('should format object correctly for setPathPurpose', () => {
      const action = setPathPurpose(T.PROJECT_PATH)
      expect(action.type).toEqual(T.SET_PURPOSE)
      expect(action.purpose).toEqual(T.PROJECT_PATH)
    })
    it('should format object correctly for fileError', () => {
      const action = fileError()
      expect(action.type).toEqual(T.FILE_ERROR)
    })
    it('should format object correctly for listProjects', () => {
      const action = listProjects([1, 2, 3])
      expect(action.type).toEqual(T.LIST_PROJECTS)
      expect(action.data.length).toEqual(3)
    })
    it('should format object correctly for clearProjectSetup', () => {
      const action = clearProjectSetup()
      expect(action.type).toEqual(T.CLEAR_PROJECT_SETUP)
    })
  })
  describe('thunk actions', () => {
    describe('createProject', () => {
      it('createProject should fire create action', async () => {
        projectRewire.__Rewire__('writeProjectConfig', () => ({ type: 'WRITE_PROJECT' }))
        const store = mockStore({
          projectSetup: {
            suites: []
          }
        })
        await store.dispatch(createProject({}))
        const actions = store.getActions()
        expect(actions[0].type).toEqual(T.CREATE_PROJECT)
        expect(actions[1].type).toEqual('WRITE_PROJECT')
        expect(actions[2].type).toEqual('LOG_MESSAGE')
      })
    })
    describe('updateProject', () => {
      it('update should dispatch selectProject and writeProjectConfig', async () => {
        projectRewire.__Rewire__('writeProjectConfig', () => ({ type: 'WRITE_PROJECT' }))
        projectRewire.__Rewire__('selectProject', () => ({ type: T.SELECT_PROJECT }))
        const store = mockStore()
        await store.dispatch(updateProject({ id: 1, name: 'potato' }))
        const actions = store.getActions()
        expect(actions[0].type).toEqual(T.SELECT_PROJECT)
        expect(actions[1].type).toEqual('WRITE_PROJECT')
        expect(actions[2].type).toEqual('LOG_MESSAGE')
      })
    })
    describe('removeProject', () => {
      it('remove should dispatch delete project', async () => {
        const store = mockStore()
        await store.dispatch(removeProject({ id: 1, name: 'potato' }))
        const actions = store.getActions()
        expect(actions[0].type).toEqual(T.DELETE_PROJECT)
        expect(actions[1].type).toEqual('LOG_MESSAGE')
      })
    })
    describe('editProject', () => {
      it('edit should dispatch edit project', async () => {
        const store = mockStore()
        await store.dispatch(editProject(1))
        const actions = store.getActions()
        expect(actions[0].type).toEqual(T.EDIT_PROJECT)
      })
    })
    describe('listDirectory', () => {
      it('listDirectory should dispatch select', async () => {
        projectRewire.__Rewire__('fileError', () => ({ type: T.FILE_ERROR }))
        const store = mockStore()
        await store.dispatch(listDirectory('./test'))
        const actions = store.getActions()
        expect(actions[0].type).toEqual(T.SELECT_FOLDER)
      })
      it('listDirectory should dispatch fileerror if it fails', async () => {
        require('../../src/actions/utilities').default.__setFail(true)
        projectRewire.__Rewire__('fileError', () => ({ type: T.FILE_ERROR }))
        const store = mockStore()
        await store.dispatch(listDirectory('./test'))
        const actions = store.getActions()
        expect(actions[0].type).toEqual(T.FILE_ERROR)
      })
    })
    describe('selectProjectFolder', () => {
      it('selectProjectFolder should dispatch checkForExistingConfig when purpose is PROJECT_PATH', async () => {
        projectRewire.__Rewire__('checkForExistingConfig', () => ({ type: T.EXISTING_CONFIG }))
        const store = mockStore({
          projectSetup: {
            purpose: T.PROJECT_PATH
          },
          files: {
            folder: '/'
          }
        })
        await store.dispatch(selectProjectFolder('./test'))
        const actions = store.getActions()
        expect(actions[0].type).toEqual(T.EXISTING_CONFIG)
        expect(actions[1].type).toEqual(T.PROJECT_PATH)
        expect(actions[2].type).toEqual(T.MODAL_STATE)
      })
      it('selectProjectFolder should not dispatch checkForExistingConfig when purpose is not PROJECT_PATH', async () => {
        projectRewire.__Rewire__('checkForExistingConfig', () => ({ type: T.EXISTING_CONFIG }))
        const store = mockStore({
          projectSetup: {
            purpose: T.TEST_PATH
          },
          files: {
            folder: '/'
          }
        })
        await store.dispatch(selectProjectFolder('./test'))
        const actions = store.getActions()
        expect(actions[0].type).toEqual(T.TEST_PATH)
        expect(actions[1].type).toEqual(T.MODAL_STATE)
      })
    })
    describe('writeProjectConfig', () => {
      beforeEach(() => {
        projectRewire.__Rewire__('nativeMessage', async ({ type }) => {
          switch (type) {
            case 'listDir':
              return [
                { name: 'replay.config.json' }
              ]
            case 'readFile':
              return {
                data: {
                  runOptions: {}
                }
              }
            case 'mkdir':
            case 'saveFile':
              return {}
          }
        })
      })
      it('writeProjectConfig should dispatch LOG_MESSAGE if successful', async () => {
        const store = mockStore({
          editor: {
            suites: []
          }
        })
        await store.dispatch(writeProjectConfig({
          projectPath: '/',
          testPath: './test',
          blockPath: './block'
        }))
        const actions = store.getActions()
        expect(actions[0].type).toEqual('LOG_MESSAGE')
      })
    })
    describe('checkForExistingConfig', () => {
      it('checkForExistingConfig should dispatch EXISTING_CONFIG false if not found', async () => {
        require('../../src/actions/utilities').default.__setReturn('listDir', [])
        const store = mockStore()
        await store.dispatch(checkForExistingConfig('/'))
        const actions = store.getActions()
        expect(actions[0].type).toEqual('EXISTING_CONFIG')
        expect(actions[0].exists).toEqual(false)
      })
      it('checkForExistingConfig should dispatch EXISTING_CONFIG true if found', async () => {
        require('../../src/actions/utilities').default.__setReturn('listDir', [{ name: 'replay.config.json' }])
        require('../../src/actions/utilities').default.__setReturn('readFile', { data: { testPath: './test', blockPath: './block' } })
        const store = mockStore()
        await store.dispatch(checkForExistingConfig('/'))
        const actions = store.getActions()
        expect(actions[0].type).toEqual(T.EXISTING_CONFIG)
        expect(actions[0].exists).toEqual(true)
        expect(actions[1].type).toEqual(T.TEST_PATH)
        expect(actions[1].path).toEqual('./test')
        expect(actions[2].type).toEqual(T.BLOCK_PATH)
        expect(actions[2].path).toEqual('./block')
      })
    })
    describe('reloadProjectFiles', () => {
      it('reloadProjectFiles should dispatch imports for updated files', async () => {
        require('../../src/actions/utilities').default.__setReturn('listDir', [{ name: 'testA.json' }])
        require('../../src/actions/utilities').default.__setReturn('readFiles', {
          files: [
            {
              testName: 'testA',
              data: {
                Commands: [
                  {
                    Command: 'open',
                    Target: 'example.com',
                    Value: '{}'
                  }
                ]
              }
            }
          ]
        })
        require('../../src/actions/utilities').default.__setReturn('readFile', {
          testPath: './test',
          blockPath: './block',
          suites: []
        })
        const store = mockStore({
          editor: {
            project: {
              id: 1,
              projectPath: '/',
              testPath: './test',
              blockPath: './block'
            }
          }
        })
        await store.dispatch(reloadProjectFiles())
        const actions = store.getActions()
        expect(actions[0].type).toEqual(T.SET_TEST_CASES)
        expect(actions[1].type).toEqual(T.SET_BLOCKS)
        expect(actions[2].type).toEqual(T.SET_SUITES)
      })
      it('reloadProjectFiles should dispatch imports for updated files for passed in project', async () => {
        require('../../src/actions/utilities').default.__setReturn('listDir', [{ name: 'testA.json' }])
        require('../../src/actions/utilities').default.__setReturn('readFiles', {
          files: [
            {
              testName: 'testA',
              data: {
                Commands: [
                  {
                    Command: 'open',
                    Target: 'example.com',
                    Value: '{}'
                  }
                ]
              }
            }
          ]
        })
        require('../../src/actions/utilities').default.__setReturn('readFile', {
          testPath: './test',
          blockPath: './block',
          suites: []
        })
        const store = mockStore()
        await store.dispatch(reloadProjectFiles({
          id: 1,
          projectPath: '/',
          testPath: './test',
          blockPath: './block'
        }))
        const actions = store.getActions()
        expect(actions[0].type).toEqual(T.SET_TEST_CASES)
        expect(actions[1].type).toEqual(T.SET_BLOCKS)
        expect(actions[2].type).toEqual(T.SET_SUITES)
      })
    })
    describe('selectProject', () => {
      it('selectProject should dispatch EXISTING_CONFIG false if not found', async () => {
        const store = mockStore()
        await store.dispatch(selectProject({}))
        const actions = store.getActions()
        expect(actions[0].type).toEqual(T.SELECT_PROJECT)
      })
      it('selectProject should reload project files if projectPath exists', async () => {
        projectRewire.__Rewire__('reloadProjectFiles', () => ({ type: 'RELOAD_PROJECT' }))
        const store = mockStore()
        await store.dispatch(selectProject({ projectPath: '/' }))
        const actions = store.getActions()
        expect(actions[0].type).toEqual(T.SELECT_PROJECT)
        expect(actions[1].type).toEqual('RELOAD_PROJECT')
      })
    })
  })
})
