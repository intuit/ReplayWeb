import {
  asyncUntil,
  uid,
  pick,
  filtering,
  removeArrayItem
} from '../../src/common/utils'

describe('asyncUntil', () => {
  it('should return error if expired', () => {
    try {
      asyncUntil('name', 'check', 1000, 1, 'test error message')
      expect(true).toBe(false)
    } catch (err) {
      expect(err.toString()).toMatch("test error message")
    }
  })
})

describe('removeArrayItem', () => {
  it('should immutably remove the first item from an array', () => {
    const array = ['a', 'b', 'c', 'd']
    expect(removeArrayItem(array, 'a')).toEqual(['b', 'c', 'd'])
    expect(array).toEqual(['a', 'b', 'c', 'd'])
  })
  it('should immutably remove an item from an array', () => {
    const array = ['a', 'b', 'c', 'd']
    expect(removeArrayItem(array, 'b')).toEqual(['a', 'c', 'd'])
    expect(array).toEqual(['a', 'b', 'c', 'd'])
  })
  it('should not remove an item from that doesnt exist in array', () => {
    const array = ['a', 'b', 'c', 'd']
    expect(removeArrayItem(array, 'e')).toEqual(['a', 'b', 'c', 'd'])
    expect(array).toEqual(['a', 'b', 'c', 'd'])
  })
})

describe('pick', () => {
  it('should return the passed in object with only certains keys', () => {
    const keys = ['a', 'b', 'c']
    const obj = {'a':'1', 'b':'2', 'c':'3', 'd':'4'}
    expect(pick(keys, obj)).toEqual({'a':'1', 'b':'2', 'c':'3'})
    expect(keys).toEqual(['a', 'b', 'c'])
  })
  it('should return same object if it has the same keys', () => {
    const keys = ['a', 'b', 'c']
    const obj = {'a':'1', 'b':'2', 'c':'3'}
    expect(pick(keys, obj)).toEqual({'a':'1', 'b':'2', 'c':'3'})
    expect(keys).toEqual(['a', 'b', 'c'])
  })
  it('should return empty object if an empty object is passed in', () => {
    const keys = ['a', 'b', 'c']
    const obj = {}
    expect(pick(keys, obj)).toEqual({})
    expect(keys).toEqual(['a', 'b', 'c'])
  })
})

describe('uid', () => {
  it('should product a new uid', () => {
    expect(uid()).toContain('.')
  })
})

describe('filtering', () => {
  const commands = ['commands', 'morecommands']
  it('should filter commands with regex', () => {
    expect(filtering(commands, '')).toBeTruthy()
  })
})
