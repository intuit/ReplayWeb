import { connect } from 'react-redux'
import {listDirectory, changeModalState, selectProjectFolder} from '../../actions'
import FolderBrowser from '../../components/Project/FolderBrowser.jsx'

const mapStateToProps = state => {
  return {
    folder: state.files.folder,
    error: state.files.error,
    contents: state.files.contents,
    visible: state.modals.browser,
    top: state.projectSetup.projectPath ? state.files.folder === state.projectSetup.projectPath : state.files.folder === '~'
  }
}

const mapDispatchToProps = dispatch => {
  return {
    listDirectory: (dir) => dispatch(listDirectory(dir)),
    closeModal: () => dispatch(changeModalState('browser', false)),
    selectFolder: () => dispatch(selectProjectFolder())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FolderBrowser)
