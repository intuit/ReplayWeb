import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../actions'

import CommandOptions from '../../components/dashboard/CommandOptions'

export default connect(
  state => ({
    status: state.app.status,
    editor: state.editor,
    editing: state.editor.editing,
    clipboard: state.editor.clipboard,
    player: state.player,
    config: state.app.config,
    selectedCmds: state.editor.selectedCmds,
    selectedCommand: state.editor.editing.meta.selectedIndex
  }),
  dispatch => bindActionCreators({ ...actions }, dispatch)
)(CommandOptions)
