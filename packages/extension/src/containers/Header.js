import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  editNewTestCase,
  saveEditingAsExisted,
  saveEditingBlockAsExisted,
  saveEditingSuiteAsExisted,
  changeModalState,
  stopRecording,
  startRecording,
  normalizeCommands,
  editNewBlock,
  editNewSuite,
  logMessage
} from '../actions'
import Header from '../components/Header'
import * as C from '../common/constant'

const mapStateToProps = (state) => {
  return {
    status: state.app.status,
    editing: state.editor.editing,
    editorType: state.editor.status,
    testCases: state.editor.testCases,
    player: state.player,
    config: state.app.config,
    project: state.editor.project,
    activeFolder: state.files.activeFolder
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editNew: type => {
      switch (type) {
        case C.EDITOR_STATUS.TESTS:
          return dispatch(editNewTestCase())
        case C.EDITOR_STATUS.BLOCKS:
          return dispatch(editNewBlock())
        case C.EDITOR_STATUS.SUITES:
          return dispatch(editNewSuite())
      }
    },
    saveEditingAsExisted: type => {
      switch (type) {
        case C.EDITOR_STATUS.TESTS:
          return dispatch(saveEditingAsExisted())
        case C.EDITOR_STATUS.BLOCKS:
          return dispatch(saveEditingBlockAsExisted())
        case C.EDITOR_STATUS.SUITES:
          return dispatch(saveEditingSuiteAsExisted())
      }
    },
    changeModalState: (id, state) => dispatch(changeModalState(id, state)),
    stopRecording: () => dispatch(stopRecording()),
    normalizeCommands: () => dispatch(normalizeCommands()),
    startRecording: () => dispatch(startRecording()),
    logMessage: (message) => dispatch(logMessage(message))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
