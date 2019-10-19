import React from 'react'
import { shallow } from 'enzyme'
import { cleanup, render } from '@testing-library/react'
import ProjectModal from '../../../src/components/Project/ProjectModal.jsx'
import { Input, Modal, Button} from 'antd'
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

  it('onClick of "Button", id passed from props does not exists', () => {
    const browseProject = jest.fn()
    const wrapper = shallow(getComponent({browseProject}))
    wrapper.find(Button).simulate('click')
    expect(browseProject).toHaveBeenCalled()
  })

  it('onClick of "Button", id passed from props exists', () => {
    const id = {}
    const browseProject = jest.fn()
    const browseBlock = jest.fn()
    const browseTest = jest.fn()
    const wrapper = shallow(getComponent({browseProject, browseBlock, browseTest, id}))
    wrapper.find(Button).at(0).simulate('click')
    expect(browseProject).toHaveBeenCalled()
    wrapper.find(Button).at(1).simulate('click')
    expect(browseTest).toHaveBeenCalled()
    wrapper.find(Button).at(2).simulate('click')
    expect(browseBlock).toHaveBeenCalled()
  })

  it('onClick of "Button", id is null while projectPath exist and existingConfig is not null', () => {
    const id = null
    const projectPath = {}
    const existingConfig = {}
    const browseProject = jest.fn()
    const browseBlock = jest.fn()
    const browseTest = jest.fn()
    const wrapper = shallow(getComponent({browseProject, browseBlock, browseTest, id, projectPath, existingConfig}))
    wrapper.find(Button).at(0).simulate('click')
    expect(browseProject).toHaveBeenCalled()
    wrapper.find(Button).at(1).simulate('click')
    expect(browseTest).toHaveBeenCalled()
    wrapper.find(Button).at(2).simulate('click')
    expect(browseBlock).toHaveBeenCalled()
  })

  it('onChange of "Menu" is triggered', () => {
    const clearProjectSetup = jest.fn()
    const closeModal = jest.fn()
    const firstTime = false
    const wrapper = shallow(getComponent({clearProjectSetup, closeModal, firstTime}))
    wrapper.find(Modal).simulate('cancel')
    expect(clearProjectSetup).toHaveBeenCalled()
    expect(closeModal).toHaveBeenCalled()
    expect(wrapper.state('name')).toEqual('')
  })

  it('onBlur of "Input" is triggered', () => {
    const checkForExistingConfig = jest.fn()
    const wrapper = shallow(getComponent({checkForExistingConfig}))
    wrapper.find(Input).at(1).simulate('blur')
    expect(checkForExistingConfig).toHaveBeenCalled()
  })

  it('onOk of "Menu" is triggered and id passed from props does not exists', () => {
    const id = null
    const updateProject = jest.fn()
    const createProject = jest.fn()
    const closeModal = jest.fn()
    const clearProjectSetup = jest.fn()
    const wrapper = shallow(getComponent({id, updateProject, createProject, closeModal, clearProjectSetup}))
    wrapper.find(Modal).simulate('ok')
    expect(createProject).toHaveBeenCalled()
    expect(closeModal).toHaveBeenCalled()
    expect(clearProjectSetup).toHaveBeenCalled()
    expect(wrapper.state('name')).toEqual('')
  })

  it('onOk of "Menu" is triggered and id passed from props exists', () => {
    const id = {}
    const updateProject = jest.fn()
    const createProject = jest.fn()
    const closeModal = jest.fn()
    const clearProjectSetup = jest.fn()
    const wrapper = shallow(getComponent({id, updateProject, createProject, closeModal, clearProjectSetup}))
    wrapper.find(Modal).simulate('ok')
    expect(updateProject).toHaveBeenCalled()
    expect(closeModal).toHaveBeenCalled()
    expect(clearProjectSetup).toHaveBeenCalled()
    expect(wrapper.state('name')).toEqual('')
  })

  // TODO more tests ...
})
