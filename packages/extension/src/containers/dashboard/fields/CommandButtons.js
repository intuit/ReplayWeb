import { connect } from 'react-redux'
import { updateSelectedCommand } from '../../../actions'
import CommandButtons from '../../../components/dashboard/fields/CommandButtons'
import { newCommand } from '../../../common/commands'

const mapStateToProps = (state) => {
  const defaultDataSource = [newCommand]
  const index = state.editor.editing.meta.selectedIndex
  const selectedCmd = state.editor.editing.filterCommands && state.editor.editing.filterCommands.length ? state.editor.editing.commands[index] : defaultDataSource[index]
  return {
    selectedCmd: selectedCmd
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSelectedCommand: (obj) => dispatch(updateSelectedCommand(obj))

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommandButtons)
