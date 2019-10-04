jest.mock('../../../src/actions', () => ({
  updateProject: jest.fn().mockImplementation(() => 1),
  clearProjectSetup: jest.fn().mockImplementation(() => 2),
  changeModalState: jest.fn().mockImplementation(() => 3),
  setPathPurpose: jest.fn().mockImplementation(() => 4),
  createProject: jest.fn().mockImplementation(() => 5),
  checkForExistingConfig: jest.fn().mockImplementation(() => 6)
}))

afterEach(() => {
  jest.clearAllMocks()
})

describe('ProjectModal store', () => {
  it('operates', () => {
    const mockConnect = jest.fn().mockImplementation(() => component => {})
    jest.doMock('react-redux', () => ({
      connect: mockConnect
    }))
    require('../../../src/containers/Project/ProjectModal')
    const [mapStateToProps, mapDispatchToProps] = mockConnect.mock.calls[0]

    const state = {
      modals: {
        projectSetup: 'a'
      },
      projectSetup: {
        testPath: 'b',
        blockPath: 'c',
        suites: ['d'],
        projectPath: 'e',
        existingConfig: true,
        id: 'f',
        name: 'g'
      },
      editor: {
        projects: ['h']
      }
    }
    let result = mapStateToProps(state)
    expect(result).toEqual({
      visible: 'a',
      testPath: 'b',
      blockPath: 'c',
      suites: ['d'],
      projectPath: 'e',
      existingConfig: true,
      firstTime: false,
      id: 'f',
      name: 'g'
    })

    const mockDispatch = jest.fn().mockImplementation(() => true)
    result = mapDispatchToProps(mockDispatch)
    result.createProject()
    result.updateProject()
    result.clearProjectSetup()
    result.closeModal()
    result.checkForExistingConfig()
    result.browseProject()
    result.browseTest()
    result.browseBlock()

    expect(mockDispatch).toHaveBeenCalledTimes(12)
    expect(mockDispatch).toHaveBeenNthCalledWith(1, 5)
    expect(mockDispatch).toHaveBeenNthCalledWith(2, 1)
    expect(mockDispatch).toHaveBeenNthCalledWith(3, 2)
    expect(mockDispatch).toHaveBeenNthCalledWith(4, 3)
    expect(mockDispatch).toHaveBeenNthCalledWith(5, {
      type: 'PROJECT_PATH',
      path: undefined
    })
    expect(mockDispatch).toHaveBeenNthCalledWith(6, 6)
    expect(mockDispatch).toHaveBeenNthCalledWith(7, 4)
    expect(mockDispatch).toHaveBeenNthCalledWith(8, 3)
    expect(mockDispatch).toHaveBeenNthCalledWith(9, 4)
    expect(mockDispatch).toHaveBeenNthCalledWith(10, 3)
    expect(mockDispatch).toHaveBeenNthCalledWith(11, 4)
    expect(mockDispatch).toHaveBeenNthCalledWith(12, 3)
  })
})
