import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import ResumeButton from '../../../src/components/dashboard/ResumeButton.jsx'
import { getPlayer } from '../../../src/common/player'

jest.mock('../../../src/actions/index.js', () => ({}))
jest.mock('../../../src/common/player', () => {
  return {
    getPlayer: jest.fn().mockImplementation(() => {
      return { resume: jest.fn() }
    })
  }
})

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

describe('ResumeButton', () => {
  it('renders', () => {
    render(<ResumeButton />)
  })

  it('has button onClick', () => {
    const { container } = render(<ResumeButton />)
    fireEvent.click(container.querySelector('button'))
    expect(getPlayer).toHaveBeenCalled()
  })
})
