import { connect } from 'react-redux'
import { changeModalState } from '../../actions'
import PlayMenu from '../../components/dashboard/PlayMenu'
const mapStateToProps = state => {
  return {
    visible: state.modals.playLoop,
    status: state.player.status
  }
}

const mapDispatchToProps = dispatch => {
  return {
    togglePlayLoopsModal: state => dispatch(changeModalState('playLoop', state))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayMenu)
