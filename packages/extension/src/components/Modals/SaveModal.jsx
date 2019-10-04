import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Input, message } from 'antd'
import * as C from '../../common/constant'

export default function SaveModal(props) {
  switch (props.editorStatus) {
    case C.EDITOR_STATUS.TESTS:
      return <SaveTestCaseModal {...props} />
    case C.EDITOR_STATUS.BLOCKS:
      return <SaveBlockModal {...props} />
    case C.EDITOR_STATUS.SUITES:
      return <SaveSuiteModal {...props} />
  }
}

SaveModal.propTypes = {
  editorStatus: PropTypes.string.isRequired
}

export function SaveBlockModal(props) {
  const onSave = saveAsName => {
    return (props.src
      ? props.saveEditingBlockAsExisted()
      : props.saveEditingBlockAsNew(saveAsName)
    )
      .then(() => onDiscard())
      .catch(e => message.error(e.message, 1.5))
  }

  const onDiscard = (savedAs = false) => {
    props.editNext()
    props.selectProject(props.project)
    onCancel()
  }

  const onCancel = () => {
    props.clearNext()
    props.closeModal()
  }

  return (
    <GenericSaveModal
      onSave={onSave}
      onDiscard={onDiscard}
      onCancel={onCancel}
      hasFileName={!props.newSave}
      title={!props.newSave ? 'Unsaved Changes' : 'Save New Block'}
      unsavedChangesText={'You have unsaved changes to the current block.'}
      visible={props.visible}
    />
  )
}

SaveBlockModal.propTypes = {
  src: PropTypes.any,
  saveEditingBlockAsExisted: PropTypes.func.isRequired,
  saveEditingBlockAsNew: PropTypes.func.isRequired,
  editNext: PropTypes.func.isRequired,
  selectProject: PropTypes.func.isRequired,
  project: PropTypes.any.isRequired,
  clearNext: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  newSave: PropTypes.bool,
  visible: PropTypes.func.isRequired
}

export function SaveMultiSelectModal(props) {
  const onSave = saveAsName => {
    return props
      .saveMultiSelectAsNewBlock(saveAsName)
      .then(() => onCancel())
      .catch(e => message.error(e.message, 1.5))
  }

  const onCancel = () => {
    props.closeModal()
  }

  return (
    <GenericSaveModal
      onSave={onSave}
      onCancel={onCancel}
      hasFileName={false}
      title="Save as a new block"
      visible={props.visible}
    />
  )
}

SaveMultiSelectModal.propTypes = {
  saveMultiSelectAsNewBlock: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired
}

export function SaveTestCaseModal(props) {
  const onSave = saveAsName => {
    return (props.src
      ? props.saveEditingAsExisted()
      : props.saveEditingAsNew(saveAsName)
    )
      .then(() => onDiscard())
      .catch(e => message.error(e.message, 1.5))
  }

  const onDiscard = (savedAs = false) => {
    props.editNext()
    props.selectProject(props.project)
    onCancel()
  }

  const onCancel = () => {
    props.clearNext()
    props.closeModal()
  }

  return (
    <GenericSaveModal
      onSave={onSave}
      onDiscard={onDiscard}
      onCancel={onCancel}
      hasFileName={!props.newSave}
      title={!props.newSave ? 'Unsaved Changes' : 'Save New Testcase'}
      unsavedChangesText={'You have unsaved changes to the current test case.'}
      visible={props.visible}
    />
  )
}

SaveTestCaseModal.propTypes = {
  src: PropTypes.any,
  saveEditingAsExisted: PropTypes.func.isRequired,
  saveEditingAsNew: PropTypes.func.isRequired,
  editNext: PropTypes.func.isRequired,
  selectProject: PropTypes.func.isRequired,
  project: PropTypes.any.isRequired,
  clearNext: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  newSave: PropTypes.bool,
  visible: PropTypes.any.isRequired
}

export function SaveSuiteModal(props) {
  const onSave = saveAsName => {
    return (props.src
      ? props.saveEditingSuiteAsExisted()
      : props.saveEditingSuiteAsNew(saveAsName)
    )
      .then(() => onDiscard())
      .catch(e => message.error(e.message, 1.5))
  }

  const onDiscard = (savedAs = false) => {
    props.editNext()
    props.selectProject(props.project)
    onCancel()
  }

  const onCancel = () => {
    props.clearNext()
    props.closeModal()
  }

  return (
    <GenericSaveModal
      onSave={onSave}
      onDiscard={onDiscard}
      onCancel={onCancel}
      hasFileName={!props.newSave}
      title={!props.newSave ? 'Unsaved Changes' : 'Save New Suite'}
      unsavedChangesText={'You have unsaved changes to the current suite.'}
      visible={props.visible}
    />
  )
}

SaveSuiteModal.propTypes = {
  src: PropTypes.any,
  saveEditingSuiteAsExisted: PropTypes.func.isRequired,
  saveEditingSuiteAsNew: PropTypes.func.isRequired,
  editNext: PropTypes.func.isRequired,
  selectProject: PropTypes.func.isRequired,
  project: PropTypes.any.isRequired,
  clearNext: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  newSave: PropTypes.bool,
  visible: PropTypes.bool.isRequired
}

class GenericSaveModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      saveAsName: ''
    }
  }

  onChange(e) {
    this.setState({
      saveAsName: e.target.value
    })
  }

  render() {
    const footerButtons = (
      <div>
        <Button onClick={this.props.onCancel}>Cancel</Button>
        {this.props.onDiscard ? (
          <Button type="danger" onClick={this.props.onDiscard}>
            Discard
          </Button>
        ) : (
          undefined
        )}
        <Button
          type="primary"
          onClick={() => this.props.onSave(this.state.saveAsName)}
        >
          {this.props.hasFileName ? 'Save and continue' : 'Save'}
        </Button>
      </div>
    )
    return (
      <Modal
        title={this.props.title}
        footer={footerButtons}
        visible={this.props.visible}
        className="save-modal"
        onCancel={this.props.onCancel}
      >
        {this.props.hasFileName ? (
          <p>{this.props.unsavedChangesText}</p>
        ) : (
          <Input
            style={{ width: '100%' }}
            onChange={this.onChange}
            placeholder="enter name"
          />
        )}
      </Modal>
    )
  }
}

GenericSaveModal.propTypes = {
  onDiscard: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  hasFileName: PropTypes.bool,
  unsavedChangesText: PropTypes.string.isRequired
}
