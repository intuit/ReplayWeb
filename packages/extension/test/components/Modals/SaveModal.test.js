import React from 'react'
import { shallow } from 'enzyme'
import {
  default as SaveModal,
  SaveBlockModal,
  SaveMultiSelectModal,
  SaveTestCaseModal,
  SaveSuiteModal
} from '../../../src/components/Modals/SaveModal.jsx'

afterEach(() => {
  jest.clearAllMocks()
})

describe('SaveModal.jsx', () => {
  describe('SaveModal', () => {
    it('renders SaveTestCaseModal', () => {
      const wrapper = shallow(<SaveModal editorStatus={'TESTS'} />)
      expect(wrapper.find('SaveTestCaseModal')).not.toBeNull()
    })

    it('renders SaveBlockModal', () => {
      const wrapper = shallow(<SaveModal editorStatus={'BLOCKS'} />)
      expect(wrapper.find('SaveBlockModal')).not.toBeNull()
    })

    it('renders SaveSuiteModal', () => {
      const wrapper = shallow(<SaveModal editorStatus={'SUITES'} />)
      expect(wrapper.find('SaveSuiteModal')).not.toBeNull()
    })
  })

  describe('SaveBlockModal', () => {
    it('renders', () => {
      const wrapper = shallow(
        <SaveBlockModal
          src={{}}
          saveEditingBlockAsExisted={jest.fn()}
          saveEditingBlockAsNew={jest.fn()}
          editNext={jest.fn()}
          selectProject={jest.fn()}
          project={{}}
          clearNext={jest.fn()}
          closeModal={jest.fn()}
          newSave={false}
          visible={true}
        />
      )
      expect(wrapper.find('GenericSaveModal')).not.toBeNull()
    })

    // TODO more tests ...
  })

  describe('SaveMultiSelectModal', () => {
    it('renders', () => {
      const wrapper = shallow(
        <SaveMultiSelectModal
          saveMultiSelectAsNewBlock={jest.fn()}
          closeModal={jest.fn()}
          visible={true}
        />
      )
      expect(wrapper.find('GenericSaveModal')).not.toBeNull()
    })

    // TODO more tests ...
  })

  describe('SaveTestCaseModal', () => {
    it('renders', () => {
      const wrapper = shallow(
        <SaveTestCaseModal
          src={{}}
          saveEditingAsExisted={jest.fn()}
          saveEditingAsNew={jest.fn()}
          editNext={jest.fn()}
          selectProject={jest.fn()}
          project={{}}
          clearNext={jest.fn()}
          closeModal={jest.fn()}
          newSave={false}
          visible={true}
        />
      )
      expect(wrapper.find('GenericSaveModal')).not.toBeNull()
    })

    // TODO more tests ...
  })

  describe('SaveSuiteModal', () => {
    it('renders', () => {
      const wrapper = shallow(
        <SaveSuiteModal
          src={{}}
          saveEditingSuiteAsExisted={jest.fn()}
          saveEditingSuiteAsNew={jest.fn()}
          editNext={jest.fn()}
          selectProject={jest.fn()}
          project={{}}
          clearNext={jest.fn()}
          closeModal={jest.fn()}
          newSave={false}
          visible={true}
        />
      )
      expect(wrapper.find('GenericSaveModal')).not.toBeNull()
    })

    // TODO more tests ...
  })
})
