import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import StopButton from '../../../src/components/dashboard/StopButton.jsx'
import { getPlayer } from '../../../src/common/player'

jest.mock('../../../src/common/player', () => {
  return {
    getPlayer: jest.fn().mockImplementation(() => {
      return { stop: jest.fn() }
    })
  }
})

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

describe('StopButton', () => {
  it('renders with defaults', () => {
    const { container } = render(<StopButton />)
    const button = container.querySelector('button')
    expect(Object.values(button.classList).indexOf('ant-btn')).not.toBe(-1)
    expect(button.disabled).toBe(false)
  })

  it('can be disabled', () => {
    const { container } = render(<StopButton stopped={true} />)
    const button = container.querySelector('button')
    expect(button.disabled).toBe(true)
  })

  it('has onClick listener', () => {
    const { container } = render(<StopButton />)
    fireEvent.click(container.querySelector('button'))
    expect(getPlayer).toHaveBeenCalled()
  })
})
