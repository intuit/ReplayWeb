import { Provider, createStore } from '../../src/redux/index'

describe('redux index', () => {
  it('returns the expected', () => {
    expect(Provider).not.toBeNull()
    expect(createStore).not.toBeNull()
  })
})
