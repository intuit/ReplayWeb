import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Modal,
  Icon,
  Button,
  Alert,
  Tooltip
} from 'antd'

class NewProjectModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      projectPath: '',
      testPath: '',
      blockPath: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      projectPath: nextProps.projectPath,
      testPath: nextProps.testPath,
      blockPath: nextProps.blockPath,
      ...(nextProps.id ? { name: nextProps.name } : {})
    })
  }

  render () {
    const onConfirm = () => {
      if (this.props.id) {
        this.props.updateProject({ ...this.state, id: this.props.id })
      } else {
        this.props.createProject(this.state)
      }
      this.props.closeModal()
      this.props.clearProjectSetup()
      this.setState({ name: '' })
    }

    const onCancel = () => {
      if (!this.props.firstTime) {
        this.props.closeModal()
        this.props.clearProjectSetup()
        this.setState({ name: '' })
      }
    }

    return <Modal
      title={`${this.props.id ? 'Edit' : 'New'} Project`}
      width={400}
      visible={this.props.visible}
      onOk={onConfirm}
      okText={this.props.id ? 'Save' : 'Add'}
      okButtonProps={{
        disabled: this.state.testPath === '' ||
          this.state.blockPath === '' ||
          this.state.projectPath === '' ||
          this.state.name === ''
      }}
      onCancel={onCancel}
      cancelButtonProps={{
        disabled: this.props.firstTime
      }}
      closable={!this.props.firstTime}
    >
      <Form>
        <Form.Item label='Name'>
          <Input
            type='text'
            style={{ width: '345px' }}
            value={this.state.name}
            placeholder='Project Name'
            onChange={(e) => this.setState({ name: e.target.value })}
          />
        </Form.Item>
        <Form.Item label='Path'>
          <Input.Group compact>
            <Input
              enterButton={<Icon type='folder-open'/>}
              onSearch={this.props.browseProject}
              type='text'
              style={{ width: '300px' }}
              value={this.state.projectPath}
              placeholder='Project Path'
              onChange={(e) => this.setState({ projectPath: e.target.value })}
              onKeyDown={e => e.key === 'Enter' ? this.props.checkForExistingConfig(this.state.projectPath) : undefined}
              onBlur={() => this.props.checkForExistingConfig(this.state.projectPath)}
            />
            <Tooltip title='Browse for folder'>
              <Button type='primary' onClick={this.props.browseProject}><Icon type='folder-open'/></Button>
            </Tooltip>
          </Input.Group>
        </Form.Item>
        <Form.Item>
          {
            this.props.existingConfig === true
              ? <Alert
                message='Existing Configuration Found'
                description={<div>
                  <p>Test and Block paths have been imported from replay.config.json.</p>
                  {this.props.suites && Object.keys(this.props.suites).length > 0
                    ? <p>Found {Object.keys(this.props.suites).length} suites to import.</p> : undefined
                  }
                </div>}
                type='info'
              /> : undefined
          }
          {
            this.props.existingConfig === false
              ? <Alert
                message='Choose Test and Block folders'
                description={`These paths are relative to your project path: ${this.state.projectPath}`}
                type='info'
              /> : undefined
          }
        </Form.Item>
        {
          this.props.id || (this.props.projectPath && this.props.existingConfig !== null)
            ? <div>
              <Form.Item label='Test Folder'>
                <Input.Group compact>
                  <Input
                    disabled={this.props.existingConfig}
                    type='text'
                    style={{ width: '300px' }}
                    value={this.state.testPath}
                    placeholder='Test Path'
                    onChange={(e) => this.setState({ testPath: e.target.value })}
                    onBlur={e => this.state.testPath.indexOf('./') === -1 ? this.setState({ testPath: `./${this.state.testPath}` }) : undefined}
                  />
                  <Tooltip title='Browse for folder'>
                    <Button type='primary' onClick={this.props.browseTest}><Icon type='folder-open'/></Button>
                  </Tooltip>
                </Input.Group>
              </Form.Item>
              <Form.Item label='Block Folder'>
                <Input.Group compact>
                  <Input
                    disabled={this.props.existingConfig}
                    type='text'
                    style={{ width: '300px' }}
                    value={this.state.blockPath}
                    placeholder='Block Path'
                    onChange={(e) => this.setState({ blockPath: e.target.value })}
                    onBlur={e => this.state.blockPath.indexOf('./') === -1 ? this.setState({ blockPath: `./${this.state.blockPath}` }) : undefined}
                  />
                  <Tooltip title='Browse for folder'>
                    <Button type='primary' onClick={this.props.browseBlock}><Icon type='folder-open'/></Button>
                  </Tooltip>
                </Input.Group>
              </Form.Item>
            </div> : undefined
        }
      </Form>
    </Modal>
  }
}

NewProjectModal.propTypes = {
  updateProject: PropTypes.func.isRequired,
  createProject: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  clearProjectSetup: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  firstTime: PropTypes.bool.isRequired,
  checkForExistingConfig: PropTypes.func.isRequired,
  browseProject: PropTypes.func.isRequired,
  suites: PropTypes.object.isRequired,
  id: PropTypes.any.isRequired,
  projectPath: PropTypes.string.isRequired,
  browseTest: PropTypes.func.isRequired,
  existingConfig: PropTypes.bool.isRequired,
  browseBlock: PropTypes.func.isRequired
}

export default NewProjectModal
