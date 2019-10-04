import { connect } from 'react-redux'
import { updateConfig, changeModalState } from '../../actions'
import SettingModal from '../../components/Modals/SettingModal'
const mapStateToProps = state => {
  return {
    visible: state.modals.settings,
    config: state.app.config
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateConfig: data => dispatch(updateConfig(data)),
    onCancel: () => dispatch(changeModalState('settings', false))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingModal)
