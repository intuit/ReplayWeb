import { connect } from 'react-redux'
import { changeModalState, renameTestCase, renameBlock, renameSuite } from '../../actions'
import RenameModal from '../../components/Modals/RenameModal'
import * as C from '../../common/constant'
const mapStateToProps = (state) => {
  return {
    visible: state.modals.rename,
    src: state.editor.editing.meta.src,
    editorStatus: state.editor.status,
    isTestCase: state.editor.status === C.EDITOR_STATUS.TESTS
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    renameSuite: (name) => dispatch(renameSuite(name)),
    renameTestCase: (name) => dispatch(renameTestCase(name)),
    renameBlock: (name) => dispatch(renameBlock(name)),
    closeModal: () => dispatch(changeModalState('rename', false))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RenameModal)
