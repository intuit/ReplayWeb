import React from 'react'
import { cleanup, render } from '@testing-library/react'
import PlaybackControl from '../../../src/components/dashboard/PlaybackControl.jsx'
import * as C from '../../../src/common/constant'

jest.mock('../../../src/actions/index.js', () => ({}))
jest.mock('../../../src/containers/dashboard/PlayButton', () => {
  // eslint-disable-next-line react/display-name
  return function () {
    return (
      <p>Play Button</p>
    )
  }
})

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

describe('PlaybackControl', () => {
  it('shows right buttons when playing', () => {
    // stop button with stopped=false and pause button
    const { container } = render(
      <PlaybackControl status={C.PLAYER_STATUS.PLAYING} />
    )
    expect(container.querySelector('i.anticon.anticon-right-square')).not.toBeNull()
    expect(container.querySelector('i.anticon.anticon-pause')).not.toBeNull()
  })

  it('shows right buttons when paused', () => {
    // stop button with stopped=false and resume button
    const { container } = render(
      <PlaybackControl status={C.PLAYER_STATUS.PAUSED} />
    )
    expect(container.querySelector('i.anticon.anticon-right-square')).not.toBeNull()
    expect(container.querySelector('i.anticon.anticon-caret-right')).not.toBeNull()
  })

  it('shows right buttons otherwise, stopped', () => {
    const { getByText } = render(
      <PlaybackControl status={C.PLAYER_STATUS.STOPPED} />
    )
    getByText('Play Button')
  })

  it('shows right buttons otherwise, default', () => {
    const { container } = render(<PlaybackControl />)
    expect(container.querySelector('i.anticon.anticon-right-square')).not.toBeNull()
  })
})
