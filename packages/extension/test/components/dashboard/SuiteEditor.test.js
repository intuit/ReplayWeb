import React from 'react'
import { cleanup, render } from '@testing-library/react'
import SuiteEditor from '../../../src/components/dashboard/SuiteEditor.jsx'

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const getComponent = (props = {}) => {
  /* eslint-disable react/prop-types */
  return (
    <SuiteEditor
      tests={props.tests || []}
      selectedTests={props.selectedTests || []}
      addTestToSuite={props.addTestToSuite || jest.fn()}
      name={props.name || ''}
      removeTestFromSuite={props.removeTestFromSuite || jest.fn()}
      /* eslint-enable react/prop-types */
    />
  )
}

describe('SuiteEditor', () => {
  it('renders', () => {
    const { getByText, getAllByText } = render(getComponent())
    getByText('All Tests')
    getByText('Tests in suite:')
    expect(getAllByText('No data').length).toBe(2)
  })

  // TODO more tests ...
})
