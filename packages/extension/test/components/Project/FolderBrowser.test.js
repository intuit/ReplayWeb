import React from 'react'
import { shallow } from 'enzyme'
import { cleanup} from '@testing-library/react'
import FolderBrowser from '../../../src/components/Project/FolderBrowser.jsx'

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
    <FolderBrowser
      listDirectory={props.listDirectory || jest.fn()}
      top={props.top || true}
      folder={props.folder || ''}
      contents={props.contents || []}
      visible={props.visible || true}
      closeModal={props.closeModal || jest.fn()}
      selectFolder={props.selectFolder || jest.fn()}
    />
  )
  /* eslint-enable react/prop-types */
}

describe('FolderBrowser', () => {
  it('renders', () => {
    const wrapper = shallow(getComponent())
    expect(wrapper.find('Choose Folder')).not.toBeNull()
    expect(wrapper.find('Jump To')).not.toBeNull()
    expect(wrapper.find('No data')).not.toBeNull()
    expect(wrapper.find('Cancel')).not.toBeNull()
    expect(wrapper.find('Select')).not.toBeNull()
    expect(wrapper.find('Modal')).not.toBeNull()
    expect(wrapper.find('Button')).not.toBeNull()
    expect(wrapper.find('Icon')).not.toBeNull()
    expect(wrapper.find('Input')).not.toBeNull()
    expect(wrapper.find('Table')).not.toBeNull()
  })

  // TODO more tests ...
  it('changeFolder', () => {
    const listDirectory = jest.fn()
    const folder = {}
    const wrapper = shallow(getComponent({folder, listDirectory}))
    const instance = wrapper.instance()
    instance.changeFolder(folder)
    expect(listDirectory).toHaveBeenCalledWith(folder)
    expect(wrapper.state('loading')).toEqual(true)
  })
})
