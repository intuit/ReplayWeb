import { connect } from 'react-redux'
import {
  changeModalState,
  changeDropdownState,
  removeCurrentTestCase,
  removeCurrentBlock,
  removeCurrentSuite
} from '../../actions'
import Dropdown from '../../components/dashboard/TestcaseDropdown'
const mapStateToProps = state => {
  return {
    status: state.player.status,
    editing: state.editor.editing,
    editorStatus: state.editor.status
  }
}

const mapDispatchToProps = dispatch => {
  return {
    removeCurrentTestCase: () => dispatch(removeCurrentTestCase()),
    removeCurrentBlock: () => dispatch(removeCurrentBlock()),
    removeCurrentSuite: () => dispatch(removeCurrentSuite()),
    changeModalState: (id, state) => dispatch(changeModalState(id, state)),
    closeDropdown: () => dispatch(changeDropdownState('testcase', false))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dropdown)
