import { initialState } from reducer from '../../src/reducers/files'

import { types } from '../../src/actions/action_types'
import * as C from '../../src/common/constant'

describe('files reducer', () => {
  it('should do nothing if invalid action', () => {
    const action = {
      type: 'INVALID'
    }
    const expected = Object.assign({}, initialState)
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should set error state', () => {
    const action = {
      type: types.FILE_ERROR
    }
    const expected = Object.assign({}, initialState, { error: true })
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should open file modal', () => {
    const action = {
      type: types.FOLDER_MODAL,
      open: true
    }
    const expected = Object.assign({}, initialState, {
      modalVisible: true
    })
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should close file modal', () => {
    const init = Object.assign({}, initialState, { modalVisible: true })
    const action = {
      type: types.FOLDER_MODAL,
      open: false
    }
    const expected = Object.assign({}, init, {
      modalVisible: false
    })
    expect(reducer(init, action)).toEqual(expected)
  })
  it('should select folder', () => {
    const action = {
      type: types.SELECT_FOLDER,
      folder: '~/',
      contents: ['testfile']
    }
    const expected = Object.assign({}, initialState, {
      folder: '~/',
      contents: ['testfile']
    })
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should get folder contents', () => {
    const action = {
      type: types.FOLDER_CONTENTS,
      folder: '~/',
      files: ['testfile']
    }
    const expected = Object.assign({}, initialState, {
      activeFolder: '~/',
      activeContents: ['testfile']
    })
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should list folders', () => {
    const action = {
      type: types.SET_FOLDERS,
      folderList: ['folder1']
    }
    const expected = Object.assign({}, initialState, {
      modalVisible: false,
      folderList: ['folder1']
    })
    expect(reducer(initialState, action)).toEqual(expected)
  })
})
