import { getSelector } from '../../src/utilities'

describe('getSelector', () => {
  it('should throw error for no parameters', () => {
    expect(getSelector).toThrow('Cannot read property \'indexOf\' of undefined')
  })
  it('should throw error for no parameters', () => {
    expect(getSelector.bind(null, 'invalidSelector')).toThrow('invalidSelector is not a valid selector')
  })
  it('should get selector for implicit xpath', () => {
    expect(getSelector('//html/body')).toBe('//html/body')
  })
  it('should get selector for explicit xpath', () => {
    expect(getSelector('xpath=//html/body')).toBe('//html/body')
  })
  it('should get selector for automation-id', () => {
    expect(getSelector('automation-id=testId')).toBe('[data-automation-id="testId"]')
  })
  it('should get selector for automationid', () => {
    expect(getSelector('automationid=testId')).toBe('[automationid="testId"]')
  })
  it('should get selector for data-auto-sel', () => {
    expect(getSelector('data-auto-sel=testId')).toBe('[data-auto-sel="testId"]')
  })
  it('should get selector for id', () => {
    expect(getSelector('id=testId')).toBe('//*[@id=\"testId\"]')
  })
  it('should get selector for id and escape :', () => {
    expect(getSelector('id=testId:1')).toBe('//*[@id=\"testId\\:1\"]')
  })
  it('should get selector for name', () => {
    expect(getSelector('name=testName')).toBe('[name="testName"]')
  })
  it('should get selector for identifier', () => {
    expect(getSelector('identifier=testId')).toBe('#testId')
  })
  it('should get selector for exact link', () => {
    expect(getSelector('link=exact:testLink')).toBe('=testLink')
  })
  it('should get selector for POS link', () => {
    expect(getSelector('link=test@POS=4')).toBe('=test')
  })
  it('should get selector for css', () => {
    expect(getSelector('css=testClass')).toBe('testClass')
  })
  it('should get selector for index', () => {
    expect(getSelector('index=1')).toBe('1')
  })
  it('should get selector for title', () => {
    expect(getSelector('title=testId')).toBe('.//*[contains(@title ,\"testId\")]')
  })
})
