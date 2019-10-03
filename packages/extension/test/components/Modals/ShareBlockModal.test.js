import React from 'react'
import { cleanup, render } from '@testing-library/react'
import ShareBlockModal from '../../../src/components/Modals/ShareBlockModal'

jest.mock('../../../src/actions/index.js', () => ({}))

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

describe('ShareBlockModal', () => {
  it('disables block sharing on invalid blockShareConfig', () => {
    const { getByText, queryByTestId, rerender } = render(
      <ShareBlockModal visible={true} blockShareConfig={({})}
        blockShareConfigError={true} blockShareConfigErrorMessage="This is an error"
        closeModal={() => {}}
        openDuplicate={() => {}}
        shareEditingBlock={() => {}} />)

    // This rerender is required with different props as the ShareBlockModal component uses
    // componentWillReceiveProps which only gets invoked when new props will be received. Forcing this new props
    // using rerender
    rerender(<ShareBlockModal visible={true} blockShareConfig={({})}
      blockShareConfigError={true} blockShareConfigErrorMessage="This is an error"
      closeModal={() => {}}
      editing={({ commands: [], filterCommands: [], meta: {}, shareEditing: false, isImported: false })}
      openDuplicate={() => {}}
      shareEditingBlock={() => {}} />)
    getByText('Unable to share block')

    // share block button is not present
    // const shareButton = container.querySelector("button");
    const shareButton = queryByTestId('shareBlockModal_shareButton')
    expect(shareButton).toBeNull()
    const reshareButton = queryByTestId('shareBlockModal_reshareButton')
    expect(reshareButton).toBeNull()
    const duplicateButton = queryByTestId('shareBlockModal_duplicateButton')
    expect(duplicateButton).toBeNull()
  })

  it('enables block sharing on valid blockShareConfig', () => {
    const { queryByText, getByTestId, queryByTestId, rerender } = render(
      <ShareBlockModal visible={true} blockShareConfig={({})}
        blockShareConfigError={false} blockShareConfigErrorMessage="" blockShareConfig={{}}
        closeModal={() => {}}
        openDuplicate={() => {}}
        shareEditingBlock={() => {}} />)

    // This rerender is required with different props as the ShareBlockModal component uses
    // componentWillReceiveProps which only gets invoked when new props will be received. Forcing this new props
    // using rerender
    rerender(<ShareBlockModal visible={true} blockShareConfig={({})}
      blockShareConfigError={false} blockShareConfigErrorMessage="" blockShareConfig={{}}
      closeModal={() => {}}
      editing={({ commands: [], filterCommands: [], meta: {}, shareEditing: false, isImported: false })}
      openDuplicate={() => {}}
      shareEditingBlock={() => {}} />)

    expect(queryByText('Unable to share block')).toBeNull()

    // share block button is not present
    // const shareButton = container.querySelector("button");
    getByTestId('shareBlockModal_shareButton')
    const reshareButton = queryByTestId('shareBlockModal_reshareButton')
    expect(reshareButton).toBeNull()
    const duplicateButton = queryByTestId('shareBlockModal_duplicateButton')
    expect(duplicateButton).toBeNull()
  })

  it('disables block re-sharing on invalid blockShareConfig', () => {
    const { getByText, queryByTestId, rerender } = render(
      <ShareBlockModal visible={true} blockShareConfig={({})}
        blockShareConfigError={true} blockShareConfigErrorMessage="This is an error"
        closeModal={() => {}}
        openDuplicate={() => {}}
        shareEditingBlock={() => {}} />)

    // This rerender is required with different props as the ShareBlockModal component uses
    // componentWillReceiveProps which only gets invoked when new props will be received. Forcing this new props
    // using rerender
    rerender(<ShareBlockModal visible={true} blockShareConfig={({})}
      blockShareConfigError={true} blockShareConfigErrorMessage="This is an error"
      closeModal={() => {}}
      editing={({ commands: [], filterCommands: [], meta: {}, shareEditing: false, isImported: false, shareLink: 'a_link' })}
      openDuplicate={() => {}}
      shareEditingBlock={() => {}} />)
    getByText('Unable to re-share block')

    // share block button is not present
    // const shareButton = container.querySelector("button");
    const shareButton = queryByTestId('shareBlockModal_shareButton')
    expect(shareButton).toBeNull()
    const reshareButton = queryByTestId('shareBlockModal_reshareButton')
    expect(reshareButton).toBeNull()
    const duplicateButton = queryByTestId('shareBlockModal_duplicateButton')
    expect(duplicateButton).toBeNull()
  })

  it('enables block re-sharing on valid blockShareConfig', () => {
    const { queryByText, getByTestId, queryByTestId, rerender } = render(
      <ShareBlockModal visible={true} blockShareConfig={({})}
        blockShareConfigError={false} blockShareConfigErrorMessage="" blockShareConfig={{}}
        closeModal={() => {}}
        openDuplicate={() => {}}
        shareEditingBlock={() => {}} />)

    // This rerender is required with different props as the ShareBlockModal component uses
    // componentWillReceiveProps which only gets invoked when new props will be received. Forcing this new props
    // using rerender
    rerender(<ShareBlockModal visible={true} blockShareConfig={({})}
      blockShareConfigError={false} blockShareConfigErrorMessage="" blockShareConfig={{}}
      closeModal={() => {}}
      editing={({ commands: [], filterCommands: [], meta: {}, shareEditing: false, isImported: false, shareLink: 'a_link' })}
      openDuplicate={() => {}}
      shareEditingBlock={() => {}} />)

    expect(queryByText('Unable to share block')).toBeNull()

    // share block button is not present
    // const shareButton = container.querySelector("button");
    getByTestId('shareBlockModal_reshareButton')
    const shareButton = queryByTestId('shareBlockModal_shareButton')
    expect(shareButton).toBeNull()
    const duplicateButton = queryByTestId('shareBlockModal_duplicateButton')
    expect(duplicateButton).toBeNull()
  })
})
