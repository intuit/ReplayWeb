import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import EnvironmentField from '../../../../src/components/dashboard/fields/EnvironmentField.jsx'

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const getComponent = (props = {}) => (
  <EnvironmentField 
    updateSelectedCommand={props.updateSelectedCommand || jest.fn()}
    selectedCmd={props.selectedCmd || { parameters: {}}}
    isCmdEditable={props.isCmdEditable || false}
  />
)

describe('EnvironmentField', () => {
  it('renders', () => {
    const { container, getByText } = render(getComponent())
    expect(getByText('Environment')).not.toBeNull()
    expect(container.querySelector('input')).not.toBeNull()
  })

  it('sets input value', () => {
    const selectedCmd = {
      parameters: {
        key1: 'param1'
      }
    }
    const { container } = render(getComponent({selectedCmd}))
    expect(container.querySelector('input').value).toEqual('key1=param1')
  })

  it('sets multiple input values', () => {
    const selectedCmd = {
      parameters: {
        key1: 'param1',
        key2: 'param2',
        key3: 'param3'
      }
    }
    const { container } = render(getComponent({selectedCmd}))
    const expectedOutput = 'key1=param1,key2=param2,key3=param3'
    expect(container.querySelector('input').value).toEqual(expectedOutput)
  })

  it('is editable', () => {
    const { container } = render(getComponent({ isCmdEditable: true }))
    expect(container.querySelector('input').disabled).toEqual(false)
  })

  it('handle input change', () => {
    const { getByPlaceholderText } = render(getComponent({ isCmdEditable: true }))
    const input = getByPlaceholderText('KEY1=VALUE,KEY2=VALUE...')
    fireEvent.change(input, { target: { value: 'key1=param1' } })
    expect(input.value).toEqual('key1=param1')
  })

  // TODO more tests ...
})
