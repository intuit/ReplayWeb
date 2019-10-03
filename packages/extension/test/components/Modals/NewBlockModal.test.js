import React from 'react'
import { cleanup, render } from '@testing-library/react'
import NewBlockModal from '../../../src/components/Modals/NewBlockModal'

jest.mock('../../../src/actions/index.js', () => ({}))
jest.mock('github-api', () => [])

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

describe('NewBlockModal', () => {
  it('disables block importing on invalid blockShareConfig', () => {
    const { getByText, getByTestId } = render(
      <NewBlockModal visible={true} blockShareConfig={({})}
        blockShareConfigError={true} blockShareConfigErrorMessage="This is an error" />)

    getByText('Importing blocks from registry is disabled')
  })
})
