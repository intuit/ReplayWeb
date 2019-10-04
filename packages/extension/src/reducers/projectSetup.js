import { types } from '../actions/action_types'

const T = types // so that auto complete in webstorm doesn't go crazy

const initialState = {
  projectPath: '',
  testPath: '',
  blockPath: '',
  suites: {},
  name: '',
  purpose: T.PROJECT_PATH,
  existingConfig: null,
  id: null
}

export { initialState }

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case T.CLEAR_PROJECT_SETUP:
      return { ...initialState }
    case T.EDIT_PROJECT:
      return { ...initialState, ...action.project }
    case T.EXISTING_CONFIG:
      return { ...state, existingConfig: action.exists }
    case T.SET_PURPOSE:
      return { ...state, purpose: action.purpose }
    case T.EXISTING_SUITES:
      return { ...state, suites: action.suites }
    case T.TEST_PATH:
      return { ...state, testPath: action.path.replace(state.projectPath, '.') }
    case T.BLOCK_PATH:
      return { ...state, blockPath: action.path.replace(state.projectPath, '.') }
    case T.PROJECT_PATH:
      return { ...state, projectPath: action.path }
    default:
      return state
  }
}
