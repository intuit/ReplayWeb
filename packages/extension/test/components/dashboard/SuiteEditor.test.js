import React from 'react'
import { cleanup, render } from '@testing-library/react'
import { shallow, mount } from 'enzyme'
import SuiteEditor from '../../../src/components/dashboard/SuiteEditor.jsx'

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const getComponent = (props = {}) => {
  /* eslint-disable react/prop-types */
  return (
    <SuiteEditor
      tests={props.tests || []}
      selectedTests={props.selectedTests || []}
      addTestToSuite={props.addTestToSuite || jest.fn()}
      name={props.name || ''}
      removeTestFromSuite={props.removeTestFromSuite || jest.fn()}
      /* eslint-enable react/prop-types */
    />
  )
}

const flattenOneLevel = arr => [].concat(...arr)

describe('SuiteEditor', () => {
  it('renders', () => {
    const { getByText, getAllByText } = render(getComponent())
    getByText('All Tests')
    getByText('Tests in suite:')
    expect(getAllByText('No data').length).toBe(2)
  })

  it('renders All Test and Tests In Suite columns', () => {
    const wrapper = shallow(getComponent())
    expect(wrapper.find({'test-id': "allTests"}).length).toBe(1)
    expect(wrapper.find({'test-id': "testsInSuite"}).length).toBe(1)
  })

  it('renders correct tests in proper columns', () => {
    const props = {
      tests: [
        {name: "test1", data: {commands: ["1", "2"]}},
        {name: "test2", data: {commands: ["1"]}},
        {name: "test3", data: {commands: []}},
      ],
      selectedTests: [
        "test2"
      ]
    }

    const testsNotSelected = props.tests.filter(test => !props.selectedTests.includes(test.name))

    const wrapper = mount(getComponent(props))

    // Test that all tests column renders the right amount of tests
    const allTestsRowTextNodes = wrapper.find({'test-id': 'allTests'}).find('.suiteRow').find('span')
    const expectedTextForAllTestsColumn = flattenOneLevel(
      testsNotSelected.map(
        test => [test.name, `${test.data.commands.length} commands`]
    ))
    expect(allTestsRowTextNodes.map(node => node.text())).toEqual(expectedTextForAllTestsColumn)

    const allTestRowButtons = wrapper.find({'test-id': 'allTests'}).find('.suiteRow').find('button')
    expect(allTestRowButtons.length).toBe(testsNotSelected.length)

    // Test that Tests In Suite column renders properly
    const testsInSuiteRowTextNodes = wrapper.find({'test-id': 'testsInSuite'}).find('.suiteRow').find('span')
    expect(testsInSuiteRowTextNodes.map(node => node.text())).toEqual(props.selectedTests)
    const testsInSuiteRowButtons = wrapper.find({'test-id': 'testsInSuite'}).find('.suiteRow').find('button')
    expect(testsInSuiteRowButtons.length).toBe(props.selectedTests.length)
  })

  it('correctly issues add and remove test suite callbacks', () => {
    const props = {
      tests: [
        {name: "test1", data: {commands: ["1", "2"]}},
      ],
      selectedTests: [
        "test2"
      ],
      addTestToSuite: jest.fn(),
      removeTestFromSuite: jest.fn(),
    }

    const wrapper = mount(getComponent(props))

    const allTestsFirstButton = wrapper.find({'test-id': 'allTests'}).find('.suiteRow').find('Button')
    const testsInSuiteFirstButton = wrapper.find({'test-id': 'testsInSuite'}).find('.suiteRow').find('Button')

    // Click the add to suite button
    expect(allTestsFirstButton.length).toBe(1)
    allTestsFirstButton.simulate('click')
    expect(props.addTestToSuite).toHaveBeenCalledTimes(1)
    expect(props.addTestToSuite).toHaveBeenLastCalledWith('test1', expect.anything())

    // click the remove from suite button
    expect(testsInSuiteFirstButton.length).toBe(1)
    testsInSuiteFirstButton.simulate('click')
    expect(props.removeTestFromSuite).toHaveBeenCalledTimes(1)
    expect(props.removeTestFromSuite).toHaveBeenLastCalledWith('test2', expect.anything())
  })
})
