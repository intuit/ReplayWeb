import { connect } from 'react-redux';
import {
  changeModalState,
  setEditorStatus,
  selectProject,
  editNext,
  editNewBlock,
  clearNext,
  importBlockFromLink
} from '../../actions';
import NewBlockModal from '../../components/Modals/NewBlockModal';
import * as C from '../../common/constant';
import github from 'github-api'
const mapStateToProps = state => {
  return {
    visible: state.modals.newBlockModal,
    src: state.editor.editing.meta.src,
    project: state.editor.project,
    editorStatus: state.editor.status,
    blockShareConfig: state.app.blockShareConfig,
    blockShareConfigError: state.app.blockShareConfigError,
    blockShareConfigErrorMessage: state.app.blockShareConfigErrorMessage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    editNext: () => dispatch(editNext()),
    clearNext: () => dispatch(clearNext()),
    closeModal: () => dispatch(changeModalState('newBlockModal', false)),
    selectProject: project => dispatch(selectProject(project)),
    editNewBlock: () => {
      dispatch(setEditorStatus(C.EDITOR_STATUS.BLOCKS))
      dispatch(editNewBlock())
      dispatch(changeModalState('newBlockModal', false))
    },
    importBlock: (link) => {
      return dispatch(importBlockFromLink(link))
  
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewBlockModal);
