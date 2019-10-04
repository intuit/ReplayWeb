import {
  tryRequire,
  loadPlugin,
  __RewireAPI__ as utilitiesRewire
} from '../../src/utilities'
jest.mock('realPlugin')
describe('loadPlugin', () => {
  afterEach(() => {
    utilitiesRewire.__ResetDependency__('tryRequire')
  })
  it('should load a string plugin definition', () => {
    const mock = jest.fn()
    utilitiesRewire.__Rewire__('tryRequire', mock)
    const plugin = loadPlugin('testplugin')
    expect(mock).toHaveBeenCalledWith('testplugin', {})
  })
  it('should load a array plugin definition', () => {
    const mock = jest.fn()
    utilitiesRewire.__Rewire__('tryRequire', mock)
    const plugin = loadPlugin(['testplugin', { option: 'value' }])
    expect(mock).toHaveBeenCalledWith('testplugin', { option: 'value' })
  })
  it('should throw an error for an invalid plugin definition', () => {
    const mock = jest.spyOn(console, 'error')
    utilitiesRewire.__Rewire__('tryRequire', mock)
    expect(loadPlugin).toThrow('Invalid plugin format: undefined')
    expect(mock).toHaveBeenCalled()
  })
})
describe('tryRequire', () => {
  it('should throw an error if it cant find the package', () => {
    expect(tryRequire.bind(null, 'fakepackage')).toThrow()
  })
  it('should construct a plugin if the package is found', () => {
    global.require = () =>
      class FakePlugin {
        constructor(parameter) {
          this.data = parameter
        }
      }
    const p = tryRequire('realPlugin', 'parameterValue')
    expect(p.data).toBe('parameterValue')
  })
})
