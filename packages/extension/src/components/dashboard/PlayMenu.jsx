import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'antd'
import * as C from '../../common/constant'

const PlayMenu = (props) => {
  return (
    <Menu onClick={() => props.togglePlayLoopsModal(true)} selectable={false}>
      <Menu.Item key="play_loop" disabled={props.status !== C.PLAYER_STATUS.STOPPED}>
        Play loop..
      </Menu.Item>
    </Menu>
  )
}

PlayMenu.propTypes = {
  togglePlayLoopsModal: PropTypes.func.isRequired,
  status: PropTypes.string
}

export default PlayMenu
