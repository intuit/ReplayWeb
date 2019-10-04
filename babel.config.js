module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-react'
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
  env: {
    test: {
      plugins: ['rewire']
    }
  },
  overrides: [
    {
      test: /.*packages\/.*plugin?\//,
      plugins: ['add-module-exports']
    }
  ]
}
