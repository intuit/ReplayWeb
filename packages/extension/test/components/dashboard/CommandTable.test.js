import React from 'react'
import { cleanup, render } from '@testing-library/react'
import CommandTable from '../../../src/components/dashboard/CommandTable.jsx'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

jest.mock('../../../src/actions/index.js', () => ({}))
jest.mock('../../../src/containers/dashboard/CommandOptions', () => {
  // eslint-disable-next-line react/display-name
  return function () {
    return (
      <p>CommandOptions</p>
    )
  }
})

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const getComponent = (props = {}) => {
  /* eslint-disable react/prop-types */
  const component = <CommandTable
    searchText={props.searchText || {}}
    moveRow={props.moveRow || {}}
    style={props.style || {}}
    className={props.className || {}}
    index={props.index || {}}
    editor={props.editor || {}}
    filterCommands={props.filterCommands || {}}
    removeSelected={props.removeSelected || {}}
    editing={props.editing || {}}
    removeSearchText={props.removeSearchText || {}}
    removeCommand={props.removeCommand || {}}
    insertCommand={props.insertCommand || {}}
    reorderCommand={props.reorderCommand || {}}
    selectCommand={props.selectCommand || {}}
    showContextMenu={props.showContextMenu || {}}
    selectedCommand={props.selectedCommand || {}}
    player={props.player || {}}
    multiSelect={props.multiSelect || {}}
    groupSelect={props.groupSelect || {}}
    /* eslint-enable react/prop-types */
  />
  return DragDropContext(HTML5Backend)(component)
}

describe('CommandTable', () => {
  it('renders', () => {
    render(getComponent())
  })

  // TODO more tests ...
})
