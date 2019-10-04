import React from 'react'
import { cleanup, render } from '@testing-library/react'
import FolderBrowser from '../../../src/components/Project/FolderBrowser.jsx'

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const getComponent = (props = {}) => {
  /* eslint-disable react/prop-types */
  return (
    <FolderBrowser
      listDirectory={props.listDirectory || jest.fn()}
      top={props.top || true}
      folder={props.folder || ''}
      contents={props.contents || []}
      visible={props.visible || true}
      closeModal={props.closeModal || jest.fn()}
      selectFolder={props.selectFolder || jest.fn()}
    />
  )
  /* eslint-enable react/prop-types */
}

describe('FolderBrowser', () => {
  it('renders', () => {
    const { getByText } = render(getComponent())
    getByText('Choose Folder')
    getByText('Jump To')
    getByText('No data')
    getByText('Cancel')
    getByText('Select')
  })

  // TODO more tests ...
})
