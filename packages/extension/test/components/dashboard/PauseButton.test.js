import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import PauseButton from '../../../src/components/dashboard/PauseButton.jsx'
import { getPlayer } from '../../../src/common/player'

jest.mock('../../../src/common/player', () => {
  return {
    getPlayer: jest.fn().mockImplementation(() => {
      return {
        pause: jest.fn()
      }
    })
  }
})

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

describe('PauseButton', () => {
  it('renders with defaults', () => {
    const { container } = render(<PauseButton />)
    expect(container.querySelector('button')).not.toBeNull()
    expect(container.querySelector('i.anticon.anticon-pause')).not.toBeNull()
  })

  it('has a button that calls into the player', () => {
    const { container } = render(<PauseButton />)
    const button = container.querySelector('button')
    fireEvent.click(button)
    expect(getPlayer).toHaveBeenCalled()
  })
})
