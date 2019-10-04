import React from 'react'
import { cleanup, render } from '@testing-library/react'
import EnvironmentField from '../../../../src/components/dashboard/fields/EnvironmentField.jsx'

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

describe('EnvironmentField', () => {
  it('renders', () => {
    const { container, getByText } = render(
      <EnvironmentField selectedCmd={{ parameters: {} }} />
    )
    getByText('Environment')
    expect(container.querySelector('input')).not.toBeNull()
  })

  // TODO more tests ...
})
