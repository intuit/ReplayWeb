import React from 'react'
import { cleanup, render, fireEvent, act } from '@testing-library/react'
import DuplicateModal from '../../../src/components/Modals/DuplicateModal.jsx'
import { message } from 'antd'

jest.mock('antd', () => {
  return {
    ...(jest.requireActual('antd')),
    message: {
      success: jest.fn(),
      error: jest.fn()
    }
  }
})

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

  describe('onDuplicate', () => {
    let mockProps

    beforeEach(() => {
      mockProps = {
        src: 'test',
        visible: true,
        duplicate: jest.fn().mockResolvedValue({}),
        closeModal: jest.fn()
      }
    })

    const renderModalAndClose = (props) => {
      const {getByText} = render(getComponent(props))
      const modalOk = getByText("Save")

      return act(async () => {
        fireEvent.click(modalOk)
      })
    }

    it('should close the modal on success', async () => {
      await renderModalAndClose(mockProps)

      expect(mockProps.duplicate).toHaveBeenCalled()
      expect(message.success).toHaveBeenCalledWith('successfully duplicated!', 1.5)
      expect(mockProps.closeModal).toHaveBeenCalled()
    })

    it('should log error message on failure', async () => {
      const errorMessage = 'error error'
      mockProps.duplicate = jest.fn().mockRejectedValue({message: errorMessage})

      await renderModalAndClose(mockProps)

      expect(mockProps.duplicate).toHaveBeenCalled()
      expect(message.error).toHaveBeenCalledWith(errorMessage, 1.5)
    })
  })

  // TODO more tests ...
})
