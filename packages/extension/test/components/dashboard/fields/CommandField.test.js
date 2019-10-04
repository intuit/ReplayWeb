import React from 'react'
import { cleanup, render } from '@testing-library/react'
import CommandField from '../../../../src/components/dashboard/fields/CommandField.jsx'

jest.mock(
  '../../../../src/components/dashboard/fields/EnvironmentField',
  () => {
    // eslint-disable-next-line react/display-name
    return function() {
      return <p>EnvironmentField</p>
    }
  }
)
jest.mock('../../../../src/components/dashboard/fields/OneField', () => {
  // eslint-disable-next-line react/display-name
  return function() {
    return <p>OneField</p>
  }
})

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

describe('CommandField', () => {
  it('renders', () => {
    const { queryByText } = render(<CommandField selectedCmd={{}} />)
    expect(queryByText('OneField')).not.toBeNull()
    expect(queryByText('EnvironmentField')).toBeNull()
  })

  it('shows the environment field when appropriate', () => {
    const { queryByText } = render(
      <CommandField selectedCmd={{ command: 'setEnvironment' }} />
    )
    expect(queryByText('OneField')).toBeNull()
    expect(queryByText('EnvironmentField')).not.toBeNull()
  })
})
