/* eslint-disable react/display-name */

import React from 'react'
import { App } from '../src/app'
import { shallow } from 'enzyme'

jest.mock('../src/actions/app', () => ({
  readBlockShareConfig: jest.fn()
}))
jest.mock('../src/containers/dashboard', () => () => {
  return <p>Dashboard</p>
})
jest.mock('../src/containers/Header', () => () => {
  return <p>Header</p>
})
jest.mock('../src/containers/Sidebar', () => () => {
  return <p>Sidebar</p>
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('App', () => {
  it('renders', () => {
    const mockReadBlockShareConfig = jest.fn()
    const wrapper = shallow(
      <App readBlockShareConfig={mockReadBlockShareConfig} />
    )
    expect(mockReadBlockShareConfig).toHaveBeenCalledTimes(1)
    expect(wrapper.find('Adapter').length).not.toBeNull()
    expect(wrapper.find('Component').length).not.toBeNull()
  })
})

/* eslint-enable react/display-name */
