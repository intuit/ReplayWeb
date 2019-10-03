import { connect } from 'react-redux'
import {changeModalState, duplicate} from '../../actions'
import * as C from '../../common/constant';
import DuplicateModal from '../../components/Modals/DuplicateModal'
const mapStateToProps = (state) => {
  return {
    visible: state.modals.duplicate,
    src: state.editor.editing.meta.src,
    tests: state.editor.status === C.EDITOR_STATUS.TESTS,
    type: state.editor.status.toLowerCase().slice(0, state.editor.status.length - 1)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    duplicate: (name) => dispatch(duplicate(name)),
    closeModal: () => dispatch(changeModalState('duplicate', false))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DuplicateModal)
