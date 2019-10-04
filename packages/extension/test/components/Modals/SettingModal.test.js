import React from 'react'
import { cleanup, render } from '@testing-library/react'
import SettingModal from '../../../src/components/Modals/SettingModal'

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

describe('SettingModal', () => {
  it('renders', () => {
    const { getByText } = render(
      <SettingModal
        updateConfig={jest.fn()}
        config={{}}
        visible={true}
        onCancel={jest.fn()}
      />
    )
    getByText('Replay Settings')
    getByText('Sidebar width')
    getByText('Replay Helper')
    getByText('Scroll elements into view during replay')
    getByText('Highlight elements during replay')
    getByText('Command Interval')
    getByText('Record Settings')
    getByText('Record notifications')
    getByText('Filesystem Scan Interval')
    getByText('Use css selector')
    getByText('CSS selector')
    getByText('Selector Ignore Patterns')
    getByText('Add Regex to ignore')
  })
})
