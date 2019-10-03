import {log} from '../../src/utilities'

describe('log', () => {
  it('should log if verbose', () => {
    let logged = false
    global.console.log = () => (logged = true)
    log('a', true)
    expect(logged).toBe(true)
  })
  it('should not log if not verbose', () => {
    let logged = false
    global.console.log = () => (logged = true)
    log('a', false)
    expect(logged).toBe(false)
  })
  it('should not log when not given verbose arg', () => {
    let logged = false
    global.console.log = () => (logged = true)
    log('a')
    expect(logged).toBe(false)
  })
})
