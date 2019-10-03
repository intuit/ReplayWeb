import React from 'react'
import { cleanup, render } from '@testing-library/react'
import OneField from '../../../../src/components/dashboard/fields/OneField.jsx'

jest.mock('../../../../src/components/dashboard/fields/CommandButtons', () => {
  // eslint-disable-next-line react/display-name
  return function () {
    return (
      <p>CommandButtons</p>
    )
  }
})

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

describe('OneField', () => {
  it('renders', () => {
    const { queryByText } = render(<OneField />)
    expect(queryByText('This parameter needs to be configured manually in the JSON.')).toBeNull()
  })

  // TODO more tests ...
})
