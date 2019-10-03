import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import PlayMenu from '../../../src/components/dashboard/PlayMenu.jsx'
import * as C from '../../../src/common/constant'

afterEach(cleanup)

describe('PlayMenu', () => {
  it('renders with defaults', () => {
    const { getByText } = render(<PlayMenu
      togglePlayLoopsModal={() => {}}
    />)
    expect(getByText('Play loop..').classList.contains('ant-menu-item-disabled')).toBe(true)
  })

  it('can be enabled', () => {
    const { getByText } = render(<PlayMenu
      togglePlayLoopsModal={() => {}}
      status={C.PLAYER_STATUS.STOPPED}
    />)
    expect(getByText('Play loop..').classList.contains('ant-menu-item-disabled')).toBe(false)
  })

  it('calls togglePlayLoopsModal', () => {
    const togglePlayLoopsModal = jest.fn()
    const { container } = render(<PlayMenu
      togglePlayLoopsModal={togglePlayLoopsModal}
      status={C.PLAYER_STATUS.STOPPED}
    />)
    fireEvent.click(container.querySelector('li'))
    expect(togglePlayLoopsModal).toHaveBeenCalled()
  })
})
