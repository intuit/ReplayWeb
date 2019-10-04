import React from 'react'
import { shallow } from 'enzyme'
import Header from '../../src/components/Header.jsx'

jest.mock('../../src/actions/index.js', () => {})

afterEach(() => {
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

  // TODO more tests ...
})
