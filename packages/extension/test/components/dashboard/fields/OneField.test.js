import React from 'react'
import { cleanup, render } from '@testing-library/react'
import { mount } from 'enzyme'
import OneField from '../../../../src/components/dashboard/fields/OneField.jsx'

jest.mock('../../../../src/components/dashboard/fields/CommandButtons', () => {
  // eslint-disable-next-line react/display-name
  return function() {
    return <p>CommandButtons</p>
  }
})

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const getComponent = (props = {}) => (
  <OneField
    updateSelectedCommand={props.updateSelectedCommand || jest.fn()}
    isCmdEditable={props.isCmdEditable || false}
    selectedCmd={props.selectedCmd || { parameters: {}}}
    blocks={props.blocks || null}
  />
)

describe('OneField', () => {
  it('renders', () => {
    const { queryByText } = render(<OneField />)
    expect(
      queryByText('This parameter needs to be configured manually in the JSON.')
    ).toBeNull()
  })

  it('renders an object', () => {
    const { getByText } = render(
    <OneField
    isCmdEditable={true}
    selectedCmd={{
      command: 'assertJsonInContext',
          parameters: {}
    }}
    />
  )
    getByText('This parameter needs to be configured manually in the JSON.')
  })

  it('text input renders', () => {
    const { container } = render(getComponent({ isCmdEditable: true,
      selectedCmd:{
        command: 'assertJsonInContext',
            parameters: {}
    }
      }))
    expect(container.querySelector('input').disabled).toEqual(false)
  })

  it('text input onChange', () => {
    const mockUpdateSelectedCommand = jest.fn()
    const props = {
      isCmdEditable: true,
      updateSelectedCommand: mockUpdateSelectedCommand,
      selectedCmd: {
        command: 'assertJsonInContext'
      }
    }
    const wrapper = mount(getComponent(props))
    const input = wrapper.find('input')
    input.simulate('change', {target: {value: "test"}})
    expect(mockUpdateSelectedCommand.mock.calls.length).toBe(1)
  })
  

  it('checkbox renders', () => {
    const { container } = render(
        getComponent({isCmdEditable: true,
      selectedCmd: {
        command: 'assertCheckboxState',
        parameters: {
          name: 'expected',
          type: 'checkbox',
          optional: true,
          description: 'Whether the given checkbox should be checked or not',
          example: false}}}))

    const checkbox = container.querySelectorAll('input')[1]
    expect(checkbox.disabled).toEqual(false)
    expect(checkbox.className).toEqual('ant-checkbox-input')
    expect(checkbox.checked).toEqual(false)
    expect(checkbox.value).toEqual('')
  })

  it('checkbox onChange', () => {
    const mockUpdateSelectedCommand = jest.fn()
    const props = {
      isCmdEditable: true,
      updateSelectedCommand: mockUpdateSelectedCommand,
      selectedCmd: {
        command: 'assertCheckboxState'
      }
    }
    const wrapper = mount(getComponent(props))
    const checkbox = wrapper.find('.ant-checkbox-input')
    checkbox.simulate('change', {target: {checked: false}})
    expect(mockUpdateSelectedCommand.mock.calls.length).toBe(1)
  })

  it('checkbox disabled', () => {
    const props = {
      isCmdEditable: false,
      selectedCmd: {
        command: 'assertCheckboxState'
      }
    }
    const wrapper = mount(getComponent(props))
    expect(wrapper.find('input').at(1).props().disabled).toBe(true)
  })

  it('select renders', () => {
    const { container } = render(
        getComponent({isCmdEditable: true,
          blocks: [{name: "Block1"}, {name: "Block2"}, {name: "Block3"}],
          selectedCmd: {
            command: 'runBlock',
            parameters: {
              }}}))
    const checkbox = container.querySelector('input')
    expect(checkbox.disabled).toEqual(false)
    expect(checkbox.className).toEqual('ant-select-search__field')
    expect(checkbox.value).toEqual('')
  })

  it('select disabled', () => {
    const props = {
      isCmdEditable: false,
      selectedCmd: {
        command: 'http'
      }
    }
    const wrapper = mount(getComponent(props))
    expect(wrapper.find('Select').at(0).props().disabled).toBe(true)
  })

  it('select onChange', () => {
    const mockUpdateSelectedCommand = jest.fn()
    const props = {
      isCmdEditable: true,
      selectedCmd: {
        command: 'http'
      },
      updateSelectedCommand: mockUpdateSelectedCommand
    }
    const wrapper = mount(getComponent(props))
    wrapper.find('Select').at(0).prop('onChange')('PUT')
    expect(mockUpdateSelectedCommand.mock.calls.length).toBe(1)
  })

  // TODO more tests ...

})
