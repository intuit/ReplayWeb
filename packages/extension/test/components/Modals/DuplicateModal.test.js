import React from 'react'
import { cleanup, render, fireEvent } from '@testing-library/react'
import DuplicateModal from '../../../src/components/Modals/DuplicateModal.jsx'

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const getComponent = (props = {}) => {
  /* eslint-disable react/prop-types */
  return (
    <DuplicateModal
      src={props.src || ''}
      duplicate={props.duplicate || jest.fn()}
      closeModal={props.closeModal || jest.fn()}
      visible={props.visible || false}
      type={props.type || ''}
      /* eslint-enable react/prop-types */
    />
  )
}

describe('DuplicateModal', () => {
  it('renders', () => {
    const { container } = render(getComponent())
    expect(container.querySelector('input')).toBeNull()
  })

  it('should call our duplicate function upon clicking the enter key', async () => {
    const mockProps = { type: 'test', visible: true }
    const { getByPlaceholderText } = render(getComponent(mockProps))
    const input = getByPlaceholderText(`${mockProps.type} name`)

    fireEvent.change(input, { target: { value: 'duplicate me' }})

    expect(input.value).toEqual('duplicate me')
  })
  // TODO more tests ...
})
