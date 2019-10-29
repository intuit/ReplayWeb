import React from 'react'
import { cleanup, render, fireEvent } from '@testing-library/react'
import CommandButtons from '../../../../src/components/dashboard/fields/CommandButtons.jsx'
import ipc from '../../../../src/common/ipc/ipc_cs'

jest.mock('../../../../src/common/ipc/ipc_bg_cs', () => ({
  csInit: () => ({
    ask: jest.fn().mockReturnValue(Promise.resolve())
  })
}))

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const getComponent = (props = {}) => {
  /* eslint-disable react/prop-types */
  return (
    <CommandButtons
      stopInspecting={props.stopInspecting || jest.fn()}
      setInspectTarget={props.setInspectTarget || jest.fn()}
      startInspecting={props.startInspecting || jest.fn()}
      isInspecting={props.isInspecting || false}
      inspectTarget={props.inspectTarget || ''}
      name={props.name || ''}
      canTarget={props.canTarget || false}
      isCmdEditable={props.isCmdEditable || false}
      command={props.command || ''}
      value={props.value || ''}
      updateParameter={props.updateParameter || jest.fn()}
    />
  )
  /* eslint-enable react/prop-types */
}

describe('CommandButtons', () => {
  it('renders', () => {
    const { container } = render(getComponent())
    expect(container.querySelector('.ant-btn-group')).not.toBeNull()
  })

  it('test onClickFindButton is not undefined and clickable', () => {
    const { queryByTestId } = render(getComponent({
      canTarget: true,
      isCmdEditable: true
    }))
    const button = queryByTestId('onClickFindButton')
    expect(button).not.toBeUndefined()
    fireEvent.click(button)
    expect(ipc.ask).toHaveBeenCalledTimes(1)
    expect(ipc.ask).toHaveBeenCalledWith("PANEL_HIGHLIGHT_DOM", {"lastOperation": null, "locator": ""})
  })

  it('test toggleInspectButton inspecting true', () => {
    const mockSetInspectingTarget = jest.fn()
    const mockStopInspecting = jest.fn()
    const { queryByTestId } = render(getComponent({
      canTarget: true,
      isInspecting: true,
      setInspectTarget: mockSetInspectingTarget,
      stopInspecting: mockStopInspecting,
      isCmdEditable: true
    }))
    const toggleButton = queryByTestId('toggleIns)pectButton')
    fireEvent.click(toggleButton)
    expect(mockSetInspectingTarget).toHaveBeenCalledTimes(1)
    expect(mockStopInspecting).toHaveBeenCalledTimes(1)
  })

  it('test toggleInspectButton inspecting false', () => {
    const mockSetInspectingTarget = jest.fn()
    const mockStartInspecting = jest.fn()
    const { queryByTestId } = render(getComponent({
      canTarget: true,
      setInspectTarget: mockSetInspectingTarget,
      startInspecting: mockStartInspecting,
      isCmdEditable: true
    }))
    const toggleButton = queryByTestId('toggleInspectButton')
    fireEvent.click(toggleButton)
    expect(mockSetInspectingTarget).toHaveBeenCalledTimes(1)
    expect(mockStartInspecting).toHaveBeenCalledTimes(1)
  })
})
