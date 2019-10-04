import React from 'react'
import { cleanup, render } from '@testing-library/react'
import Suite from '../../../src/components/Sidebar/Suite.jsx'

afterEach(cleanup)

describe('Suite', () => {
  it('renders with defaults', () => {
    const { container } = render(<Suite disabled={false} name="TEST" />)
    const span = container.querySelector('span')
    expect(span).not.toBeNull()
    expect(span.innerHTML).toEqual('TEST')
    expect(span.className).toEqual('block  normal')
  })

  it('renders with disabled', () => {
    const { container } = render(<Suite disabled={true} name="TEST" />)
    const span = container.querySelector('span')
    expect(span).not.toBeNull()
    expect(span.innerHTML).toEqual('TEST')
    expect(span.className).toEqual('block disabled normal')
  })
})
