import React from 'react'
import { cleanup, render } from '@testing-library/react'
import OneField from '../../../../src/components/dashboard/fields/OneField.jsx'

jest.mock('../../../../src/components/dashboard/fields/CommandButtons', () => {
  // eslint-disable-next-line react/display-name
  return function() {
    return <p>CommandButtons</p>
  }
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks()
});

const getComponent = (props = {}) => (
  <OneField
  updateSelectedCommand={props.updateSelectedCommand || jest.fn()}
  isCmdEditable={props.isCmdEditable || false}
  selectedCmd={props.selectedCmd || { parameters: {}}}
  />
);

describe('OneField', () => {
  it('renders', () => {
    const { queryByText } = render(<OneField />)
    expect(
      queryByText('This parameter needs to be configured manually in the JSON.')
    ).toBeNull()
  });

  it('renders an object', () => {
    const { getByText, debug } = render(
    <OneField
    isCmdEditable={true}
    selectedCmd={{
      command: 'assertJsonInContext',
          parameters: {}
    }}
    />
  )
    // console.log(debug())
    getByText('This parameter needs to be configured manually in the JSON.')
  });

  it('text input renders', () => {
    const {container, debug} = render(getComponent({ isCmdEditable: true,
      selectedCmd:{
        command: 'assertJsonInContext',
            parameters: {}
    }
      }));
    expect(container.querySelector('input').disabled).toEqual(false)
  });

  it('checkbox renders', () => {
    const {container, debug} = render(
        getComponent({isCmdEditable: true,
      selectedCmd: {
        command: 'assertCheckboxState',
        parameters: {
          name: 'expected',
          type: 'checkbox',
          optional: true,
          description: 'Whether the given checkbox should be checked or not',
          example: false}}}))

    const checkbox = container.querySelectorAll('input')[1];
    expect(checkbox.disabled).toEqual(false);
    expect(checkbox.className).toEqual('ant-checkbox-input');
    expect(checkbox.checked).toEqual(false);
    expect(checkbox.value).toEqual('');
  });

  it('select renders', () => {
    const {container, debug} = render(
        getComponent({isCmdEditable: true,
          selectedCmd: {
            command: 'runBlock',
            parameters: {
              }}}))
    console.log(debug())
    const checkbox = container.querySelector('input');
    expect(checkbox.disabled).toEqual(false);
    expect(checkbox.className).toEqual('ant-select-search__field')
    expect(checkbox.value).toEqual('');
  })
  // TODO more tests ...

})
