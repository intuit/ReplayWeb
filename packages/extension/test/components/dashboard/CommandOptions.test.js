import React from 'react'
import { cleanup, render } from '@testing-library/react'
import CommandOptions from '../../../src/components/dashboard/CommandOptions.jsx'

jest.mock('../../../src/common/ipc/ipc_cs.js', () => {})
jest.mock('../../../src/actions/index.js', () => {})
jest.mock('../../../src/containers/dashboard/fields/CommandField.js', () => {
  // eslint-disable-next-line react/display-name
  return function () {
    return (
      <p>CommandField component</p>
    )
  }
})

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const getComponent = (props = {}) => {
  /* eslint-disable react/prop-types */
  return <CommandOptions
    updateSelectedCommand={props.updateSelectedCommand || jest.fn()}
    setEditorStatus={props.setEditorStatus || jest.fn()}
    editor={props.editor || {}}
    editing={props.editing || { meta: { selectedIndex: 0 } }}
    setNextBlock={props.setNextBlock || jest.fn()}
    changeModalState={props.changeModalState || jest.fn()}
    editBlock={props.editBlock || jest.fn()}
    player={props.player || {}}
  />
  /* eslint-enable react/prop-types */
}

describe('CommandOptions', () => {
  it('renders', () => {
    const { getByText, container } = render(getComponent())
    getByText('Command')
    getByText('command')
    getByText('CommandField component')
    getByText('?')
    expect(container.querySelector('.ant-select')).not.toBeNull()
    // getByText('ABAssign') // this should pass, given that the option _should be somewhere_
  })

  it('displays available commands', () => {
    // ...
  })

  it('allows searching for commands', () => {
    // ...
  })

  it('shows the modal if the ? is clicked', () => {
    // ...
  })

  it('can close the modal', () => {
    // ...
  })
})
