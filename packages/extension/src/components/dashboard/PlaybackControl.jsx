import React from 'react'
import PropTypes from 'prop-types'
import * as C from '../../common/constant'
import PauseButton from './PauseButton'
import ResumeButton from './ResumeButton'
import StopButton from './StopButton'
import PlayButton from '../../containers/dashboard/PlayButton'

const PlaybackControl = (props) => {
  const playStopButton = props.status === C.PLAYER_STATUS.STOPPED
    ? <PlayButton />
    : <StopButton stopped={props.status === C.PLAYER_STATUS.STOPPED} />
  if (props.status === C.PLAYER_STATUS.PLAYING) {
    return (
      <span>
        {playStopButton}
        <PauseButton />
      </span>
    )
  } else if (props.status === C.PLAYER_STATUS.PAUSED) {
    return (
      <span>
        {playStopButton}
        <ResumeButton />
      </span>
    )
  } else {
    return (
      <span>
        {playStopButton}
      </span>
    )
  }
}

PlaybackControl.propTypes = {
  status: PropTypes.string
}

export default PlaybackControl
