import loadAllPlugins, {
  setupRegister,
  __RewireAPI__ as pluginRewire
} from '../src/index'

afterEach(() => {
  jest.clearAllMocks()
  pluginRewire.__ResetDependency__('fetch')
  pluginRewire.__ResetDependency__('vm')
})

describe('plugin_manager', () => {
  describe('setupRegister', () => {
    it('sets plugin', () => {
      const plugins = {}
      const plugin = { meta: { name: 'test' } }
      setupRegister(plugins)(plugin)
      expect(plugins).toEqual({
        test: plugin
      })
    })
  })
  describe('loadAllPlugins', () => {
    it('loads data', async () => {
      const fetchMock = jest.fn().mockReturnValue(Promise.resolve({
        text: () => Promise.resolve('content')
      }))
      const vmMock = jest.fn().mockReturnValue(Promise.resolve())
      pluginRewire.__Rewire__('fetch', fetchMock)
      pluginRewire.__Rewire__('vm', {
        runInNewContext: vmMock
      })
      const registerMock = jest.fn()
      const result = await loadAllPlugins(['some_url'])
      expect(result).toEqual({})
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith('some_url')
      expect(vmMock).toHaveBeenCalledTimes(1)
      expect(vmMock).toHaveBeenCalledWith('content', expect.any(Object))
      expect(registerMock).not.toHaveBeenCalled()
    })
  })
})
