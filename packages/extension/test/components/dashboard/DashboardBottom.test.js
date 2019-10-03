import React from 'react'
import { cleanup, render } from '@testing-library/react'
import DashboardBottom from '../../../src/components/dashboard/DashboardBottom.jsx'

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const getComponent = (props = {}) => {
  /* eslint-disable react/prop-types */
  return <DashboardBottom
    logs={props.logs || []}
    screenshots={props.screenshots || []}
    clearLogs={props.clearLogs || jest.fn()}
    clearScreenshots={props.clearScreenshots || jest.fn()}
    /* eslint-enable react/prop-types */
  />
}

describe('DashboardBottom', () => {
  it('renders', () => {
    const { getByText } = render(getComponent())
    getByText('Logs')
    getByText('Screenshots')
    getByText('Clear')
  })

  // TODO more tests ...
})
