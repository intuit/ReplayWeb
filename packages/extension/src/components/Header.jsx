import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Modal, Button, Tooltip } from 'antd'
import * as C from '../common/constant'
import '../styles/header.scss'

import SettingModal from '../containers/Modals/SettingModal'
import SaveModal from '../containers/Modals/SaveModal'
import DuplicateModal from '../containers/Modals/DuplicateModal'
import RenameModal from '../containers/Modals/RenameModal'
import PlayLoopModal from '../containers/Modals/PlayLoopModal'
import PlaybackControl from '../components/dashboard/PlaybackControl'
import SaveMultiSelectModal from '../containers/Modals/SaveMultiSelectModal'
import NewBlockModal from '../containers/Modals/NewBlockModal'
import TestcaseDropdown from '../containers/dashboard/TestcaseDropdown'
import ProjectModal from '../containers/Project/ProjectModal'
import FolderBrowser from '../containers/Project/FolderBrowser'
import ShareBlockModal from '../containers/Modals/ShareBlockModal'

const SubMenu = Menu.SubMenu

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 'new-test'
    }
  }

  handleClick(e) {
    this.setState({
      current: e.key
    })
  }

  getTestCaseName() {
    const { src } = this.props.editing.meta
    return src && src.name && src.name.length ? src.name : 'Untitled'
  }

  onClickNew() {
    const { hasUnsaved } = this.props.editing.meta
    const go = () => {
      this.props.editNew(this.props.editorType)
      this.props.logMessage({ type: 'New Test' })
      return Promise.resolve()
    }

    if (hasUnsaved) {
      return Modal.confirm({
        title: 'Unsaved changes',
        content: 'Do you want to discard the unsaved changes?',
        okText: 'Discard',
        cancelText: 'Cancel',
        onOk: go,
        onCancel: () => {}
      })
    }

    go()
  }

  onClickSave() {
    const meta = this.props.editing.meta
    const { src, hasUnsaved } = meta

    if (!hasUnsaved) return

    if (src) {
      this.props.saveEditingAsExisted(this.props.editorType)
    } else {
      this.props.changeModalState('save', true)
    }
  }

  componentWillMount() {
    window.addEventListener('keydown', e => {
      if (e.keyCode === 83 && (e.ctrlKey || e.metaKey)) {
        this.onClickSave()
        e.preventDefault()
      }
    })

    window.addEventListener('keydown', e => {
      if (e.keyCode === 78 && (e.ctrlKey || e.metaKey)) {
        this.onClickNew()
        e.preventDefault()
      }
    })
  }

  onToggleRecord() {
    if (this.props.status === C.APP_STATUS.RECORDER) {
      this.props.stopRecording()
      // Note: remove targetOptions from all commands
      this.props.normalizeCommands()
    } else {
      this.props.startRecording()
    }

    this.setState({ lastOperation: 'record' })
  }

  isPlayerStopped() {
    return this.props.player.status === C.PLAYER_STATUS.STOPPED
  }

  render() {
    const { status, editing } = this.props
    const { meta } = editing
    const { src, hasUnsaved } = meta

    const isPlayerStopped = this.isPlayerStopped()
    const isRecording = status === C.APP_STATUS.RECORDER
    const testcaseClass = hasUnsaved ? 'unsaved' : ''

    const saveBtnState = {
      text: src ? 'Save' : 'Save..',
      disabled: !hasUnsaved
    }

    return (
      <div className="header">
        <Menu
          onClick={this.handleClick}
          disabled={!isPlayerStopped}
          selectable={false}
          mode="horizontal"
          theme="dark"
        >
          <SubMenu
            title={
              <span>
                <Icon type="menu-unfold" />
                Menu
              </span>
            }
            className="header-items"
          >
            <Menu.Item
              key="new-test"
              disabled={!isPlayerStopped}
              onClick={this.onClickNew}
            >
              <span>
                <Icon type="file" /> New{' '}
              </span>{' '}
              <span>⌘N</span>
            </Menu.Item>
            <Menu.Item
              key="save-test"
              disabled={!isPlayerStopped && saveBtnState.disabled}
              onClick={this.onClickSave}
            >
              <span>
                <Icon type="save" />
                {saveBtnState.text}
              </span>{' '}
              <span>⌘S</span>
            </Menu.Item>
            <TestcaseDropdown />
          </SubMenu>
        </Menu>
        <div className="status-bar">
          <span className={testcaseClass}>
            {hasUnsaved ? 'Unsaved Changes' : ''}
          </span>
        </div>
        <div className="play-ops">
          <span>
            <Tooltip title={isRecording ? 'Stop Recording' : 'Start Recording'}>
              <Button
                disabled={!isPlayerStopped}
                onClick={this.onToggleRecord}
                shape="circle"
                style={
                  isRecording
                    ? { color: '#ffffff', background: '#1a98ec' }
                    : { color: '#ffffff', background: '#d82923' }
                }
              >
                <Icon type="video-camera" />
              </Button>
            </Tooltip>
            <PlaybackControl status={this.props.player.status} />
          </span>
        </div>
        <SettingModal />
        <DuplicateModal />
        <SaveModal />
        <NewBlockModal />
        <RenameModal />
        <ShareBlockModal />
        <PlayLoopModal />
        <SaveMultiSelectModal />
        <ProjectModal />
        <FolderBrowser />
      </div>
    )
  }
}

Header.propTypes = {
  editNew: PropTypes.func.isRequired,
  logMessage: PropTypes.func.isRequired,
  editing: PropTypes.object.isRequired,
  saveEditingAsExisted: PropTypes.func.isRequired,
  editorType: PropTypes.any.isRequired,
  changeModalState: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  stopRecording: PropTypes.func.isRequired,
  normalizeCommands: PropTypes.func.isRequired,
  startRecording: PropTypes.func.isRequired,
  player: PropTypes.object.isRequired
}

export default Header
