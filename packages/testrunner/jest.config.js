module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  reporters: ['default', 'jest-junit'],
  coverageReporters: ['json', 'lcov', 'text', 'cobertura']
}
