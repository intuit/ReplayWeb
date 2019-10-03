import promiseMiddleWare from '../../src/redux/promise_middleware'

describe('promiseMiddleWare', () => {
  it('calls next with just the action if promise is null', () => {
    const next = jest.fn()
    const action = {
      promise: null,
      types: [1, 2, 3],
      foo: 'bar'
    }
    const resp = promiseMiddleWare()({})(next)(action)
    expect(next).toHaveBeenCalledWith(action)
  })

  it('calls next with multiple args if promise is a fn', () => {
    const next = jest.fn()
    const then = jest.fn()
    const promise = jest.fn().mockImplementation(() => ({ then }))
    const action = {
      promise,
      types: [1, 2, 3],
      foo: 'bar'
    }
    const resp = promiseMiddleWare()({})(next)(action)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith({ foo: 'bar', type: 1 })
    expect(promise).toHaveBeenCalledTimes(1)
    expect(then).toHaveBeenCalledTimes(1)
  })
})
