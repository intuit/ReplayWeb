describe('fs', () => {
  it('throws an error when not supported', () => {
    try {
      require('../../src/common/filesystem.js')
      expect(true).toBe(false)
    } catch (err) {
      expect(err.toString()).toMatch(/requestFileSystem not supported/)
    }
  })

  it('does not throw an error when supported', () => {
    window.webkitRequestFileSystem = true
    require('../../src/common/filesystem.js')
  })
})
