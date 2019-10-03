import React from 'react'

jest.mock('../../../src/actions', () => ({
  selectCommand: jest.fn().mockImplementation(() => 1),
  removeCommand: jest.fn().mockImplementation(() => 2),
  insertCommand: jest.fn().mockImplementation(() => 3),
  reorderCommand: jest.fn().mockImplementation(() => 4),
  filterCommands: jest.fn().mockImplementation(() => 5),
  multiSelect: jest.fn().mockImplementation(() => 6),
  removeSelected: jest.fn().mockImplementation(() => 7),
  groupSelect: jest.fn().mockImplementation(() => 8),
  showContextMenu: jest.fn().mockImplementation(() => 9)
}))

jest.mock('../../../src/common/ipc/ipc_cs', () => {})

// eslint-disable-next-line react/display-name
jest.mock('../../../src/components/dashboard/CommandTable', () => () => <p>CommandTable</p>)

afterEach(() => {
  jest.clearAllMocks()
})

describe('CommandButtons store', () => {
  it('operates', () => {
    const mockConnect = jest.fn().mockImplementation(() => () => {})
    jest.doMock('react-redux', () => ({
      connect: mockConnect
    }))
    require('../../../src/containers/dashboard/CommandTable')
    const [ mapStateToProps, mapDispatchToProps ] = mockConnect.mock.calls[0]

    const state = {
      editor: {
        editing: {
          meta: {
            selectedIndex: 0
          }
        },
        searchText: ''
      },
      player: {}
    }
    let result = mapStateToProps(state)
    expect(result).toEqual({
      editing: { meta: { selectedIndex: 0 } },
      player: {},
      editor: { editing: { meta: expect.any(Object) }, searchText: '' },
      filterCommands: { meta: { selectedIndex: 0 } },
      searchText: '',
      selectedCommand: 0
    })

    const mockDispatch = jest.fn().mockImplementation(() => true)
    result = mapDispatchToProps(mockDispatch)
    result.selectCommand()
    result.removeCommand()
    result.insertCommand()
    result.reorderCommand()
    result.filterCommands()
    result.removeSearchText()
    result.multiSelect()
    result.groupSelect()
    result.removeSelected()
    result.showContextMenu()

    expect(mockDispatch).toHaveBeenCalledTimes(10)
    expect(mockDispatch).toHaveBeenNthCalledWith(1, 1)
    expect(mockDispatch).toHaveBeenNthCalledWith(2, 2)
    expect(mockDispatch).toHaveBeenNthCalledWith(3, 3)
    expect(mockDispatch).toHaveBeenNthCalledWith(4, 4)
    expect(mockDispatch).toHaveBeenNthCalledWith(5, 5)
    expect(mockDispatch).toHaveBeenNthCalledWith(6, 5)
    expect(mockDispatch).toHaveBeenNthCalledWith(7, 6)
    expect(mockDispatch).toHaveBeenNthCalledWith(8, 8)
    expect(mockDispatch).toHaveBeenNthCalledWith(9, 7)
    expect(mockDispatch).toHaveBeenNthCalledWith(10, 9)
  })
})
