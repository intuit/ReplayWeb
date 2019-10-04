import { Provider } from 'react-redux'
import { createStore as oldCreateStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createPromiseMiddleware from './promise_middleware'
import createPostLogicMiddleware from './post_logic_middleware'
import { createLogger } from 'redux-logger'

const createStore = applyMiddleware(
  thunk,
  createPromiseMiddleware(),
  createPostLogicMiddleware(),
  createLogger({})
)(oldCreateStore)

export {
  Provider,
  createStore
}
