import React from 'react'

jest.mock('../../../src/actions', () => ({
  updateSelectedCommand: jest.fn().mockImplementation(() => 1),
  startInspecting: jest.fn().mockImplementation(() => 2),
  stopInspecting: jest.fn().mockImplementation(() => 3),
  setInspectTarget: jest.fn().mockImplementation(() => 4)
}))

jest.mock('../../../src/common/ipc/ipc_cs', () => {})

// eslint-disable-next-line react/display-name
jest.mock('../../../src/components/dashboard/CommandOptions', () => () => (
  <p>CommandOptions</p>
))

afterEach(() => {
  jest.clearAllMocks()
})

describe('CommandButtons store', () => {
  it('operates', () => {
    const mockConnect = jest.fn().mockImplementation(() => component => {})
    jest.doMock('react-redux', () => ({
      connect: mockConnect
    }))
    require('../../../src/containers/dashboard/CommandOptions')
    const [mapStateToProps, mapDispatchToProps] = mockConnect.mock.calls[0]

    const state = {
      app: {
        status: 'a',
        config: 'b'
      },
      editor: {
        editing: {
          meta: {
            selectedIndex: 0
          }
        },
        clipboard: 'd',
        selectedCmds: 'e'
      },
      player: 'f'
    }
    let result = mapStateToProps(state)
    expect(result).toEqual({
      status: 'a',
      editor: {
        editing: { meta: expect.any(Object) },
        clipboard: 'd',
        selectedCmds: 'e'
      },
      editing: { meta: { selectedIndex: 0 } },
      clipboard: 'd',
      player: 'f',
      config: 'b',
      selectedCmds: 'e',
      selectedCommand: 0
    })

    const mockDispatch = jest.fn().mockImplementation(() => true)
    result = mapDispatchToProps(mockDispatch)
    result.updateSelectedCommand()
    result.startInspecting()
    result.stopInspecting()
    result.setInspectTarget()

    expect(mockDispatch).toHaveBeenCalledTimes(4)
    expect(mockDispatch).toHaveBeenNthCalledWith(1, 1)
    expect(mockDispatch).toHaveBeenNthCalledWith(2, 2)
    expect(mockDispatch).toHaveBeenNthCalledWith(3, 3)
    expect(mockDispatch).toHaveBeenNthCalledWith(4, 4)
  })
})
