import saveScreen from '../../src/common/capture_screenshot.js'

jest.mock('../../src/common/filesystem', () => ({
  writeFile: jest.fn().mockImplementation(() => {
    return Promise.resolve()
  })
}))

jest.mock('../../src/common/web_extension', () => ({
  windows: {
    getLastFocused: jest.fn().mockImplementation(() => {
      return Promise.resolve({ id: 1 })
    })
  },
  tabs: {
    captureVisibleTab: jest.fn().mockImplementation(() => {
      return Promise.resolve('a:b;c,YWJj')
    }),
    query: jest.fn().mockImplementation(() => {
      return Promise.resolve([{ title: 'a b c' }])
    })
  }
}))

afterEach(() => {
  jest.clearAllMocks()
})

describe('capture_screenshot', () => {
  it('does not throw any errors', async () => {
    await saveScreen()
  })
})
