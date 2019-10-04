import React from 'react'
import { cleanup, render } from '@testing-library/react'
import ProjectModal from '../../../src/components/Project/ProjectModal.jsx'

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const getComponent = (props = {}) => {
  /* eslint-disable react/prop-types */
  return (
    <ProjectModal
      updateProject={props.updateProject || jest.fn()}
      createProject={props.createProject || jest.fn()}
      closeModal={props.closeModal || jest.fn()}
      clearProjectSetup={props.clearProjectSetup || jest.fn()}
      visible={props.visible || true}
      firstTime={props.firstTime || false}
      checkForExistingConfig={props.checkForExistingConfig || jest.fn()}
      browseProject={props.browseProject || jest.fn()}
      suites={props.suites || {}}
      id={props.id || false}
      projectPath={props.projectPath || ''}
      browseTest={props.browseTest || jest.fn()}
      existingConfig={props.existingConfig || false}
      browseBlock={props.browseBlock || jest.fn()}
    />
  )
  /* eslint-enable react/prop-types */
}

describe('ProjectModal', () => {
  it('renders', () => {
    const { getByText } = render(getComponent())
    getByText('New Project')
    getByText('Name')
    getByText('Path')
    getByText('Choose Test and Block folders')
    getByText('These paths are relative to your project path:')
  })

  // TODO more tests ...
})
