// Generate three action types, used in actions that return promises
export const make3 = name => [
  name + '_REQUEST',
  name + '_SUCCESS',
  name + '_FAIL'
];

export const type3 = name => make3(name).map(key => types[key]);

const promiseTypes = [
  'START_RECORDING',
  'STOP_RECORDING',
  'START_INSPECTING',
  'STOP_INSPECTING',
  'READ_BLOCK_SHARE_CONFIG'
].reduce((prev, cur) => {
  make3(cur).forEach(key => {
    prev[key] = key;
  });

  return prev;
}, {});

const simpleTypes = [
  'DONE_INSPECTING',
  'INSPECT_TARGET',
  'UPDATE_BASE_URL',
  'APPEND_COMMAND',
  'DUPLICATE_COMMAND',
  'INSERT_COMMAND',
  'UPDATE_COMMAND',
  'REMOVE_COMMAND',
  'SELECT_COMMAND',
  'REORDER_COMMAND',
  'NORMALIZE_COMMANDS',
  'UPDATE_SELECTED_COMMAND',
  'SAVE_EDITING_AS_EXISTED',
  'SAVE_EDITING_AS_NEW',
  'SAVE_EDITING_BLOCK_AS_EXISTED',
  'SAVE_EDITING_BLOCK_AS_NEW',
  'SHARE_BLOCK',
  'UPDATE_SHARE_LINKS',
  'SET_TEST_CASES',
  'SET_BLOCKS',
  'SET_EDITING',
  'EDIT_TEST_CASE',
  'EDIT_NEW_TEST_CASE',
  'ADD_TEST_CASES',
  'RENAME_TEST_CASE',
  'REMOVE_CURRENT_TEST_CASE',
  'UPDATE_TEST_CASE_STATUS',
  'EDIT_BLOCK',
  'EDIT_NEW_BLOCK',
  'ADD_BLOCKS',
  'RENAME_BLOCK',
  'REMOVE_CURRENT_BLOCK',
  'UPDATE_BLOCK_STATUS',

  'SET_PLAYER_STATE',
  'PLAYER_ADD_ERROR_COMMAND_INDEX',

  'CUT_COMMAND',
  'COPY_COMMAND',
  'PASTE_COMMAND',

  'ADD_LOGS',
  'CLEAR_LOGS',

  'ADD_SCREENSHOT',
  'CLEAR_SCREENSHOTS',

  'START_PLAYING',
  'STOP_PLAYING',


  'SEARCH_WORD',
  'FILTER_COMMANDS',

  'MULTI_SELECT',
  'GROUP_SELECT',
  'EMPTY_ARRAY',

  'UPDATE_CONFIG',

  'SELECT_PROJECT',
  'CREATE_PROJECT',
  'DELETE_PROJECT',
  'LIST_PROJECTS',
  'MODAL_STATE',
  'DROPDOWN_STATE',
  'NEXT_TEST',
  'NEXT_BLOCK',
  'SET_CONTEXT',
  'CLEAR_CONTEXT',
  'SET_EDITOR_STATUS',
  'USER_NAME',
  'SHOW_CONTEXT_MENU',
  'HIDE_CONTEXT_MENU'
].reduce((prev, cur) => {
  prev[cur] = cur;
  return prev;
}, {});

const filesystemTypes = [
  'SELECT_FOLDER',
  'SET_FOLDERS',
  'FOLDER_CONTENTS',
  'FOLDER_MODAL',
  'FILE_ERROR'
].reduce((prev, cur) => {
  prev[cur] = cur;
  return prev;
}, {});

const projectSetupTypes = [
  'PROJECT_PATH',
  'TEST_PATH',
  'BLOCK_PATH',
  'SET_PURPOSE',
  'EXISTING_CONFIG',
  'EDIT_PROJECT',
  'CLEAR_PROJECT_SETUP'
].reduce((prev, cur) => {
  prev[cur] = cur;
  return prev;
}, {});
const suiteEditorTypes = [
  'ADD_SUITE_TEST',
  'REMOVE_SUITE_TEST',
  'SET_SUITES',
  'EDIT_NEW_SUITE',
  'NEXT_SUITE',
  'EDIT_SUITE',
  'REMOVE_CURRENT_SUITE',
  'SAVE_EDITING_SUITE_AS_NEW',
  'SAVE_EDITING_SUITE_AS_EXISTED',
  'RENAME_SUITE',
  'EXISTING_SUITES'
].reduce((prev, cur) => {
  prev[cur] = cur;
  return prev;
}, {});

export const types = { ...simpleTypes, ...promiseTypes, ...filesystemTypes, ...projectSetupTypes, ...suiteEditorTypes };
