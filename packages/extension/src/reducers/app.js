import { types as T} from '../actions/action_types';
import { setIn, updateIn, compose, pick, updateCmd } from '../common/utils';
import { normalizeCommand } from '../models/test_case_model';
import * as C from '../common/constant';

// * editor
//    * testCases:          all test cases stored in indexedDB
//    * editing:            the current test cases being edited
//    * clipbard            for copy / cut / paste
//
// * player                 the state for player
//    * nextCommandIndex    the current command beging executed
//    * errorCommandIndices commands that encounters some error
//    * doneCommandIndices  commands that have been executed
//    * currentLoop         the current round
//    * loops               how many rounds to run totally
// * files                  the state for the filesystem native host
//    * modalVisible        whether or not the add folder modal is visible
//    * folder              the current selected folder in the modal
//    * contents            the files in the currently selected folder

//    * activeFolder        the folder being used for saving
//    * activeContents      contents of the active folder
//    * folderList          the saved local folders
const initialState = {
  status: C.APP_STATUS.NORMAL,
  recorderStatus: C.RECORDER_STATUS.STOPPED,
  inspectorStatus: C.INSPECTOR_STATUS.STOPPED,
  logs: [],
  screenshots: [],
  config: {},
  blockShareConfig: {},
  blockShareConfigError: true,
  blockShareConfigErrorMessage: "Config not read yet",
  userName: null
};

export {initialState}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case T.START_RECORDING_SUCCESS:
      return {
        ...state,
        status: C.APP_STATUS.RECORDER,
        recorderStatus: C.APP_STATUS.PENDING,
      };
    case T.STOP_RECORDING_SUCCESS:
      return {
        ...state,
        status: C.APP_STATUS.NORMAL,
        recorderStatus: C.RECORDER_STATUS.STOPPED
      };
    case T.START_INSPECTING_SUCCESS:
      return {
        ...state,
        status: C.APP_STATUS.INSPECTOR,
        inspectorStatus: C.INSPECTOR_STATUS.PENDING
      };
    case T.STOP_INSPECTING_SUCCESS:
    case T.DONE_INSPECTING:
      return {
        ...state,
        status: C.APP_STATUS.NORMAL,
        recorderStatus: C.INSPECTOR_STATUS.STOPPED
      };
    case T.START_PLAYING:
      return {
        ...state,
        status: C.APP_STATUS.PLAYER
      };

    case T.STOP_PLAYING:
      return {
        ...state,
        status: C.APP_STATUS.NORMAL
      };

    case T.READ_BLOCK_SHARE_CONFIG_SUCCESS:
      return {
        ...state,
        blockShareConfig: action.data,
        blockShareConfigError: false,
        blockShareConfigErrorMessage: ""
      };

    case T.READ_BLOCK_SHARE_CONFIG_FAIL:
      return {
        ...state,
        blockShareConfig: {},
        blockShareConfigError: true,
        blockShareConfigErrorMessage: action.err.toString()
      };

    case T.ADD_LOGS:
      return {
        ...state,
        logs: [...state.logs, ...action.data]
      };

    case T.CLEAR_LOGS:
      return {
        ...state,
        logs: []
      };

    case T.ADD_SCREENSHOT:
      return {
        ...state,
        screenshots: [...state.screenshots, action.data]
      };

    case T.CLEAR_SCREENSHOTS:
      return {
        ...state,
        screenshots: []
      };

    case T.UPDATE_CONFIG:
      return updateIn(['config'], cfg => ({ ...cfg, ...action.data }), state);

    case T.USER_NAME:
      return {...state, userName: action.name}
    default:
      return state;
  }
}
