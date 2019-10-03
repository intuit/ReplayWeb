import { types } from '../actions/action_types';
import { setIn, updateIn, compose, pick, updateCmd } from '../common/utils';
import * as C from '../common/constant';

const T = types; // so that auto complete in webstorm doesn't go crazy


const initialState = {
  context: {},
  status: C.PLAYER_STATUS.STOPPED,
  stopReason: null,
  currentLoop: 0,
  loops: 0,
  nextCommandIndex: null,
  errorCommandIndices: [],
  doneCommandIndices: [],
  playInterval: 0,
  timeoutStatus: {
    type: null,
    total: null,
    past: null
  }
};

export {initialState}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case T.EDIT_TEST_CASE: {
      return ({
        ...state,
        status: C.PLAYER_STATUS.STOPPED,
        stopReason: null,
        nextCommandIndex: null,
        errorCommandIndices: [],
        doneCommandIndices: []
      })
    }
    case T.EDIT_BLOCK: {
      return ({
        ...state,
        status: C.PLAYER_STATUS.STOPPED,
        stopReason: null,
        nextCommandIndex: null,
        errorCommandIndices: [],
        doneCommandIndices: []
      })
    }

    case T.EDIT_NEW_TEST_CASE: {
      return ({
        ...state,
        nextCommandIndex: null,
        errorCommandIndices: [],
        doneCommandIndices: []
      })
    }

    case T.EDIT_NEW_BLOCK:
      return ({
        ...state,
        nextCommandIndex: null,
        errorCommandIndices: [],
        doneCommandIndices: []
      })

    case T.SET_PLAYER_STATE:
      return ({
        ...state,
        ...action.data
      })

    case T.PLAYER_ADD_ERROR_COMMAND_INDEX:
      return updateIn(
        ['errorCommandIndices'],
        indices => [...indices, action.data],
        state
      );
    case T.CLEAR_CONTEXT:
      return setIn(['context'], {}, state);
    case T.SET_CONTEXT:
      return setIn(['context', action.key], action.value, state);
    default:
      return state;
  }
}
