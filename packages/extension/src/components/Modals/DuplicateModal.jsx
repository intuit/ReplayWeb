import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Input, message } from 'antd'

class DuplicateModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      duplicateName: this.props.src ? `${this.props.src.name}_new` : ''
    }
    this.onChange = this.onChange.bind(this)
    this.onDuplicate = this.onDuplicate.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      duplicateName: nextProps.src ? `${nextProps.src.name}_new` : ''
    })
  }

  onChange(e) {
    this.setState({
      duplicateName: e.target.value
    })
  }

  onDuplicate() {
    this.props
      .duplicate(this.state.duplicateName)
      .then(() => {
        message.success('successfully duplicated!', 1.5)
        this.props.closeModal()
      })
      .catch(e => {
        message.error(e.message, 1.5)
      })
  }

  onCancel() {
    this.props.closeModal()
    this.setState({
      duplicateName: ''
    })
  }

  render() {
    return (
      <Modal
        title={`Duplicate ${this.props.type}`}
        okText="Save"
        cancelText="Cancel"
        visible={this.props.visible}
        onOk={this.onDuplicate}
        onCancel={this.onCancel}
        className="save-modal"
      >
        <Input
          style={{ width: '100%' }}
          onKeyDown={e => {
            if (e.keyCode === 13) this.onDuplicate()
          }}
          onChange={this.onChange}
          placeholder={`${this.props.type} name`}
          value={this.state.duplicateName}
        />
      </Modal>
    )
  }
}

DuplicateModal.propTypes = {
  src: PropTypes.object.isRequired,
  duplicate: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired
}

export default DuplicateModal
