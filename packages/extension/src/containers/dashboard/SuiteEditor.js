import { connect } from 'react-redux'
import {
  addTestToSuite,
  removeTestFromSuite,
  createSuite,
  updateSuite
} from '../../actions'

import SuiteEditor from '../../components/dashboard/SuiteEditor'

const mapStateToProps = state => {
  return {
    tests: state.editor.testCases,
    name: state.editor.editing.meta.src && state.editor.editing.meta.src.name,
    selectedTests: state.editor.editing.tests
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addTestToSuite: (test) => dispatch(addTestToSuite(test)),
    removeTestFromSuite: (test) => dispatch(removeTestFromSuite(test))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SuiteEditor);
