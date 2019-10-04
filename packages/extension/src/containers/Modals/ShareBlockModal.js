import { connect } from 'react-redux'
import { changeModalState, shareEditingBlock } from '../../actions'
import ShareBlockModal from '../../components/Modals/ShareBlockModal'

const mapStateToProps = (state) => {
  return {
    visible: state.modals.shareBlock,
    editing: state.editor.editing,
    blockShareConfig: state.app.blockShareConfig,
    blockShareConfigError: state.app.blockShareConfigError,
    blockShareConfigErrorMessage: state.app.blockShareConfigErrorMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(changeModalState('shareBlock', false)),
    openDuplicate: () => dispatch(changeModalState('duplicate', true)),
    shareEditingBlock: () => dispatch(shareEditingBlock())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareBlockModal)
