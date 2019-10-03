import React from 'react'
import { cleanup, render } from '@testing-library/react'
import { shallow } from 'enzyme'
import Block from '../../../src/components/Sidebar/Block.jsx'

afterEach(cleanup)

describe('Block with testing-library', () => {
  it('renders with defaults', () => {
    const { container } = render(
      <Block name="TEST"/>
    )
    const span = container.querySelector('span')
    expect(span).not.toBeNull()
    expect(span.innerHTML).toEqual('TEST')
    expect(span.className).toEqual('block  normal')
  })

  it('renders with disabled', () => {
    const { container } = render(
      <Block disabled={true} name="TEST"/>
    )
    const span = container.querySelector('span')
    expect(span).not.toBeNull()
    expect(span.innerHTML).toEqual('TEST')
    expect(span.className).toEqual('block disabled normal')
  })

  it('renders with custom status', () => {
    const { container } = render(
      <Block status="STATUS" name="TEST"/>
    )
    const span = container.querySelector('span')
    expect(span).not.toBeNull()
    expect(span.innerHTML).toEqual('TEST')
    expect(span.className).toEqual('block  status')
  })
})

describe('Block with enzyme', () => {
  it('renders with defaults', () => {
    const wrapper = shallow(<Block name="TEST" />)
    const span = wrapper.find('span')
    expect(span).not.toBeNull()
    expect(span.text()).toEqual('TEST')
    expect(span.hasClass('block')).toBe(true)
    expect(span.hasClass('disabled')).toBe(false)
    expect(span.hasClass('normal')).toBe(true)
  })

  it('renders with disabled', () => {
    const wrapper = shallow(<Block disabled={true} name="TEST" />)
    const span = wrapper.find('span')
    expect(span).not.toBeNull()
    expect(span.text()).toEqual('TEST')
    expect(span.hasClass('block')).toBe(true)
    expect(span.hasClass('disabled')).toBe(true)
    expect(span.hasClass('normal')).toBe(true)
  })

  it('renders with custom status', () => {
    const wrapper = shallow(<Block status="STATUS" name="TEST" />)
    const span = wrapper.find('span')
    expect(span).not.toBeNull()
    expect(span.text()).toEqual('TEST')
    expect(span.hasClass('block')).toBe(true)
    expect(span.hasClass('disabled')).toBe(false)
    expect(span.hasClass('normal')).toBe(false)
  })
})
