const gitP = jest.genMockFromModule('simple-git/promise')
gitP.constructor = () => ({})
export default gitP
