import { types } from '../actions/action_types'

const T = types // so that auto complete in webstorm doesn't go crazy

const initialState = {
  testcase: false
}

export { initialState }

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case T.DROPDOWN_STATE:
      return Object.assign({}, state, { [action.dropdown]: action.state })
    default:
      return state
  }
}
