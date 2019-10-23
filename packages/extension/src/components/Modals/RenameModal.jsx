import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Input, message } from 'antd'
import * as C from '../../common/constant'

class RenameModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rename: ''
    }
    this.onChange = this.onChange.bind(this)
    this.onRename = this.onRename.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      rename: nextProps.src ? nextProps.src.name : ''
    })
  }

  onChange(e) {
    this.setState({
      rename: e.target.value
    })
  }

  onRename() {
    const successFn = () => {
      message.success('successfully renamed!', 1.5)
      this.props.closeModal()
    }
    switch (this.props.editorStatus) {
      case C.EDITOR_STATUS.TESTS:
        this.props
          .renameTestCase(this.state.rename)
          .then(successFn)
          .catch(e => message.error(e.message, 1.5))
        break
      case C.EDITOR_STATUS.BLOCKS:
        this.props
          .renameBlock(this.state.rename)
          .then(successFn)
          .catch(e => message.error(e.message, 1.5))
        break
      case C.EDITOR_STATUS.SUITES:
        this.props
          .renameSuite(this.state.rename)
          .then(successFn)
          .catch(e => message.error(e.message, 1.5))
        break
    }
  }

  onCancel() {
    this.props.closeModal()
    this.setState({
      rename: ''
    })
  }

  render() {
    const type =
      this.props.editorStatus === C.EDITOR_STATUS.SUITES
        ? 'suite'
        : this.props.editorStatus === C.EDITOR_STATUS.BLOCKS
        ? 'block'
        : 'test case'
    const title = `Rename the ${type} as..`
    const placeholder = `${type} name`
    return (
      <Modal
        title={title}
        okText="Save"
        cancelText="Cancel"
        visible={this.props.visible}
        onOk={this.onRename}
        onCancel={this.onCancel}
        className="save-modal"
      >
        <Input
          style={{ width: '100%' }}
          onKeyDown={e => {
            if (e.keyCode === 13) this.onRename()
          }}
          onChange={this.onChange}
          placeholder={placeholder}
          value={this.state.rename}
        />
      </Modal>
    )
  }
}

RenameModal.propTypes = {
  renameTestCase: PropTypes.func.isRequired,
  renameBlock: PropTypes.func.isRequired,
  renameSuite: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  editorStatus: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired
}

export default RenameModal
