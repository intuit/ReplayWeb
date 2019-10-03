import { collapseExpandedTestCase } from '../../src/common/blocks.js'

describe('collapseExpandedTestCase', () => {
  it('returns empty when nothing passed in', () => {
    const res = collapseExpandedTestCase([])
    expect(res).toEqual([])
  })

  it('expands the data', () => {
    const commands = [
      { isBlock: false, name: 'foo' },
      { isBlock: true, name: 'bar' },
      { isBlock: false, name: 'baz' }
    ]
    const expected = [
      { isBlock: false, name: 'foo', expandedIndex: 0 },
      { isBlock: true, name: 'bar', expandedIndex: 1 },
      { isBlock: false, name: 'baz', expandedIndex: 2 }
    ]
    const res = collapseExpandedTestCase(commands)
    expect(res).toEqual(expected)
  })
})
