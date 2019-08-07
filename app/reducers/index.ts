import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'

import * as navigationReducers from './navigation'
import * as userReducers from './user'

export default (history: any) => combineReducers({
  router: connectRouter(history),
  ...navigationReducers,
  ...userReducers,
} as any)
