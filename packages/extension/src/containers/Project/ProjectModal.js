import { types as T } from '../../actions/action_types'
import { connect } from 'react-redux'
import {
  updateProject,
  clearProjectSetup,
  changeModalState,
  setPathPurpose,
  createProject,
  checkForExistingConfig
} from '../../actions'
import ProjectModal from '../../components/Project/ProjectModal'

const mapStateToProps = (state) => {
  return {
    visible: state.modals.projectSetup,
    testPath: state.projectSetup.testPath,
    blockPath: state.projectSetup.blockPath,
    suites: state.projectSetup.suites,
    projectPath: state.projectSetup.projectPath,
    existingConfig: state.projectSetup.existingConfig,
    firstTime: state.editor.projects.length === 0,
    id: state.projectSetup.id,
    name: state.projectSetup.name
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createProject: (project) => dispatch(createProject(project)),
    updateProject: (project) => dispatch(updateProject(project)),
    clearProjectSetup: () => dispatch(clearProjectSetup()),
    closeModal: () => dispatch(changeModalState('projectSetup', false)),
    checkForExistingConfig: path => {
      dispatch({
        type: T.PROJECT_PATH,
        path
      })
      dispatch(checkForExistingConfig(path))
    },
    browseProject: () => {
      dispatch(setPathPurpose(T.PROJECT_PATH))
      dispatch(changeModalState('browser', true))
    },
    browseTest: () => {
      dispatch(setPathPurpose(T.TEST_PATH))
      dispatch(changeModalState('browser', true))
    },
    browseBlock: () => {
      dispatch(setPathPurpose(T.BLOCK_PATH))
      dispatch(changeModalState('browser', true))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectModal)
