import React from 'react'
import PropTypes from 'prop-types'
import {Button, Icon, Tooltip} from 'antd'
import { getPlayer } from '../../common/player'

const StopButton = (props) => {
  return (
    <Tooltip title='Stop Test'>
      <Button
        shape='circle'
        disabled={props.stopped}
        onClick={() => getPlayer().stop()}
        style={{ color: '#ffffff', background: '#d82923', 'marginLeft': '5px' }}>
        <Icon type="right-square"
          style={{ background: '#ffffff' }} />
      </Button>
    </Tooltip>
  )
}

StopButton.propTypes = {
  stopped: PropTypes.bool
}

export default StopButton
