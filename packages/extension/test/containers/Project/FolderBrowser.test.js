jest.mock('../../../src/actions', () => ({
  listDirectory: jest.fn().mockImplementation(() => 1),
  changeModalState: jest.fn().mockImplementation(() => 2),
  selectProjectFolder: jest.fn().mockImplementation(() => 3)
}))

afterEach(() => {
  jest.clearAllMocks()
})

describe('FolderBrowser store', () => {
  it('operates', () => {
    const mockConnect = jest.fn().mockImplementation(() => component => {})
    jest.doMock('react-redux', () => ({
      connect: mockConnect
    }))
    require('../../../src/containers/Project/FolderBrowser')
    const [mapStateToProps, mapDispatchToProps] = mockConnect.mock.calls[0]

    const state = {
      files: {
        folder: 'a',
        error: null,
        contents: 'b'
      },
      modals: {
        browser: 'c'
      },
      projectSetup: {
        projectPath: 'a'
      }
    }
    let result = mapStateToProps(state)
    expect(result).toEqual({
      folder: 'a',
      error: null,
      contents: 'b',
      visible: 'c',
      top: true
    })

    const mockDispatch = jest.fn().mockImplementation(() => true)
    result = mapDispatchToProps(mockDispatch)
    result.listDirectory('d')
    result.closeModal()
    result.selectFolder()

    expect(mockDispatch).toHaveBeenCalledTimes(3)
    expect(mockDispatch).toHaveBeenNthCalledWith(1, 1)
    expect(mockDispatch).toHaveBeenNthCalledWith(2, 2)
    expect(mockDispatch).toHaveBeenNthCalledWith(3, 3)
  })
})
