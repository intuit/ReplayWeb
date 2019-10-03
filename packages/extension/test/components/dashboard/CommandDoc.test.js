import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import CommandDoc from '../../../src/components/dashboard/CommandDoc.jsx'

jest.mock('../../../src/common/commands', () => {
  return [
    { name: 'command_ccc' },
    { name: 'command_aaa' },
    { name: 'command_aaa' },
    { name: 'command_bbb' }
  ]
})

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

describe('CommandDoc', () => {
  it('renders', () => {
    const { getByText } = render(<CommandDoc />)
    getByText('Cmd')
    getByText('Description')
    getByText('Comment')
    getByText('command_ccc')
  })

  it('sorts commands', () => {
    const { queryAllByText } = render(<CommandDoc />)
    const names = queryAllByText(/command_\w+/)
    expect(names.length).toBe(4)
    expect(names[0].innerHTML.endsWith('command_aaa')).toBe(true)
    expect(names[1].innerHTML.endsWith('command_aaa')).toBe(true)
    expect(names[2].innerHTML.endsWith('command_bbb')).toBe(true)
    expect(names[3].innerHTML.endsWith('command_ccc')).toBe(true)
  })

  it.skip('allows searching for commands', async () => {
    const { queryAllByText, getByPlaceholderText } = render(<CommandDoc />)
    const input = getByPlaceholderText('Search Command')
    const unfilteredLength = queryAllByText(/command_\w+/).length
    // TODO this event isn't triggering the filter
    fireEvent.change(input, { target: { value: 'a' } })
    const filteredLength = queryAllByText(/command_\w+/).length
    expect(unfilteredLength > filteredLength).toBe(true)
  })
})
