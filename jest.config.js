module.exports = {
  collectCoverageFrom: ['packages/*/src/**/*.js', 'packages/*/src/**/*.jsx'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './target'
      }
    ]
  ],
  roots: ['<rootDir>/packages/'],
  projects: ['<rootDir>/packages/'],
  coverageReporters: ['lcov', 'text', 'cobertura'],
  testPathIgnorePatterns: ['/test/integration/'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/packages/extension/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/packages/extension/__mocks__/styleMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/setupEnzyme.js']
}
