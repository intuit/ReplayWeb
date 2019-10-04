import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Checkbox, Select, Input, Tag, message } from 'antd'
import { removeArrayItem } from '../../common/utils'

const displayConfig = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

const SettingModal = props => {
  const {
    ignorePatterns = [],
    sidebarWidth,
    playScrollElementsIntoView,
    playHighlightElements,
    playCommandInterval,
    timeoutElement,
    timeoutPageLoad,
    recordNotification,
    filesystemInterval,
    useDtmSelector
  } = props.config

  const [ignoreInput, setIgnoreInput] = useState('')

  const onConfigChange = (key, val) => {
    props.updateConfig({ [key]: val })
  }

  const addIgnore = pattern => {
    if (!props.config.ignorePatterns.includes(pattern)) {
      setIgnoreInput('')
      onConfigChange('ignorePatterns', [
        ...props.config.ignorePatterns,
        pattern
      ])
    } else {
      message.warning('Pattern Already Exists', 2)
    }
  }

  return (
    <Modal
      title="Replay Settings"
      width={600}
      footer={null}
      visible={props.visible}
      onCancel={props.onCancel}
    >
      <Form>
        <Form.Item label="Sidebar width" {...displayConfig}>
          <Input
            type="number"
            min="0"
            style={{ width: '200px' }}
            value={sidebarWidth}
            onChange={e => onConfigChange('sidebarWidth', e.target.value)}
            placeholder="pixels"
          />
        </Form.Item>
        <Form.Item label="Replay Helper" {...displayConfig}>
          <Checkbox
            onChange={e =>
              onConfigChange('playScrollElementsIntoView', e.target.checked)
            }
            checked={playScrollElementsIntoView}
          >
            Scroll elements into view during replay
          </Checkbox>

          <Checkbox
            onChange={e =>
              onConfigChange('playHighlightElements', e.target.checked)
            }
            checked={playHighlightElements}
          >
            Highlight elements during replay
          </Checkbox>
        </Form.Item>

        <Form.Item label="Command Interval" {...displayConfig}>
          <Select
            style={{ width: '200px' }}
            placeholder="interval"
            value={playCommandInterval}
            onChange={val => onConfigChange('playCommandInterval', val)}
          >
            <Select.Option value={0}>Fast (no delay)</Select.Option>
            <Select.Option value={0.3}>Medium (0.3s delay)</Select.Option>
            <Select.Option value={2}>Slow (2s delay)</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="!TIMEOUT_PAGELOAD" {...displayConfig}>
          <Input
            type="number"
            min="0"
            style={{ width: '200px' }}
            value={timeoutPageLoad}
            onChange={e => onConfigChange('timeoutPageLoad', e.target.value)}
            placeholder="in seconds"
          />
        </Form.Item>

        <Form.Item label="!TIMEOUT_WAIT" {...displayConfig}>
          <Input
            type="number"
            min="0"
            style={{ width: '200px' }}
            value={timeoutElement}
            onChange={e => onConfigChange('timeoutElement', e.target.value)}
            placeholder="in seconds"
          />
        </Form.Item>

        <Form.Item label="Record Settings" {...displayConfig}>
          <Checkbox
            onChange={e =>
              onConfigChange('recordNotification', e.target.checked)
            }
            checked={recordNotification}
          >
            Record notifications
          </Checkbox>
        </Form.Item>
        <Form.Item label="Filesystem Scan Interval" {...displayConfig}>
          <Input
            type="number"
            min="0"
            style={{ width: '200px' }}
            value={filesystemInterval}
            onChange={e => onConfigChange('filesystemInterval', e.target.value)}
            placeholder="15000"
          />
        </Form.Item>
        <Form.Item label="Use css selector" {...displayConfig}>
          <Checkbox
            onChange={e => onConfigChange('useDtmSelector', e.target.checked)}
            checked={useDtmSelector}
          >
            CSS selector
          </Checkbox>
        </Form.Item>
        <Form.Item label="Selector Ignore Patterns" {...displayConfig}>
          {ignorePatterns.map(p => (
            <Tag
              key={p}
              closable
              onClose={() =>
                onConfigChange(
                  'ignorePatterns',
                  removeArrayItem(ignorePatterns, p)
                )
              }
            >
              {p}
            </Tag>
          ))}
        </Form.Item>
        <Form.Item label="Add Regex to ignore" {...displayConfig}>
          <Input
            addonAfter="/"
            addonBefore="/"
            type="text"
            style={{ width: '200px' }}
            value={ignoreInput}
            onChange={e => setIgnoreInput(e.target.value)}
            onPressEnter={e => addIgnore(e.target.value)}
            placeholder=".*uniqName.*"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

SettingModal.propTypes = {
  updateConfig: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default SettingModal
