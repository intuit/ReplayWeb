const model = {
  insert: () => Promise.resolve(Math.random()),
  get: () => Promise.resolve({
    name: 'Test',
    testPath: '/tests',
    blockPath: '/blocks',
    projectPath: '/'
  }),
  update: () => Promise.resolve(),
  remove: () => Promise.resolve()
}

export default model
