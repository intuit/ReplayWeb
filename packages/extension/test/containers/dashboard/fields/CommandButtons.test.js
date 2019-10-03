jest.mock('../../../../src/actions', () => ({
  updateSelectedCommand: jest.fn().mockImplementation(() => 1)
}))

jest.mock('../../../../src/common/ipc/ipc_cs', () => {})

afterEach(() => {
  jest.clearAllMocks()
})

describe('CommandButtons store', () => {
  it('operates', () => {
    const mockConnect = jest.fn().mockImplementation(() => (component) => {})
    jest.doMock('react-redux', () => ({
      connect: mockConnect
    }))
    require('../../../../src/containers/dashboard/fields/CommandButtons')
    const [ mapStateToProps, mapDispatchToProps ] = mockConnect.mock.calls[0]

    const state = {
      editor: {
        editing: {
          meta: {
            selectedIndex: 0
          },
          commands: ['a'],
          filterCommands: [0]
        }
      }
    }
    let result = mapStateToProps(state)
    expect(result).toEqual({
      selectedCmd: 'a'
    })

    const mockDispatch = jest.fn().mockImplementation(() => true)
    result = mapDispatchToProps(mockDispatch)
    result.updateSelectedCommand({})

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledWith(1)
  })
})
