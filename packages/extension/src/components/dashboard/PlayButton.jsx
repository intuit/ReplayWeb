import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Tooltip } from 'antd'
import { getPlayer } from '../../common/player'

const PlayButton = (props) => {
  const play = () => {
    const { commands } = props.editing
    const { src } = props.editing.meta
    const openTc = commands.find(tc => tc.command.toLowerCase() === 'open')
    props.removeSearch()
    props.playerPlay({
      title: src && src.name && src.name.length ? src.name : 'Untitled',
      extra: {
        id: src && src.id
      },
      mode: getPlayer().C.MODE.STRAIGHT,
      startIndex: 0,
      startUrl: (openTc && openTc.parameters) ? openTc.parameters.url : null,
      resources: commands,
      postDelay: props.config.playCommandInterval * 1000
    })
  }
  return (
    <Tooltip title="Play Test">
      <Button
        shape='circle'
        onClick={play}
        style={{ color: '#ffffff', background: '#35b876', marginLeft: '5px', marginRight: '5px' }}>
        <Icon type="caret-right" />
      </Button>
    </Tooltip>
  )
}

PlayButton.propTypes = {
  editing: PropTypes.object.isRequired,
  removeSearch: PropTypes.func.isRequired,
  playerPlay: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired
}

export default PlayButton
