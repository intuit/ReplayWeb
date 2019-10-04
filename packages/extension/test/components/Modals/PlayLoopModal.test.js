import React from 'react'
import { cleanup, render } from '@testing-library/react'
import PlayLoopModal from '../../../src/components/Modals/PlayLoopModal.jsx'

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const getComponent = (props = {}) => {
  /* eslint-disable react/prop-types */
  return (
    <PlayLoopModal
      playerPlay={props.playerPlay || jest.fn()}
      editing={props.editing || { commands: { meta: { src: {} } } }}
      config={props.config || {}}
      togglePlayLoopsModal={props.togglePlayLoopsModal || jest.fn()}
      visible={props.visible || true}
      /* eslint-enable react/prop-types */
    />
  )
}

describe('PlayLoopModal', () => {
  it('renders', () => {
    const { getByText } = render(getComponent())
    getByText('How many loops to play?')
    getByText('Start value')
    getByText('Max')
    getByText(/The value of the loop counter is available.*/)
    getByText('Cancel')
    getByText('Play')
  })

  // TODO more tests ...
})
