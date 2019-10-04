import React from 'react'
import { connect } from 'react-redux'
import {
  editTestCase,
  editBlock,
  editSuite,
  playerPlay,
  editProject,
  selectProject,
  removeProject,
  setNextTest,
  setNextBlock,
  setNextSuite,
  changeModalState,
  setEditorStatus,
  editNewSuite,
  editNewTestCase,
  editNextTest,
  editNextBlock,
  editNextSuite
} from '../actions'
import * as C from '../common/constant'
import Sidebar from '../components/Sidebar/Sidebar'
const mapStateToProps = state => {
  return {
    status: state.app.status,
    testCases: state.editor.testCases,
    blocks: state.editor.blocks,
    suites: state.editor.suites,
    editing: state.editor.editing,
    player: state.player,
    config: state.app.config,
    project: state.editor.project || {},
    projects: state.editor.projects || [],
    editorStatus: state.editor.status
  }
}

const mapDispatchToProps = dispatch => {
  return {
    editTestCase: id => dispatch(editTestCase(id)),
    editSuite: id => dispatch(editSuite(id)),
    editProject: id => dispatch(editProject(id)),
    editNextTest: () => dispatch(editNextTest()),
    editNextBlock: () => dispatch(editNextBlock()),
    editNextSuite: () => dispatch(editNextSuite()),
    editNewTestCase: () => {
      dispatch(setEditorStatus(C.EDITOR_STATUS.TESTS))
      dispatch(editNewTestCase())
    },

    editNewSuite: () => {
      dispatch(setEditorStatus(C.EDITOR_STATUS.SUITES))
      dispatch(editNewSuite())
    },
    setNextTest: id => dispatch(setNextTest(id)),
    setNextBlock: id => dispatch(setNextBlock(id)),
    setNextSuite: id => dispatch(setNextSuite(id)),
    editBlock: id => dispatch(editBlock(id)),
    playerPlay: options => dispatch(playerPlay(options)),
    changeModalState: (modal, modalState) =>
      dispatch(changeModalState(modal, modalState)),
    selectProject: project => dispatch(selectProject(project)),
    removeProject: project => dispatch(removeProject(project)),
    setEditorStatus: status => dispatch(setEditorStatus(status))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar)
