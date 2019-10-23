import React from 'react'
import { cleanup, render } from '@testing-library/react'
import DuplicateModal from '../../../src/components/Modals/DuplicateModal.jsx'

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const getComponent = (props = {}) => {
  /* eslint-disable react/prop-types */
  return (
    <DuplicateModal
      src={props.src || ''}
      duplicate={props.duplicate || jest.fn()}
      closeModal={props.closeModal || jest.fn()}
      visible={props.visible || false}
      type={props.type || ''}
      /* eslint-enable react/prop-types */
    />
  )
}

describe('DuplicateModal', () => {
  it('does not render', () => {
    const { container } = render(getComponent())
    expect(container.querySelector('input')).toBeNull()
  })
  it('renders when visible is true', () => {
    const wrapper = shallow(getComponent({visible: true}))
    expect(wrapper.find('Modal')).not.toBeNull()
  })
  it('test onCancel', () => {
    const closeModalSpy = jest.fn()
    const wrapper = shallow(getComponent({
      visible: true,
      closeModal: closeModalSpy
    }))
    expect(wrapper.find('Modal')).not.toBeNull()
    wrapper.instance().onCancel()
    expect(wrapper.state("duplicateName")).toEqual("")
    expect(closeModalSpy).toHaveBeenCalled()
  })
  it('test onCancel', () => {
    const closeModalSpy = jest.fn()
    const wrapper = shallow(getComponent({
      visible: true,
      closeModal: closeModalSpy
    }))
    expect(wrapper.find('Modal')).not.toBeNull()
    wrapper.instance().onCancel()
    expect(wrapper.state("duplicateName")).toEqual("")
    expect(closeModalSpy).toHaveBeenCalled()
  })
  it('test onChange', () => {
    const wrapper = shallow(getComponent({
      visible: true
    }))
    const e = { target: { value: "test"}}
    expect(wrapper.find('Modal')).not.toBeNull()
    wrapper.instance().onChange(e)
    expect(wrapper.state("duplicateName")).toEqual("test")
  })
  it('test onDuplicate resolves successfully', () => {
    const closeModalSpy = jest.fn()
    const duplicateMock = jest.fn()
    const wrapper = shallow(getComponent({
      visible: true,
      closeModal: closeModalSpy,
      duplicate: duplicateMock
    }))
    expect(wrapper.find('Modal')).not.toBeNull()
    wrapper.instance().onDuplicate()
    expect(wrapper.state("duplicateName")).toEqual("")
    expect(closeModalSpy).toHaveBeenCalled()
  })
})
