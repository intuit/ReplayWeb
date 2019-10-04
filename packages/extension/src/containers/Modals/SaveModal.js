import { connect } from 'react-redux'
import {
  changeModalState,
  saveEditingAsExisted,
  saveEditingSuiteAsExisted,
  saveEditingBlockAsExisted,
  saveEditingBlockAsNew,
  saveEditingAsNew,
  saveEditingSuiteAsNew,
  setNextTest,
  setNextBlock,
  setNextSuite,
  selectProject,
  editNext,
  clearNext
} from '../../actions'
import SaveModal from '../../components/Modals/SaveModal'
import * as C from '../../common/constant'
const mapStateToProps = state => {
  return {
    visible: state.modals.save,
    src: state.editor.editing.meta.src,
    project: state.editor.project,
    editorStatus: state.editor.status,
    newSave: state.editor.editing.meta.isNewSave
  }
}

const mapDispatchToProps = dispatch => {
  return {
    editNext: () => dispatch(editNext()),
    clearNext: () => dispatch(clearNext()),
    saveEditingAsExisted: () => dispatch(saveEditingAsExisted()),
    saveEditingAsNew: name => dispatch(saveEditingAsNew(name)),
    saveEditingSuiteAsExisted: () => dispatch(saveEditingSuiteAsExisted()),
    saveEditingSuiteAsNew: name => dispatch(saveEditingSuiteAsNew(name)),
    saveEditingBlockAsExisted: () => dispatch(saveEditingBlockAsExisted()),
    saveEditingBlockAsNew: name => dispatch(saveEditingBlockAsNew(name)),
    closeModal: () => dispatch(changeModalState('save', false)),
    selectProject: project => dispatch(selectProject(project))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaveModal)
