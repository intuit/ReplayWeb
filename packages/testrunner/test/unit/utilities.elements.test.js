import {
  waitForElements,
  __RewireAPI__ as utilitiesRewire
} from '../../src/utilities'

describe('waitForElements', () => {
  afterEach(() => {
    utilitiesRewire.__ResetDependency__('getAndWaitForElement')
  })
  it('should get a single element', async () => {
    const mock = jest.fn(async el => el)
    utilitiesRewire.__Rewire__('getAndWaitForElement', mock)
    const els = await waitForElements(['id=target1'])
    expect(els).toEqual(['id=target1'])
    expect(mock).toBeCalledTimes(1)
  })
  it('should get a list of elements', async () => {
    const mock = jest.fn(async el => el)
    utilitiesRewire.__Rewire__('getAndWaitForElement', mock)
    const els = await waitForElements(['id=target1', 'css=someClass'])
    expect(els).toEqual(['id=target1', 'css=someClass'])
    expect(mock).toBeCalledTimes(2)
  })
})
