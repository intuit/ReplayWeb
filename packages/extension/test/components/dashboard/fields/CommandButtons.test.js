import React from 'react'
import { cleanup, render } from '@testing-library/react'
import CommandButtons from '../../../../src/components/dashboard/fields/CommandButtons.jsx'

jest.mock('../../../../src/common/ipc/ipc_cs', () => {})

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

  // TODO more tests ...
})
