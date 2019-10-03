import { removeArrayItem } from '../../src/common/utils'

describe('utils', () => {
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
