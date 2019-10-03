import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import Testcase from '../../../src/components/Sidebar/Testcase.jsx'

afterEach(cleanup)

const trimUp = (s) => {
  return s
    .replace('\n', '')
    .replace(/[ ]{2,}/g, ' ')
}

describe('Testcase', () => {
  it('renders with defaults', () => {
    const {container} = render(
      <Testcase name="TEST" />
    )
    const span = container.querySelector('span')
    expect(span).not.toBeNull()
    expect(span.innerHTML).toEqual('TEST')
    expect(trimUp(span.className)).toEqual('testcase normal')
  })

  it('renders with disabled', () => {
    const {container} = render(
      <Testcase disabled={true} name="TEST" />
    )
    const span = container.querySelector('span')
    expect(span).not.toBeNull()
    expect(span.innerHTML).toEqual('TEST')
    expect(trimUp(span.className)).toEqual('testcase disabled normal')
  })

  it('renders with custom status', () => {
    const {container} = render(
      <Testcase disabled={true} name="TEST" status="STATUS"/>
    )
    const span = container.querySelector('span')
    expect(span).not.toBeNull()
    expect(span.innerHTML).toEqual('TEST')
    expect(trimUp(span.className)).toEqual('testcase disabled status')
  })
})
