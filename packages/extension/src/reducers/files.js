import { types } from '../actions/action_types';

const T = types; // so that auto complete in webstorm doesn't go crazy

const initialState = {
  modalVisible: false,
  folder: '~',
  contents: [],
  activeFolder: null,
  activeContents: [],
  folderList: [],
  error: false
};

export {initialState}


export default function reducer (state = initialState, action) {
  switch (action.type) {
    case T.FILE_ERROR:
      return {...state, error: true}
    case T.SELECT_FOLDER:
      return Object.assign({}, state, {
        ...state,
        folder: action.folder,
        contents: action.contents,
        error: false
      });
    case T.FOLDER_CONTENTS:
      return Object.assign({}, state, {
        ...state,
        activeFolder: action.folder,
        activeContents: action.files,
        error: false
      });
    case T.FOLDER_MODAL:
      return Object.assign({}, state, {
        ...state,
        modalVisible: action.open,
        error: false
      });
    case T.SET_FOLDERS:
      return Object.assign({}, state, {
        ...state,
        modalVisible: false,
        folderList: action.folderList,
        error: false
      });
    default:
      return state;
  }
}
