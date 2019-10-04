import sendKeys, {
  __RewireAPI__ as keysRewire
} from '../../src/common/send_keys'

afterEach(() => {
  keysRewire.__ResetDependency__('splitStringToChars')
  keysRewire.__ResetDependency__('getKeyStrokeAction')
})

describe('sendKeys', () => {
  it('handles a simple case', () => {
    let splitStringToCharsCounter = 0
    keysRewire.__Rewire__('splitStringToChars', () => {
      splitStringToCharsCounter++
      return []
    })
    keysRewire.__Rewire__('getKeyStrokeAction', () => {
      throw new Error('should not call getKeyStrokeAction')
    })
    const focusMock = jest.fn()
    const target = {
      focus: focusMock,
      value: 'abc'
    }
    const res = sendKeys(target, '')
    expect(res).toBe(undefined)
    expect(splitStringToCharsCounter).toBe(1)
    expect(focusMock).toHaveBeenCalledTimes(1)
  })

  // TODO more tests ...
})
