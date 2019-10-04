import { connect } from 'react-redux'
import { changeModalState, saveMultiSelectAsNewBlock } from '../../actions'
import { SaveMultiSelectModal } from '../../components/Modals/SaveModal'
const mapStateToProps = state => {
  return {
    visible: state.modals.multiselect
  }
}
const mapDispatchToProps = dispatch => {
  return {
    saveMultiSelectAsNewBlock: name =>
      dispatch(saveMultiSelectAsNewBlock(name)),
    closeModal: () => dispatch(changeModalState('multiselect', false))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaveMultiSelectModal)
