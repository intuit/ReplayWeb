import {getExecElString} from '../../src/utilities'

describe('getExecElString', () => {
  it('should get exec string for xpath selector', () => {
    const selector = '//html/body'
    expect(getExecElString(selector)).toBe('document.evaluate(\`//html/body\`, document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0)')
  })
  it('should get exec string for regular selector', () => {
    const selector = '#test'
    expect(getExecElString(selector)).toBe('document.querySelector(\`#test\`)')
  })
  it('should get exec string for regular selector and escape \\: sequences', () => {
    const selector = '#test\\:2'
    expect(getExecElString(selector)).toBe('document.querySelector(\`#test\\\\:2\`)')
  })
})
