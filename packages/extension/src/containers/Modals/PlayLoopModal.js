import { connect } from 'react-redux'
import {changeModalState, playerPlay} from '../../actions'
import PlayLoopModal from '../../components/Modals/PlayLoopModal'
const mapStateToProps = (state) => {
  return {
    visible: state.modals.playLoop,
    status: state.player.status,
    editing: state.editor.editing,
    config: state.app.config
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    togglePlayLoopsModal: (state) => dispatch(changeModalState('playLoop', state)),
    playerPlay: (options) => dispatch(playerPlay(options))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayLoopModal)
