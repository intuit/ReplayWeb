import React from 'react'
import { Button, Icon } from 'antd'
import { getPlayer } from '../../common/player'

const PauseButton = (props) => {
  const pause = () => {
    getPlayer().pause()
  }
  return (
    <Button
      shape='circle'
      onClick={pause}
      style={{ marginLeft: '5px', marginRight: '5px', background: '#f4dc42' }}
    >
      <Icon type="pause" />
    </Button>
  )
}

export default PauseButton
