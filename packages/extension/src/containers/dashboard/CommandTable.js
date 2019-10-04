import { connect } from 'react-redux'
import {
  selectCommand,
  removeCommand,
  insertCommand,
  reorderCommand,
  filterCommands,
  multiSelect,
  removeSelected,
  groupSelect,
  showContextMenu
} from '../../actions'
import CommandTable from '../../components/dashboard/CommandTable'

const mapStateToProps = state => {
  return {
    editing: state.editor.editing,
    player: state.player,
    editor: state.editor,
    filterCommands: state.editor.editing,
    searchText: state.editor.searchText,
    selectedCommand: state.editor.editing.meta.selectedIndex
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectCommand: index => dispatch(selectCommand(index)),
    removeCommand: index => dispatch(removeCommand(index)),
    insertCommand: (command, index) => dispatch(insertCommand(command, index)),
    reorderCommand: (dragIndex, hoverIndex) =>
      dispatch(reorderCommand(dragIndex, hoverIndex)),
    filterCommands: searchText => dispatch(filterCommands(searchText)),
    removeSearchText: () => dispatch(filterCommands('')),
    multiSelect: index => dispatch(multiSelect(index)),
    groupSelect: index => dispatch(groupSelect(index)),
    removeSelected: () => dispatch(removeSelected()),
    showContextMenu: data => dispatch(showContextMenu(data))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommandTable)
