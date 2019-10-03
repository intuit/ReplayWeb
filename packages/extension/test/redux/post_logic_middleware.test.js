import postLogicMiddleWare from '../../src/redux/post_logic_middleware'

describe('postLogicMiddleWare', () => {
  it('does not call setTimeout if post is null', () => {
    jest.useFakeTimers()
    const next = jest.fn().mockImplementation(() => 'retVal')
    const action = { post: null }
    const resp = postLogicMiddleWare()({})(next)(action)
    expect(resp).toBe('retVal')
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(action)
    expect(setTimeout).not.toHaveBeenCalled()
  })

  it('calls setTimeout if post is a function', () => {
    jest.useFakeTimers()
    const next = jest.fn().mockImplementation(() => 'retVal')
    const action = { post: () => {} }
    const resp = postLogicMiddleWare()({})(next)(action)
    expect(resp).toBe('retVal')
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(action)
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })
})
