import React from 'react'
import { cleanup, render } from '@testing-library/react'
import RenameModal from '../../../src/components/Modals/RenameModal.jsx'

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

  // TODO more tests ...
})
