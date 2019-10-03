import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import PlayButton from '../../../src/components/dashboard/PlayButton.jsx'
import { getPlayer } from '../../../src/common/player'

jest.mock('../../../src/common/player', () => {
  return {
    getPlayer: jest.fn().mockImplementation(() => {
      return { C: { MODE: 'STRAIGHT' } }
    })
  }
})

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

describe('PlayButton', () => {
  it('renders with defaults', () => {
    const { container } = render(<PlayButton
      editing={{}}
      removeSearch={() => {}}
      playerPlay={() => {}}
      config={{}}
    />)
    const button = container.querySelector('button')
    expect(Object.values(button.classList).indexOf('ant-btn')).not.toBe(-1)
  })

  describe('button onClick', () => {
    it('calls getPlayer', () => {
      const removeSearch = jest.fn()
      const playerPlay = jest.fn()
      const { container } = render(<PlayButton
        editing={{ commands: [], meta: { src: {} } }}
        removeSearch={removeSearch}
        playerPlay={playerPlay}
        config={{ playCommandInterval: 0 }}
      />)
      fireEvent.click(container.querySelector('button'))
      expect(getPlayer).toHaveBeenCalled()
      expect(removeSearch).toHaveBeenCalled()
      expect(playerPlay).toHaveBeenCalled()
    })

    it('uses default title and startUrl', () => {
      const playerPlay = jest.fn()
      const { container } = render(<PlayButton
        editing={{ commands: [], meta: { src: {} } }}
        removeSearch={jest.fn()}
        playerPlay={playerPlay}
        config={{ playCommandInterval: 0 }}
      />)
      fireEvent.click(container.querySelector('button'))
      expect(getPlayer).toHaveBeenCalled()
      const calledWith = playerPlay.mock.calls[0][0]
      expect(calledWith.title).toBe('Untitled')
      expect(calledWith.startUrl).toBeNull()
    })

    it('uses custom title', () => {
      const playerPlay = jest.fn()
      const { container } = render(<PlayButton
        editing={{ commands: [], meta: { src: { name: 'Test Name' } } }}
        removeSearch={jest.fn()}
        playerPlay={playerPlay}
        config={{ playCommandInterval: 0 }}
      />)
      fireEvent.click(container.querySelector('button'))
      expect(getPlayer).toHaveBeenCalled()
      const calledWith = playerPlay.mock.calls[0][0]
      expect(calledWith.title).toBe('Test Name')
    })

    it('has custom startUrl', () => {
      const playerPlay = jest.fn()
      const commands = [
        {
          command: 'open',
          parameters: {
            url: 'custom url'
          }
        }
      ]
      const { container } = render(<PlayButton
        editing={{ commands, meta: { src: {} } }}
        removeSearch={jest.fn()}
        playerPlay={playerPlay}
        config={{ playCommandInterval: 0 }}
      />)
      fireEvent.click(container.querySelector('button'))
      expect(getPlayer).toHaveBeenCalled()
      const calledWith = playerPlay.mock.calls[0][0]
      expect(calledWith.startUrl).toBe('custom url')
    })
  })
})
