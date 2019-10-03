import { connect } from 'react-redux'
import CommandField from '../../../components/dashboard/fields/CommandField'
import {
  updateSelectedCommand,
  startInspecting,
  stopInspecting,
  setInspectTarget
} from '../../../actions'
import * as C from '../../../common/constant'
import { newCommand } from '../../../common/commands'

const mapStateToProps = state => {
  const defaultDataSource = [newCommand]
  const index = state.editor.editing.meta.selectedIndex
  const selectedCmd =
    state.editor.editing.filterCommands && state.editor.editing.filterCommands.length
      ? state.editor.editing.filterCommands[index]
      : defaultDataSource[index]
  return {
    selectedCmd: selectedCmd,
    commands: state.editor.editing.commands,
    isCmdEditable:
      state.player.status === C.PLAYER_STATUS.STOPPED && selectedCmd !== undefined,
    editing: state.editor.editing,
    filterCommands: state.editor.editing.filterCommands,
    blocks: state.editor.blocks,
    selectedIndex: index,
    isInspecting: state.app.status === C.APP_STATUS.INSPECTOR,
    inspectTarget: state.editor.inspectTarget
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateSelectedCommand: (obj, overwrite) => dispatch(updateSelectedCommand(obj, overwrite)),
    startInspecting: () => dispatch(startInspecting()),
    stopInspecting: () => dispatch(stopInspecting()),
    setInspectTarget: (target) => dispatch(setInspectTarget(target))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommandField)
