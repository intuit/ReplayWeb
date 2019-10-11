import React from 'react'
import { shallow } from 'enzyme'
import { cleanup } from '@testing-library/react'
import Header from '../../src/components/Header.jsx'
import * as C from '../../src/common/constant.js'

jest.mock('../../src/actions/index.js', () => {})

beforeEach(() => {
  global.browser = {}
})

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const getComponent = (props = {}) => {
  /* eslint-disable react/prop-types */
  return (
    <Header
      editNew={props.editNew || jest.fn()}
      logMessage={props.logMessage || jest.fn()}
      editing={props.editing || { meta: { src: {} } }}
      saveEditingAsExisted={props.saveEditingAsExisted || jest.fn()}
      editorType={props.editorType || {}}
      changeModalState={props.changeModalState || jest.fn()}
      status={props.status || ''}
      stopRecording={props.stopRecording || jest.fn()}
      normalizeCommands={props.normalizeCommands || jest.fn()}
      startRecording={props.startRecording || jest.fn()}
      player={props.player || {}}
    />
  )
  /* eslint-enable react/prop-types */
}

describe('Header', () => {
  it('renders', () => {
    const wrapper = shallow(getComponent())
    expect(wrapper.find('Menu')).not.toBeNull()
    expect('Connect(SettingModal)').not.toBeNull()
    expect('Connect(DuplicateModal)').not.toBeNull()
    expect('Connect(SaveModal)').not.toBeNull()
    expect('Connect(NewBlockModal)').not.toBeNull()
    expect('Connect(RenameModal)').not.toBeNull()
    expect('Connect(ShareBlockModal)').not.toBeNull()
    expect('Connect(PlayLoopModal)').not.toBeNull()
    expect('Connect(SaveMultiSelectModal)').not.toBeNull()
    expect('Connect(NewProjectModal)').not.toBeNull()
    expect('Connect(AddFolder)').not.toBeNull()
  })

  it('onClickNew when hasUnsaved exists', () => {
    const editing = { meta: { hasUnsaved: {} } }
    const editNew = jest.fn()
    const logMessage = jest.fn()
    const wrapper = shallow(getComponent({ editing, editNew, logMessage }))
    const instance = wrapper.instance()
    instance.onClickNew()
    expect(editNew).not.toHaveBeenCalled()
    expect(logMessage).not.toHaveBeenCalledWith({ type: 'New Test' })
  })

  it('onClickNew when hasUnsaved does not exist', () => {
    const editing = { meta: { } }
    const editNew = jest.fn()
    const logMessage = jest.fn()
    const wrapper = shallow(getComponent({ editing, editNew, logMessage }))
    const instance = wrapper.instance()
    instance.onClickNew()
    expect(editNew).toHaveBeenCalled()
    expect(logMessage).toHaveBeenCalledWith({ type: 'New Test' })
  })

  it('onClickSave if !hasUnsaved should not call saveEditingAsExisted and changeModalState', () => {
    const editing = { meta: { src: {} } }
    const saveEditingAsExisted = jest.fn()
    const changeModalState = jest.fn()
    const wrapper = shallow(getComponent({ editing, saveEditingAsExisted, changeModalState }))
    const instance = wrapper.instance()
    instance.onClickSave()
    expect(saveEditingAsExisted).not.toHaveBeenCalled()
    expect(changeModalState).not.toHaveBeenCalled()
  })

  it('onClickSave if hasUnsaved and src exist should call saveEditingAsExisted but not call changeModalState', () => {
    const editing = { meta: { src: {'name': 'test'}, hasUnsaved: {} } }
    const saveEditingAsExisted = jest.fn()
    const changeModalState = jest.fn()
    const wrapper = shallow(getComponent({ editing, saveEditingAsExisted, changeModalState }))
    const instance = wrapper.instance()
    instance.onClickSave()
    expect(saveEditingAsExisted).toHaveBeenCalled()
    expect(changeModalState).not.toHaveBeenCalled()
  })

  it('onClickSave if hasUnsaved exists but src does not exist should not call saveEditingAsExisted but call changeModalState', () => {
    const editing = { meta: { hasUnsaved: {} } }
    const saveEditingAsExisted = jest.fn()
    const changeModalState = jest.fn()
    const wrapper = shallow(getComponent({ editing, saveEditingAsExisted, changeModalState }))
    const instance = wrapper.instance()
    instance.onClickSave()
    expect(saveEditingAsExisted).not.toHaveBeenCalled()
    expect(changeModalState).toHaveBeenCalledWith('save', true)
  })

  it('onToggleRecord if status is C.APP_STATUS.RECORDER should call stopRecording and normalizeCommands', () => {
    const status = C.APP_STATUS.RECORDER
    const stopRecording = jest.fn()
    const normalizeCommands = jest.fn()
    const startRecording = jest.fn()
    const wrapper = shallow(getComponent({ status, stopRecording, normalizeCommands, startRecording }))
    const instance = wrapper.instance()
    instance.onToggleRecord()
    expect(stopRecording).toHaveBeenCalled()
    expect(normalizeCommands).toHaveBeenCalled()
    expect(startRecording).not.toHaveBeenCalled()
  })

  it('onToggleRecord if status is not C.APP_STATUS.RECORDER should call startRecording', () => {
    const status = C.APP_STATUS.NORMAL
    const stopRecording = jest.fn()
    const normalizeCommands = jest.fn()
    const startRecording = jest.fn()
    const wrapper = shallow(getComponent({ status, stopRecording, normalizeCommands, startRecording }))
    const instance = wrapper.instance()
    instance.onToggleRecord()
    expect(stopRecording).not.toHaveBeenCalled()
    expect(normalizeCommands).not.toHaveBeenCalled()
    expect(startRecording).toHaveBeenCalled()
  })

  it('addEventListener on componentWillMount', () => {
    const map = {}
    window.addEventListener = jest.fn((event, callback) => {
      map[event] = callback
    })
    const component = shallow(getComponent())
    map.keydown({})
    expect(component).toBeDefined()
    expect(window.addEventListener).toHaveBeenCalled()
  })

  it('handleClick', () => {
    const e = {key: 'test'}
    const wrapper = shallow(getComponent())
    const instance = wrapper.instance()
    instance.handleClick(e)
    expect(wrapper.state('current')).toEqual(e.key)
  })

})
