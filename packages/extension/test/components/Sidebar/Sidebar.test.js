import React from 'react'
import { cleanup, fireEvent, render, waitForElement } from '@testing-library/react'
import Sidebar from '../../../src/components/Sidebar/Sidebar.jsx'
import * as C from '../../../src/common/constant'

beforeEach(() => {
  global.browser = {}
})
afterEach(cleanup)

const renderSidebar = (overrides = {}) => {
  const {
    editing = { meta: { src: { name: '' } } },
    testCases = [],
    project = { name: '' },
    projects = [],
    player = { status: '' },
    status = '',
    blocks = [],
    suites = [],
    config = {},
    setNextTest = () => {},
    changeModalState = () => {},
    editTestCase = () => {},
    editNewTestCase = () => {},
    selectProject = () => {}
  } = overrides
  return render(
    <Sidebar
      editing={editing}
      testCases={testCases}
      project={project}
      projects={projects}
      player={player}
      status={status}
      blocks={blocks}
      suites={suites}
      config={config}
      setNextTest={setNextTest}
      changeModalState={changeModalState}
      editTestCase={editTestCase}
      editNewTestCase={editNewTestCase}
      selectProject={selectProject}
    />
  )
}

const checkToggle = async (labelText) => {
  const { getByText } = renderSidebar()
  let testCasesLabel = getByText(labelText)
  expect(testCasesLabel.closest('li').classList.contains('ant-menu-submenu-open')).toBe(true)
  fireEvent.click(testCasesLabel)
  testCasesLabel = await waitForElement(
    () => getByText(labelText),
    { getByText }
  )
  expect(testCasesLabel.closest('li').classList.contains('ant-menu-submenu-open')).toBe(false)
}

const checkMenuItems = (variableName) => {
  const data = {}
  data[variableName] = [
    { id: 1, name: `${variableName} 1` },
    { id: 2, name: `${variableName} 2` },
    { id: 3, name: `${variableName} 3` }
  ]
  const { queryByText } = renderSidebar(data)
  expect(queryByText(`${variableName} 1`)).not.toBeNull()
  expect(queryByText(`${variableName} 2`)).not.toBeNull()
  expect(queryByText(`${variableName} 3`)).not.toBeNull()
  expect(queryByText(`${variableName} 4`)).toBeNull()
}

describe('Sidebar', () => {
  it('renders with basic data', () => {
    const { container, getByText } = renderSidebar()
    const sider = container.querySelector('div.side-bar div')
    // assert that the default sidebar behavior is open
    expect(sider.classList.contains('ant-layout-sider-collapsed')).toBe(false)
    // assert that the expected menu items are present
    expect(getByText('Untitled')).not.toBeNull()
    expect(getByText('Test Cases')).not.toBeNull()
    expect(getByText('New Test')).not.toBeNull()
    expect(getByText('Blocks')).not.toBeNull()
    expect(getByText('New Block')).not.toBeNull()
    expect(getByText('Suites')).not.toBeNull()
    expect(getByText('New Suite')).not.toBeNull()
  })

  it('has sorted test case names', () => {
    const testCases = [
      { id: 1, name: 'Test Case c' },
      { id: 2, name: 'Test Case b' },
      { id: 3, name: 'Test Case a' }
    ]
    const { container, getByText, getAllByText } = renderSidebar({ testCases })
    expect(getByText('Test Case a')).not.toBeNull()
    expect(getByText('Test Case b')).not.toBeNull()
    expect(getByText('Test Case c')).not.toBeNull()
    const testCaseParts = getAllByText(/Test Case \w/)
    const testCaseNames = testCaseParts.map(p => p.innerHTML)
    expect(testCaseNames).toEqual(['Test Case a', 'Test Case b', 'Test Case c'])
  })

  it('shows which project is being edited', async () => {
    const projects = [
      { id: 1, name: 'Project 1' },
      { id: 2, name: 'Project 2' },
      { id: 3, name: 'Project 3' }
    ]
    const project = { id: 2, name: 'Project 2' }
    const selectProject = jest.fn()
    const {
      container,
      getAllByText,
      getByText,
      queryByText
    } = renderSidebar({ projects, project, selectProject })
    expect(queryByText('Project 1')).toBeNull()
    expect(queryByText('Project 2')).not.toBeNull()
    expect(queryByText('Project 3')).toBeNull()
    fireEvent.mouseOver(getByText('Project 2'))
    await waitForElement(
      () => getByText('Project 1'),
      { getByText }
    )
    expect(getAllByText('Project 2').length).toBe(2)
    expect(getByText('Project 1').closest('li').classList.contains('editing')).toBe(false)
    expect(getAllByText('Project 2')[1].closest('li').classList.contains('editing')).toBe(true)
    expect(getByText('Project 3').closest('li').classList.contains('editing')).toBe(false)
  })

  it('can collapse the sidebar', async () => {
    const { container } = renderSidebar()
    const siderToggle = container.querySelector('i.anticon.anticon-left')
    expect(siderToggle).not.toBeNull()
    fireEvent.click(siderToggle)
    // Layout.Sider reacts asynchronously, so have to wait for it
    const sider = await waitForElement(
      () => container.querySelector('div.side-bar div'),
      { container }
    )
    // the sidebar should be collapsed after clicking the toggle button once
    expect(sider.classList.contains('ant-layout-sider-collapsed')).toBe(true)
  })

  describe('toggleable sections', () => {
    it('can toggle the test cases', async () => {
      await checkToggle('Test Cases')
    })

    it('can toggle the blocks', async () => {
      await checkToggle('Blocks')
    })

    it('can toggle the suites', async () => {
      await checkToggle('Suites')
    })
  })

  // the 3 next tests assert that, when supplied, the sidebar is populated with data

  describe('displays listed items', () => {
    it('displays test cases', () => {
      checkMenuItems('testCases')
    })

    it('displays blocks', () => {
      checkMenuItems('blocks')
    })

    it('displays suites', () => {
      checkMenuItems('suites')
    })
  })

  describe('changeTestCase', () => {
    it('does nothing if status is wrong', async () => {
      const testCases = [{ id: 1, name: 'Test case 1' }]
      const component = new Sidebar({ testCases, status: '' })
      const result = await component.changeTestCase(1)
      expect(result).toBe(false)
    })

    it('succeeds if editing meta is set', async () => {
      const testCases = [{ id: 1, name: 'Test case 1' }]
      const status = C.APP_STATUS.NORMAL
      const editing = {
        meta: {
          src: {
            id: 1
          }
        }
      }
      const component = new Sidebar({ testCases, status, editing })
      const result = await component.changeTestCase(1)
      expect(result).toBe(true)
    })

    it('returns false if hasUnsaved', async () => {
      const testCases = [{ id: 1, name: 'Test case 1' }]
      const status = C.APP_STATUS.NORMAL
      const editing = {
        meta: {
          hasUnsaved: true
        }
      }
      const setNextTest = jest.fn()
      const changeModalState = jest.fn()
      const component = new Sidebar({ testCases, status, editing, setNextTest, changeModalState })
      const result = await component.changeTestCase(1)
      expect(result).toBe(false)
      expect(setNextTest).toHaveBeenCalledWith(1)
      expect(changeModalState).toHaveBeenCalledWith('save', true)
    })

    it('returns true and edits test case', async () => {
      const testCases = [{ id: 1, name: 'Test case 1' }]
      const status = C.APP_STATUS.NORMAL
      const editing = { meta: {} }
      const editTestCase = jest.fn()
      const component = new Sidebar({ testCases, status, editing, editTestCase })
      const result = await component.changeTestCase(1)
      expect(result).toBe(true)
      expect(editTestCase).toHaveBeenCalledWith(1)
    })

    it('returns true and edits new test case', async () => {
      const testCases = [{ id: 1, name: 'Test case 1' }]
      const status = C.APP_STATUS.NORMAL
      const editing = { meta: {} }
      const editNewTestCase = jest.fn()
      const component = new Sidebar({ testCases, status, editing, editNewTestCase })
      const result = await component.changeTestCase(null)
      expect(result).toBe(true)
      expect(editNewTestCase).toHaveBeenCalled()
    })
  })

  describe('changeBlock', () => {
    it('does nothing if status is wrong', async () => {
      const testCases = [{ id: 1, name: 'Test case 1' }]
      const component = new Sidebar({ testCases, status: '' })
      const result = await component.changeBlock(1)
      expect(result).toBe(false)
    })

    it('succeeds if editing meta is set', async () => {
      const testCases = [{ id: 1, name: 'Test case 1' }]
      const status = C.APP_STATUS.NORMAL
      const editing = {
        meta: {
          src: {
            id: 1
          }
        }
      }
      const component = new Sidebar({ testCases, status, editing })
      const result = await component.changeBlock(1)
      expect(result).toBe(true)
    })

    it('returns false if hasUnsaved', async () => {
      const testCases = [{ id: 1, name: 'Test case 1' }]
      const status = C.APP_STATUS.NORMAL
      const editing = {
        meta: {
          hasUnsaved: true
        }
      }
      const setNextBlock = jest.fn()
      const changeModalState = jest.fn()
      const component = new Sidebar({ testCases, status, editing, setNextBlock, changeModalState })
      const result = await component.changeBlock(1)
      expect(result).toBe(false)
      expect(setNextBlock).toHaveBeenCalledWith(1)
      expect(changeModalState).toHaveBeenCalledWith('save', true)
    })

    it('returns true and edits test case', async () => {
      const testCases = [{ id: 1, name: 'Test case 1' }]
      const status = C.APP_STATUS.NORMAL
      const editing = { meta: {} }
      const editBlock = jest.fn()
      const component = new Sidebar({ testCases, status, editing, editBlock })
      const result = await component.changeBlock(1)
      expect(result).toBe(true)
      expect(editBlock).toHaveBeenCalledWith(1)
    })

    it('returns true and edits new test case', async () => {
      const testCases = [{ id: 1, name: 'Test case 1' }]
      const status = C.APP_STATUS.NORMAL
      const editing = { meta: {} }
      const changeModalState = jest.fn()
      const component = new Sidebar({ testCases, status, editing, changeModalState })
      const result = await component.changeBlock(null)
      expect(result).toBe(true)
      expect(changeModalState).toHaveBeenCalledWith('newBlockModal', true)
    })
  })

  describe('changeSuite', () => {
    it('does nothing if status is wrong', async () => {
      const testCases = [{ id: 1, name: 'Test case 1' }]
      const component = new Sidebar({ testCases, status: '' })
      const result = await component.changeSuite(1)
      expect(result).toBe(false)
    })

    it('succeeds if editing meta is set', async () => {
      const testCases = [{ id: 1, name: 'Test case 1' }]
      const status = C.APP_STATUS.NORMAL
      const editing = {
        meta: {
          src: {
            id: 1
          }
        }
      }
      const component = new Sidebar({ testCases, status, editing })
      const result = await component.changeSuite(1)
      expect(result).toBe(true)
    })

    it('returns false if hasUnsaved', async () => {
      const testCases = [{ id: 1, name: 'Test case 1' }]
      const status = C.APP_STATUS.NORMAL
      const editing = {
        meta: {
          hasUnsaved: true
        }
      }
      const setNextSuite = jest.fn()
      const changeModalState = jest.fn()
      const component = new Sidebar({ testCases, status, editing, setNextSuite, changeModalState })
      const result = await component.changeSuite(1)
      expect(result).toBe(false)
      expect(setNextSuite).toHaveBeenCalledWith(1)
      expect(changeModalState).toHaveBeenCalledWith('save', true)
    })

    it('returns true and edits test case', async () => {
      const testCases = [{ id: 1, name: 'Test case 1' }]
      const status = C.APP_STATUS.NORMAL
      const editing = { meta: {} }
      const editSuite = jest.fn()
      const component = new Sidebar({ testCases, status, editing, editSuite })
      const result = await component.changeSuite(1)
      expect(result).toBe(true)
      expect(editSuite).toHaveBeenCalledWith(1)
    })

    it('returns true and edits new test case', async () => {
      const testCases = [{ id: 1, name: 'Test case 1' }]
      const status = C.APP_STATUS.NORMAL
      const editing = { meta: {} }
      const editNewSuite = jest.fn()
      const component = new Sidebar({ testCases, status, editing, editNewSuite })
      const result = await component.changeSuite(null)
      expect(result).toBe(true)
      expect(editNewSuite).toHaveBeenCalled()
    })
  })

  it('onDoubleClick does nothing if the status is wrong', () => {
    const status = ''
    const changeTestCase = jest.fn()
    const component = new Sidebar({ status, changeTestCase })
    component.onDoubleClick(1)
    expect(changeTestCase).not.toHaveBeenCalled()
  })

  it('onDoubleClick calls callback after changeTestCase', () => {
    /*
      This would be a good opportunity to use https://jestjs.io/docs/en/timer-mocks, but
      the utilization of 'setTimeout' is behind a promise that isn't returned, so
      the internal functionality of the function is asynchronous, which limits the
      ability to test it.

      A promise mock could be used instead of this object with a 'then' field pointing
      to a mocked function, but then even less information about the function working would
      be available.
    */
    const status = C.APP_STATUS.NORMAL
    const changeTestCaseInner = { then: jest.fn() }
    const changeTestCase = jest.fn(id => changeTestCaseInner)
    const component = new Sidebar({ status })
    component.changeTestCase = changeTestCase
    component.onDoubleClick(1)
    expect(changeTestCase).toHaveBeenCalledWith(1)
    expect(changeTestCaseInner.then).toHaveBeenCalled()
  })

  it('onClickNewProject', () => {
    const changeModalState = jest.fn()
    const component = new Sidebar({ changeModalState })
    component.onClickNewProject()
    expect(changeModalState).toHaveBeenCalledWith('projectSetup', true)
  })

  it('onClickEditProject', () => {
    const editProject = jest.fn()
    const changeModalState = jest.fn()
    const component = new Sidebar({ editProject, changeModalState })
    component.onClickEditProject(1)
    expect(editProject).toHaveBeenCalledWith(1)
    expect(changeModalState).toHaveBeenCalledWith('projectSetup', true)
  })

  it('changeProject', () => {
    const selectProject = jest.fn()
    const project = { id: 1, name: 'Project 1' }
    const projects = [project]
    const component = new Sidebar({ selectProject, projects })
    component.changeProject({ key: 1 })
    expect(selectProject).toHaveBeenCalledWith(project)
  })

  /*
    Unfortunately for the next two tests, no solution was found for
    mocking antd's internal 'Modal' component such that assertions
    could be made on which of the modal types were being returned
    by the Sidebar component, so the most that these tests can do
    is assert that the modal function type is returned.
  */

  it('onClickDeleteProject with no projects', () => {
    const projects = []
    const component = new Sidebar({ projects })
    const resp = component.onClickDeleteProject({})
    expect(resp).not.toBeNull()
    expect(resp.destroy).not.toBeNull()
  })

  it('onClickDeleteProject with some projects', () => {
    const projects = [{}]
    const component = new Sidebar({ projects })
    const resp = component.onClickDeleteProject({})
    expect(resp).not.toBeNull()
    expect(resp.destroy).not.toBeNull()
  })
})
