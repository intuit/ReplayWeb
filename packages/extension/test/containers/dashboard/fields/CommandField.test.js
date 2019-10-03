jest.mock('../../../../src/actions', () => ({
  updateSelectedCommand: jest.fn().mockImplementation(() => 1),
  startInspecting: jest.fn().mockImplementation(() => 2),
  stopInspecting: jest.fn().mockImplementation(() => 3),
  setInspectTarget: jest.fn().mockImplementation(() => 4)
}))

jest.mock('../../../../src/common/ipc/ipc_cs', () => {})

afterEach(() => {
  jest.clearAllMocks()
})

describe('CommandField store', () => {
  it('operates', () => {
    const mockConnect = jest.fn().mockImplementation(() => (component) => {})
    jest.doMock('react-redux', () => ({
      connect: mockConnect
    }))
    require('../../../../src/containers/dashboard/fields/CommandField')
    const [ mapStateToProps, mapDispatchToProps ] = mockConnect.mock.calls[0]

    const state = {
      editor: {
        editing: {
          meta: {
            selectedIndex: 0
          },
          filterCommands: ['a'],
          commands: ['b']
        },
        blocks: ['c'],
        inspectTarget: 'd'
      },
      player: {
        status: 'RUNNING'
      },
      app: {
        status: 'INSPECTOR'
      }
    }
    let result = mapStateToProps(state)
    expect(result).toEqual({
      selectedCmd: 'a',
      commands: ['b'],
      isCmdEditable: false,
      editing: {
        meta: {
          selectedIndex: 0
        },
        filterCommands: ['a'],
        commands: ['b']
      },
      filterCommands: ['a'],
      blocks: ['c'],
      selectedIndex: 0,
      isInspecting: true,
      inspectTarget: 'd'
    })

    const mockDispatch = jest.fn().mockImplementation(() => true)
    result = mapDispatchToProps(mockDispatch)
    result.updateSelectedCommand({}, {})
    result.startInspecting()
    result.stopInspecting()
    result.setInspectTarget('t')

    expect(mockDispatch).toHaveBeenCalledTimes(4)
    expect(mockDispatch).toHaveBeenNthCalledWith(1, 1)
    expect(mockDispatch).toHaveBeenNthCalledWith(2, 2)
    expect(mockDispatch).toHaveBeenNthCalledWith(3, 3)
    expect(mockDispatch).toHaveBeenNthCalledWith(4, 4)
  })
})
