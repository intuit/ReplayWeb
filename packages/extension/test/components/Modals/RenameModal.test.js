import React from 'react'
import { cleanup, render, fireEvent, act } from '@testing-library/react'
import RenameModal from '../../../src/components/Modals/RenameModal.jsx'
import * as C from '../../../src/common/constant'
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
    <RenameModal
      renameTestCase={props.renameTestCase || jest.fn()}
      renameBlock={props.renameBlock || jest.fn()}
      renameSuite={props.renameSuite || jest.fn()}
      closeModal={props.closeModal || jest.fn()}
      editorStatus={props.editorStatus || ''}
      visible={props.visible || true}
      /* eslint-enable react/prop-types */
    />
  )
}

describe('RenameModal', () => {
  it('renders', () => {
    const { getByText } = render(getComponent())
    getByText('Rename the test case as..')
    getByText('Cancel')
    getByText('Save')
  })

  it('should change rename on input change', () => {
    const { getByPlaceholderText } = render(getComponent())
    const input = getByPlaceholderText('test case name')
    fireEvent.change(input, { target: { value: 'new name' }})
    expect(input.value).toEqual('new name')
  })

  it('should rename test case on modal OK', async () => {
    const mockProps = {
      editorStatus: C.EDITOR_STATUS.TESTS,
      renameTestCase: jest.fn().mockResolvedValue(),
      closeModal: jest.fn()
    }
    const { getByText } = render(getComponent(mockProps))
    const modalOk = getByText('Save')
    await act(async () => {
      fireEvent.click(modalOk)
    })
    expect(mockProps.renameTestCase).toHaveBeenCalled()
    expect(mockProps.closeModal).toHaveBeenCalled()
  })

  it('should rename block on modal OK', async () => {
    const mockProps = {
      editorStatus: C.EDITOR_STATUS.BLOCKS,
      renameBlock: jest.fn().mockResolvedValue(),
      closeModal: jest.fn()
    }
    const { getByText } = render(getComponent(mockProps))
    const modalOk = getByText('Save')
    await act(async () => {
      fireEvent.click(modalOk)
    })
    expect(mockProps.renameBlock).toHaveBeenCalled()
    expect(mockProps.closeModal).toHaveBeenCalled()
  })

  it('should rename suites on modal OK', async () => {
    const mockProps = {
      editorStatus: C.EDITOR_STATUS.SUITES,
      renameSuite: jest.fn().mockResolvedValue(),
      closeModal: jest.fn()
    }
    const { getByText } = render(getComponent(mockProps))
    const modalOk = getByText('Save')
    await act(async () => {
      fireEvent.click(modalOk)
    })
    expect(mockProps.renameSuite).toHaveBeenCalled()
    expect(mockProps.closeModal).toHaveBeenCalled()
  })

  it('should catch error on modal OK', async () => {
    const errorMessage = 'error msg'
    const mockProps = {
      editorStatus: C.EDITOR_STATUS.SUITES,
      renameSuite: jest.fn().mockRejectedValue({message: errorMessage}),
      closeModal: jest.fn()
    }
    const { getByText } = render(getComponent(mockProps))
    const modalOk = getByText('Save')
    await act(async () => {
      fireEvent.click(modalOk)
    })
    expect(message.error).toHaveBeenCalledWith(errorMessage, 1.5)
  })
  
  it('should call onCancel on modal cancel', async () => {
    const mockProps = {
      closeModal: jest.fn()
    }
    const { getByPlaceholderText, getByText } = render(getComponent(mockProps))
    const input = getByPlaceholderText('test case name')
    const modalCancel = getByText('Cancel')
    await act(async () => {
      fireEvent.click(modalCancel)
    })
    expect(mockProps.closeModal).toHaveBeenCalled()
    expect(input.value).toEqual('')
  })
})
