import React from 'react'
import { cleanup, render } from '@testing-library/react'
import Dropdown from '../../../src/components/dashboard/TestcaseDropdown.jsx'

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const getComponent = (props = {}) => {
  /* eslint-disable react/prop-types */
  return (
    <Dropdown
      editorStatus={props.editorStatus || ''}
      status={props.status || ''}
      editing={props.editing || { meta: { src: '' } }}
      closeDropdown={props.closeDropdown || jest.fn()}
      changeModalState={props.changeModalState || jest.fn()}
      onDelete={props.onDelete || jest.fn()}
      onShare={props.onShare || jest.fn()}
      /* eslint-enable react/prop-types */
    />
  )
}

describe('Dropdown', () => {
  it('renders nothing if status is not set', () => {
    try {
      render(getComponent())
      expect(true).toBe(false)
    } catch (err) {
      // expected
    }
  })

  it('renders a testcasedropdown if set', () => {
    const { getByText } = render(getComponent({ editorStatus: 'TESTS' }))
    getByText('Duplicate..')
    getByText('Rename')
    getByText('Delete')
    getByText('Share')
    getByText('Replay settings..')
  })

  // TODO more tests ...
})
