import { connect } from 'react-redux'
import { playerPlay, filterCommands } from '../../actions'
import PlayButton from '../../components/dashboard/PlayButton'
const mapStateToProps = (state) => {
  return {
    editing: state.editor.editing,
    config: state.app.config,
    filterCommands: state.editor.editing
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    playerPlay: (options) => dispatch(playerPlay(options)),
    removeSearch: () => dispatch(filterCommands(''))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayButton)
