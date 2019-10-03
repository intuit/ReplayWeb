import React from 'react'
import PropTypes from 'prop-types'
import { Input, Form } from 'antd'

class EnvironmentField extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      rawValue: ''
    }
  }

  getValue (obj) {
    return Object.keys(obj).map(k => `${k}=${obj[k]}`).join(',')
  }

  updateParameters (e) {
    this.setState(
      {rawValue: e.target.value},
      () => {
        if (this.state.rawValue.includes('=')) {
          const pairs = this.state.rawValue.split(',')
            .map(split => {
              if (split.indexOf('=') !== -1) {
                const pair = split.split('=')
                return {[pair[0]]: pair[1]}
              }
            })
          if (pairs.length === pairs.filter(i => i !== undefined).length) {
            this.props.updateSelectedCommand({
              parameters: Object.assign({}, ...pairs)
            }, true)
          }
        } else if (this.state.rawValue === '') {
          this.props.updateSelectedCommand({parameters: {}}, true)
        }
      }
    )
  }

  componentWillMount () {
    this.setState({rawValue: this.getValue(this.props.selectedCmd.parameters)})
  }

  render () {
    return (
      <Form>
        <Form.Item label='Environment' labelCol={{ span: 4 }} wrapperCol={{ span: 15 }} style={{ marginBottom: 4 }}>
          <Input
            disabled={!this.props.isCmdEditable}
            value={this.state.rawValue}
            onChange={this.updateParameters}
            style={{ width: '80%' }}
            placeholder="KEY1=VALUE,KEY2=VALUE..."
          />
        </Form.Item>
      </Form>
    )
  }
}

EnvironmentField.propTypes = {
  updateSelectedCommand: PropTypes.func.isRequired,
  selectedCmd: PropTypes.object.isRequired,
  isCmdEditable: PropTypes.bool.isRequired
}

export default EnvironmentField
