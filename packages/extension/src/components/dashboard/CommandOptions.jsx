import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Menu,
  Input,
  Form,
  Select,
  message,
  Tabs,
  Button,
  Modal,
  Tooltip,
  Icon
} from 'antd'

import inspector from '../../common/inspector'
import { getPlayer } from '../../common/player'
import csIpc from '../../common/ipc/ipc_cs'
import * as actions from '../../actions'
import * as C from '../../common/constant'

import allCommands, { newCommand } from '../../common/commands'

import CommandField from '../../containers/dashboard/fields/CommandField'
import CommandDoc from './CommandDoc'

const availableCommands = allCommands
  .map(c => c.name)
  .slice()
  .sort() // slice to make copy

const defaultDataSource = [newCommand]

class CommandOptions extends React.Component {
  state = {
    activeTabForCommands: 'table_view',
    sourceText: '',
    sourceTextModified: null,
    sourceErrMsg: null,
    visible: false,

    contextMenu: {
      x: null,
      y: null,
      isShown: false
    }
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  handleOk = e => {
    this.setState({
      visible: false
    })
  }

  handleCancel = e => {
    this.setState({
      visible: false
    })
  }

  onDetailChange = (key, value) => {
    this.props.updateSelectedCommand({ [key]: value })
  }

  updateEditorStatus = () => {
    this.props.setEditorStatus(C.EDITOR_STATUS.BLOCKS)
  }

  switchToBlockByName = name => {
    return new Promise((resolve, reject) => {
      const targetBlock = this.props.editor.blocks.find(
        block => block.name === name
      )
      if (targetBlock) {
        if (this.props.editing.meta.hasUnsaved) {
          this.props.setNextBlock(targetBlock.id)
          this.props.changeModalState('save', true)
          return resolve(false)
        } else {
          this.props.editBlock(targetBlock.id)
          this.updateEditorStatus()
          return resolve(true)
        }
      } else {
        return Promise.reject(
          'ERROR: CommandOption: Unable to find ID for block name: ' + name
        )
      }
    })
  }

  render() {
    const { status, editing } = this.props
    const { filterCommands, meta } = editing
    const { selectedIndex } = meta

    const isPlayerStopped = this.props.player.status === C.PLAYER_STATUS.STOPPED
    const dataSource =
      filterCommands && filterCommands.length
        ? filterCommands
        : defaultDataSource
    const selectedCmd = dataSource[selectedIndex]
    const isCmdEditable = isPlayerStopped && !!selectedCmd

    return (
      <div className="form-group fields-wrapper">
        <Form>
          <Form.Item
            label="Command"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="command"
              disabled={!isCmdEditable}
              value={selectedCmd && selectedCmd.command}
              onChange={value => this.onDetailChange('command', value)}
              filterOption={(input, { key }) =>
                key.toLowerCase().indexOf(input.toLowerCase()) === 0
              }
              style={{ width: '60%', marginRight: '5px' }}
            >
              {availableCommands.map(cmd => (
                <Select.Option value={cmd} key={cmd}>
                  {cmd}
                </Select.Option>
              ))}
            </Select>
            <span className="commandDoc">
              <Button
                type="primary"
                shape="circle"
                size="small"
                onClick={this.showModal}
              >
                {' '}
                ?{' '}
              </Button>
              <Modal
                title="ReplayUI Commands"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width={960}
              >
                <CommandDoc />
              </Modal>
            </span>
            {selectedCmd && selectedCmd.command === 'runBlock' ? (
              <Button.Group style={{ marginLeft: 10 }}>
                <Tooltip title="Go To Block" mouseEnterDelay={0.5}>
                  <Button
                    onClick={e => {
                      const blockName = selectedCmd.parameters.block
                      if (blockName) {
                        this.switchToBlockByName(blockName)
                        console.log(
                          'CommandOption: Switch to Block Name => ' + blockName
                        )
                      } else {
                        alert(
                          'No block name associated with this command. Select a block in the "block" parameter associated with this command.'
                        )
                        console.log(
                          'CommandOption: Block name not found. Aborting editor switch to block.'
                        )
                      }
                    }}
                    icon="right-square"
                    shape="circle"
                    style={{ marginRight: '5px' }}
                  />
                </Tooltip>
              </Button.Group>
            ) : (
              undefined
            )}
          </Form.Item>
          <CommandField />
        </Form>
      </div>
    )
  }
}

CommandOptions.propTypes = {
  updateSelectedCommand: PropTypes.func.isRequired,
  setEditorStatus: PropTypes.func.isRequired,
  editor: PropTypes.object.isRequired,
  editing: PropTypes.object.isRequired,
  setNextBlock: PropTypes.func,
  changeModalState: PropTypes.func,
  editBlock: PropTypes.func,
  player: PropTypes.object.isRequired
}

export default CommandOptions
