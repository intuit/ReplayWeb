const model = {
  removeByProject: () => Promise.resolve(),
  listByProject: () => Promise.resolve([]),
  update: jest.fn().mockImplementation(() => Promise.resolve())
}

export default model
