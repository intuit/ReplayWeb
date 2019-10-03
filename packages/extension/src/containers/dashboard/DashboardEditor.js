import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators }  from 'redux'
import * as actions from '../../actions'

import DashboardEditor from '../../components/dashboard/DashboardEditor'

export default connect(
  state => ({
    status: state.app.status,
    editorStatus: state.editor.status,
    editing: state.editor.editing,
    clipboard: state.editor.clipboard,
    player: state.player,
    config: state.app.config,
    searchText: state.editor.searchText,
    selectedCmds: state.editor.selectedCmds,
    contextMenu: state.editor.contextMenu
  }),
  dispatch => bindActionCreators({...actions}, dispatch)
)(DashboardEditor)
