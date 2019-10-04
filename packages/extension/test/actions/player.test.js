import { types as T } from '../../src/actions/action_types'
import { mockStore } from '../utils'
import {
  setPlayerState,
  startPlaying,
  stopPlaying,
  addPlayerErrorCommandIndex,
  updateTestCasePlayStatus,
  updateBlockPlayStatus,
  playerPlay
} from '../../src/actions/player'
import model from '../../src/models/test_case_model'
import blockModel from '../../src/models/block-model'

jest.mock('../../src/models/test_case_model')
jest.mock('../../src/models/block-model')
jest.mock('../../src/actions/utilities')

jest.mock('../../src/common/player', () => {
  return {
    getPlayer: jest.fn().mockImplementation(() => {
      return {
        play: jest.fn().mockImplementation(() => {
          return jest.fn()
        })
      }
    })
  }
})

describe('player actions', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {})

  describe('state tests', () => {
    it('setPlayerState happy path', () => {
      const action = setPlayerState(true)
      expect(action.type).toEqual(T.SET_PLAYER_STATE)
      expect(action.data).toEqual(true)
    })
    it('startPlaying happy path', () => {
      const action = startPlaying()
      expect(action.type).toEqual(T.START_PLAYING)
      expect(action.data).toEqual(null)
    })
    it('stopPlaying happy path', () => {
      const action = stopPlaying()
      expect(action.type).toEqual(T.STOP_PLAYING)
      expect(action.data).toEqual(null)
    })
    it('addPlayerErrorCommandIndex happy path', () => {
      const action = addPlayerErrorCommandIndex(true)
      expect(action.type).toEqual(T.PLAYER_ADD_ERROR_COMMAND_INDEX)
      expect(action.data).toEqual(true)
    })
  })
  describe('update tests', () => {
    it('test updateTestCasePlayStatus', async () => {
      const id = 1
      const status = 'foobar'
      const store = mockStore({
        editor: {
          testCases: [{ id: 1 }]
        }
      })

      await store.dispatch(updateTestCasePlayStatus(id, status))
      expect(model.update).toHaveBeenCalled()

      const actions = store.getActions()
      expect(actions[0].type).toEqual('UPDATE_TEST_CASE_STATUS')
      expect(actions[0].data.id).toEqual(1)
      expect(actions[0].data.status).toEqual('foobar')
    })
    it('test updateBlockPlayStatus', async () => {
      const id = 1
      const status = 'foobar'
      const store = mockStore({
        editor: {
          blocks: [{ id: 1 }]
        }
      })

      await store.dispatch(updateBlockPlayStatus(id, status))
      expect(blockModel.update).toHaveBeenCalled()

      const actions = store.getActions()
      expect(actions[0].type).toEqual('UPDATE_BLOCK_STATUS')
      expect(actions[0].data.id).toEqual(1)
      expect(actions[0].data.status).toEqual('foobar')
    })
  })
  describe('playerPlay', () => {
    it('happy path for playerPlay', async () => {
      const store = mockStore({
        editor: {
          editing: {
            meta: {
              src: { name: 'myMacro' }
            }
          }
        },
        app: {
          config: {
            playHighlightElements: false,
            playScrollElementsIntoView: false,
            timeoutPageLoad: 15,
            timeoutElement: 15
          }
        }
      })

      const options = {
        command: 'assertElementVisible',
        loopsEnd: 1,
        loopsStart: 2,
        title: 'name',
        extra: {
          errorIgnore: true,
          retryInfo: {
            retryCount: 0,
            RetryInterval: 1000
          },
          timeoutElement: 10,
          timeoutPageLoad: 60
        },
        mode: null,
        startIndex: 0,
        startUrl: 'https://google.com',
        resources: {
          command: 'open'
        },
        postDelay: 0
      }

      await store.dispatch(playerPlay(options))
    })
    it('happy path for playerPlay with no src name', async () => {
      const store = mockStore({
        editor: {
          editing: {
            meta: {
              src: {}
            }
          }
        },
        app: {
          config: {
            playHighlightElements: false,
            playScrollElementsIntoView: false,
            timeoutPageLoad: 15,
            timeoutElement: 15
          }
        }
      })

      const options = {
        command: 'assertElementVisible',
        loopsEnd: 1,
        loopsStart: 2,
        title: 'name',
        extra: {
          errorIgnore: true,
          retryInfo: {
            retryCount: 0,
            RetryInterval: 1000
          },
          timeoutElement: 10,
          timeoutPageLoad: 60
        },
        mode: null,
        startIndex: 0,
        startUrl: 'https://google.com',
        resources: {
          command: 'open'
        },
        postDelay: 0
      }

      await store.dispatch(playerPlay(options))
    })
  })
})
