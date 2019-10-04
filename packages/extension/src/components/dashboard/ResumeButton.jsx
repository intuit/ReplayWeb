import React from 'react'
import { Button, Icon, Tooltip } from 'antd'
import { getPlayer } from '../../common/player'
import PlayMenu from '../../containers/dashboard/PlayMenu'

const ResumeButton = (props) => {
  const resume = () => {
    getPlayer().resume()
  }
  return (
    <Tooltip title="Resume Test">
      <Button
        shape='circle'
        onClick={resume}
        style={{ marginLeft: '5px', marginRight: '5px', background: '#41b8f4' }}
      >
        <Icon type="caret-right" />
      </Button>
    </Tooltip>
  )
}

export default ResumeButton
