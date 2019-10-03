import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Modal, message, Icon } from 'antd'
import * as C from '../../common/constant'
import { pick } from '../../common/utils'

export default function Dropdown (props) {
  switch (props.editorStatus) {
    case C.EDITOR_STATUS.TESTS:
      return <TestcaseDropdown {...props} />
    case C.EDITOR_STATUS.BLOCKS:
      return <BlockDropdown {...props} />
    case C.EDITOR_STATUS.SUITES:
      return <SuiteDropdown {...props} />
  }
}

Dropdown.propTypes = {
  editorStatus: PropTypes.string.isRequired
}

export function BlockDropdown (props) {
  const onDelete = () => {
    const go = () => {
      return props.removeCurrentBlock().then(() => {
        message.success('successfully deleted!', 1.5)
      })
    }

    return Modal.confirm({
      title: 'Are you sure?',
      content: 'Do you really want to delete this block?',
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: go,
      onCancel: () => {}
    })
  }

  const onShare = () => {
    console.log('Chaning modal state')
    return props.changeModalState('shareBlock', true)
  }

  const selectedProps = pick(
    [
      'status',
      'editing',
      'closeDropdown',
      'changeModalState',
      'onClickMenuItem'
    ],
    props
  )

  return (
    <GenericDropdown
      {...selectedProps}
      onDelete={onDelete}
      onShare={onShare}
    />
  )
}

BlockDropdown.propTypes = {
  removeCurrentBlock: PropTypes.func.isRequired,
  changeModalState: PropTypes.func.isRequired
}

export function TestcaseDropdown (props) {
  const onDelete = () => {
    const go = () => {
      return props.removeCurrentTestCase().then(() => {
        message.success('successfully deleted!', 1.5)
      })
    }

    return Modal.confirm({
      title: 'Are you sure?',
      content: 'Do you really want to delete this test case?',
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: go,
      onCancel: () => {}
    })
  }

  const selectedProps = pick(
    [
      'status',
      'editing',
      'closeDropdown',
      'changeModalState',
      'onClickMenuItem'
    ],
    props
  )

  return (
    <GenericDropdown
      {...selectedProps}
      onDelete={onDelete}
    />
  )
}

TestcaseDropdown.propTypes = {
  removeCurrentTestCase: PropTypes.func.isRequired
}

export function SuiteDropdown (props) {
  const onDelete = () => {
    const go = () => {
      return props.removeCurrentSuite().then(() => {
        message.success('successfully deleted!', 1.5)
      })
    }

    return Modal.confirm({
      title: 'Are you sure?',
      content: 'Do you really want to delete this suite?',
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: go,
      onCancel: () => {}
    })
  }

  const selectedProps = pick(
    [
      'status',
      'editing',
      'closeDropdown',
      'changeModalState',
      'onClickMenuItem'
    ],
    props
  )

  return (
    <GenericDropdown
      {...selectedProps}
      onDelete={onDelete}
    />
  )
}

SuiteDropdown.propTypes = {
  removeCurrentSuite: PropTypes.func.isRequired
}

function GenericDropdown ({
  status,
  editing,
  closeDropdown,
  changeModalState,
  onDelete,
  onShare
}) {
  const { meta } = editing
  const { src } = meta
  const canPlay = status === C.PLAYER_STATUS.STOPPED

  const onClickMenuItem = ({ key }) => {
    closeDropdown()
    const menuKeyToAction = {
      play_settings: () => changeModalState('settings', true),
      rename: () => {
        if (!src) return
        changeModalState('rename', true)
      },
      delete: onDelete,
      share: onShare,
      duplicate: () => changeModalState('duplicate', true)
    }
    return menuKeyToAction[key] ? menuKeyToAction[key].apply(null) : null
  }
  return (
    <Menu
      onClick={onClickMenuItem}
      selectable={false}
      theme="dark"
      className="header-items"
    >
      <Menu.Item key="duplicate" disabled={!src}>
        <span><Icon type="copy" /> Duplicate..</span>
      </Menu.Item>
      <Menu.Item key="rename" disabled={!src}>
        <span><Icon type="edit" /> Rename</span>
      </Menu.Item>
      <Menu.Item key="delete" disabled={!src}>
        <span><Icon type="delete" /> Delete</span>
      </Menu.Item>
      <Menu.Item key="share" disabled={!onShare}>
        <span><Icon type="upload" />Share</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="play_settings" disabled={!canPlay}>
        <span><Icon type="setting" /> Replay settings..</span>
      </Menu.Item>
    </Menu>
  )
}

GenericDropdown.propTypes = {
  status: PropTypes.string.isRequired,
  editing: PropTypes.object.isRequired,
  closeDropdown: PropTypes.func.isRequired,
  changeModalState: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired
}
