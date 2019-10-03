import React from 'react'
import { cleanup, render } from '@testing-library/react'
import DashboardEditor from '../../../src/components/dashboard/DashboardEditor.jsx'

jest.mock('../../../src/actions/index.js', () => {})
jest.mock('../../../src/containers/dashboard/CommandTable', () => {
  // eslint-disable-next-line react/display-name
  return () => {
    return (
      <p>CommandTable</p>
    )
  }
})
jest.mock('../../../src/containers/dashboard/SuiteEditor', () => {
  // eslint-disable-next-line react/display-name
  return () => {
    return (
      <p>SuiteEditor</p>
    )
  }
})

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const getComponent = (props = {}) => {
  /* eslint-disable react/prop-types */
  return <DashboardEditor
    updateSelectedCommand={props.updateSelectedCommand || jest.fn()}
    setEditing={props.setEditing || jest.fn()}
    status={props.status || ''}
    hideContextMenu={props.hideContextMenu || jest.fn()}
    cutCommand={props.cutCommand || jest.fn()}
    copyCommand={props.copyCommand || jest.fn()}
    pasteCommand={props.pasteCommand || jest.fn()}
    insertCommand={props.insertCommand || jest.fn()}
    config={props.config || {}}
    editing={props.editing || { meta: {} }}
    playerPlay={props.playerPlay || jest.fn()}
    changeModalState={props.changeModalState || jest.fn()}
    player={props.player || {}}
    editorStatus={props.editorStatus || ''}
    clipboard={props.clipboard || { commands: [] }}
    searchText={props.searchText || ''}
    selectedCmds={props.selectedCmds || []}
    contextMenu={props.contextMenu || { x: 0, y: 0 }}
  />
  /* eslint-enable react/prop-types */
}

describe('DashboardEditor', () => {
  it('renders', () => {
    const { container, getByText, queryByText } = render(getComponent())
    expect(queryByText('SuiteEditor')).toBeNull()
    expect(container.querySelector('.ant-tabs')).not.toBeNull()
    getByText('Table View')
    getByText('Source View (JSON)')
    getByText('CommandTable')
    getByText('Cut')
    getByText('Copy')
    getByText('Paste')
    getByText('Insert new line')
    getByText('Execute this command')
    getByText('Run from here')
    getByText('Save As New Block')
  })

  // TODO more tests ...
})
