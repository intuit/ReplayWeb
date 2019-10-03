import {
  makeHooks,
  __RewireAPI__ as rewireAPI
} from '../../src/index'

describe('plugins', () => {
  afterEach(() => {
    rewireAPI.__ResetDependency__('loadPlugin')
  })
  it('should make hooks', () => {
    const hooks = makeHooks()
    const mock = jest.fn()
    hooks.beforeCommand.tap('Test', mock)
    hooks.beforeCommand.promise({command: 'test', parameters: {}}, {})
    expect(mock).toHaveBeenCalled()
  })
  it('should apply plugins if they load', () => {
    const mock = jest.fn()
    rewireAPI.__Rewire__('loadPlugin', () => ({apply: mock}))
    const hooks = makeHooks(['test'])
    expect(mock).toHaveBeenCalledTimes(1)
  })
})
