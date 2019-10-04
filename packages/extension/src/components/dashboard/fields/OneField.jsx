import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Checkbox, Select } from 'antd'
import { commandsMap } from '../../../common/commands'
import CommandButtons from './CommandButtons'

const OneField = props => {
  const params =
    props.selectedCmd &&
    commandsMap[props.selectedCmd.command] &&
    commandsMap[props.selectedCmd.command].parameters
  const updateParameter = (name, value) =>
    props.updateSelectedCommand({ parameters: { [name]: value } })
  return (
    <Form>
      {params &&
        params.map(param => {
          const value =
            props.selectedCmd &&
            props.selectedCmd.parameters &&
            props.selectedCmd.parameters[param.name]
          switch (param.type) {
            case 'object':
              return (
                <Form.Item
                  key={param.name}
                  label={param.name}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 14 }}
                  style={{ marginBottom: 0 }}
                >
                  This parameter needs to be configured manually in the JSON.
                </Form.Item>
              )
            case 'checkbox':
              return (
                <Form.Item
                  key={param.name}
                  label={param.name}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 10 }}
                  style={{ marginBottom: 0 }}
                  extra={param.extra}
                >
                  <Checkbox
                    checked={value}
                    disabled={!props.isCmdEditable}
                    onChange={e =>
                      updateParameter(param.name, e.target.checked)
                    }
                    style={{ width: '80%' }}
                    placeholder={param.name}
                  />
                </Form.Item>
              )
            case 'select':
              return (
                <Form.Item
                  key={param.name}
                  label={param.name}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 14 }}
                  style={{ marginBottom: 6 }}
                  extra={param.extra}
                >
                  <Select
                    disabled={
                      !props.isCmdEditable &&
                      (!props[param.data] || props[param.data].length === 0)
                    }
                    showSearch
                    placeholder={param.name}
                    onChange={value => updateParameter(param.name, value)}
                    value={value}
                  >
                    {props[param.data] &&
                      props[param.data].map(({ name }) => (
                        <Select.Option key={name} value={name}>
                          {name}
                        </Select.Option>
                      ))}
                    {param.data &&
                      typeof param.data === 'object' &&
                      param.data.map(el => (
                        <Select.Option key={el} value={el}>
                          {el}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              )
            default:
              return (
                <Form.Item
                  key={param.name}
                  label={param.name}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  style={{ marginBottom: 0 }}
                  extra={param.extra}
                >
                  <Input
                    value={value}
                    disabled={!props.isCmdEditable}
                    onChange={e => updateParameter(param.name, e.target.value)}
                    style={{ width: '60%', marginRight: '10px' }}
                    placeholder={param.name}
                  />
                  <CommandButtons
                    name={param.name}
                    canTarget={param.canTarget}
                    updateParameter={updateParameter.bind(null, param.name)}
                    value={value}
                    command={props.selectedCmd.command}
                    {...props}
                  />
                </Form.Item>
              )
          }
        })}
    </Form>
  )
}

OneField.propTypes = {
  updateSelectedCommand: PropTypes.func,
  isCmdEditable: PropTypes.bool,
  selectedCmd: PropTypes.object
}

export default OneField
