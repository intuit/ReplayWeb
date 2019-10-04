import { types } from '../actions/action_types'

const T = types // so that auto complete in webstorm doesn't go crazy

const initialState = {
  playLoop: false,
  settings: false,
  newBlockModal: false,
  duplicate: false,
  rename: false,
  project: false,
  multiselect: false,
  shareBlock: false,
  save: false,
  browser: false,
  projectSetup: false
}

export { initialState }

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case T.MODAL_STATE:
      return Object.assign({}, state, { [action.modal]: action.state })
    default:
      return state
  }
}
