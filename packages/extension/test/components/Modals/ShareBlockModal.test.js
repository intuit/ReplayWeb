import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import ShareBlockModal from '../../../src/components/Modals/ShareBlockModal'

jest.mock('../../../src/actions/index.js', () => ({}))

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

describe('ShareBlockModal', () => {
  describe('share block', () => {
    it('disables block sharing on invalid blockShareConfig', () => {
      const { getByText, queryByTestId, rerender } = render(
        <ShareBlockModal
          visible={true}
          blockShareConfig={{}}
          blockShareConfigError={true}
          blockShareConfigErrorMessage="This is an error"
          closeModal={() => {}}
          openDuplicate={() => {}}
          shareEditingBlock={() => {}}
        />
      )

      // This rerender is required with different props as the ShareBlockModal component uses
      // componentWillReceiveProps which only gets invoked when new props will be received. Forcing this new props
      // using rerender
      rerender(
        <ShareBlockModal
          visible={true}
          blockShareConfig={{}}
          blockShareConfigError={true}
          blockShareConfigErrorMessage="This is an error"
          closeModal={() => {}}
          editing={{
            commands: [],
            filterCommands: [],
            meta: {},
            shareEditing: false,
            isImported: false
          }}
          openDuplicate={() => {}}
          shareEditingBlock={() => {}}
        />
      )
      getByText('Unable to share block')

      // share block button is not present
      const shareButton = queryByTestId('shareBlockModal_shareButton')
      expect(shareButton).toBeNull()

      const reshareButton = queryByTestId('shareBlockModal_reshareButton')
      expect(reshareButton).toBeNull()

      const duplicateButton = queryByTestId('shareBlockModal_duplicateButton')
      expect(duplicateButton).toBeNull()
    })

    it('enables block sharing on valid blockShareConfig', () => {
      const { queryByText, getByTestId, queryByTestId, rerender } = render(
        <ShareBlockModal
          visible={true}
          blockShareConfigError={false}
          blockShareConfigErrorMessage=""
          blockShareConfig={{}}
          closeModal={() => {}}
          openDuplicate={() => {}}
          shareEditingBlock={() => {}}
        />
      )

      // This rerender is required with different props as the ShareBlockModal component uses
      // componentWillReceiveProps which only gets invoked when new props will be received. Forcing this new props
      // using rerender
      rerender(
        <ShareBlockModal
          visible={true}
          blockShareConfigError={false}
          blockShareConfigErrorMessage=""
          blockShareConfig={{}}
          closeModal={() => {}}
          editing={{
            commands: [],
            filterCommands: [],
            meta: {},
            shareEditing: false,
            isImported: false
          }}
          openDuplicate={() => {}}
          shareEditingBlock={() => {}}
        />
      )

      expect(queryByText('Unable to share block')).toBeNull()

      getByTestId('shareBlockModal_shareButton')

      const reshareButton = queryByTestId('shareBlockModal_reshareButton')
      expect(reshareButton).toBeNull()

      const duplicateButton = queryByTestId('shareBlockModal_duplicateButton')
      expect(duplicateButton).toBeNull()
    })

    it('call props.shareEditingBlock when button is clicked', () => {
      const shareEditingBlockStub = jest.fn().mockResolvedValue({})

      const initialProps = {
        visible: true,
        blockShareConfigError: false,
        blockShareConfigErrorMessage: '',
        blockShareConfig: {},
        closeModal: () => {},
        openDuplicate: () => {},
        shareEditingBlock: shareEditingBlockStub
      }
      const { getByTestId, rerender } = render(
        <ShareBlockModal {...initialProps} />
      )

      // rerender so that componentWillReceiveProps is called
      const newProps = {
        ...initialProps,
        editing: {
          commands: [],
          filterCommands: [],
          meta: {},
          shareEditing: false,
          isImported: false
        }
      }
      rerender(<ShareBlockModal {...newProps} />)

      const button = getByTestId('shareBlockModal_shareButton')
      fireEvent.click(button)
      expect(shareEditingBlockStub).toHaveBeenCalled()
    })
  })

  describe('reshare block', () => {
    it('disables block re-sharing on invalid blockShareConfig', () => {
      const { getByText, queryByTestId, rerender } = render(
        <ShareBlockModal
          visible={true}
          blockShareConfig={{}}
          blockShareConfigError={true}
          blockShareConfigErrorMessage="This is an error"
          closeModal={() => {}}
          openDuplicate={() => {}}
          shareEditingBlock={() => {}}
        />
      )

      // This rerender is required with different props as the ShareBlockModal component uses
      // componentWillReceiveProps which only gets invoked when new props will be received. Forcing this new props
      // using rerender
      rerender(
        <ShareBlockModal
          visible={true}
          blockShareConfig={{}}
          blockShareConfigError={true}
          blockShareConfigErrorMessage="This is an error"
          closeModal={() => {}}
          editing={{
            commands: [],
            filterCommands: [],
            meta: {},
            shareEditing: false,
            isImported: false,
            shareLink: 'a_link'
          }}
          openDuplicate={() => {}}
          shareEditingBlock={() => {}}
        />
      )
      getByText('Unable to re-share block')

      // share block button is not present;
      const shareButton = queryByTestId('shareBlockModal_shareButton')
      expect(shareButton).toBeNull()

      const reshareButton = queryByTestId('shareBlockModal_reshareButton')
      expect(reshareButton).toBeNull()

      const duplicateButton = queryByTestId('shareBlockModal_duplicateButton')
      expect(duplicateButton).toBeNull()
    })

    it('enables block re-sharing on valid blockShareConfig', () => {
      const { queryByText, getByTestId, queryByTestId, rerender } = render(
        <ShareBlockModal
          visible={true}
          blockShareConfigError={false}
          blockShareConfigErrorMessage=""
          blockShareConfig={{}}
          closeModal={() => {}}
          openDuplicate={() => {}}
          shareEditingBlock={() => {}}
        />
      )

      // This rerender is required with different props as the ShareBlockModal component uses
      // componentWillReceiveProps which only gets invoked when new props will be received. Forcing this new props
      // using rerender
      rerender(
        <ShareBlockModal
          visible={true}
          blockShareConfigError={false}
          blockShareConfigErrorMessage=""
          blockShareConfig={{}}
          closeModal={() => {}}
          editing={{
            commands: [],
            filterCommands: [],
            meta: {},
            shareEditing: false,
            isImported: false,
            shareLink: 'a_link'
          }}
          openDuplicate={() => {}}
          shareEditingBlock={() => {}}
        />
      )

      expect(queryByText('Unable to share block')).toBeNull()
        
      getByTestId('shareBlockModal_reshareButton')

       // share block button is not present
      const shareButton = queryByTestId('shareBlockModal_shareButton')
      expect(shareButton).toBeNull()

      const duplicateButton = queryByTestId('shareBlockModal_duplicateButton')
      expect(duplicateButton).toBeNull()
    })
  })
  describe('imported block', () => {
    it('calls props.CloseModal and props.OpenDuplicate when reshare button button is clicked', () => {
      const closeModalStub = jest.fn()
      const openDuplicateStub = jest.fn()

      const initialProps = {
        visible: true,
        blockShareConfigError: false,
        blockShareConfigErrorMessage: '',
        blockShareConfig: {},
        closeModal: closeModalStub,
        openDuplicate: openDuplicateStub,
        shareEditingBlock: () => {}
      }

      const { getByTestId, rerender } = render(
        <ShareBlockModal {...initialProps} />
      )

      // rerender is required so thatcomponentWillReceiveProps is called

      const newProps = {
        ...initialProps,
        editing: {
          commands: [],
          filterCommands: [],
          meta: { src: { name: 'foo' } },
          shareEditing: false,
          isImported: true,
          shareLink: 'a_link'
        }
      }
      rerender(<ShareBlockModal {...newProps} />)

      const button = getByTestId('shareBlockModal_duplicateButton')
      fireEvent.click(button)
      expect(closeModalStub).toHaveBeenCalled()
      expect(openDuplicateStub).toHaveBeenCalled()
    })
  })
})
