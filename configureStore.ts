import { routerMiddleware } from 'connected-react-router'
import { createMemoryHistory } from 'history'
import { applyMiddleware, compose, createStore, Store } from 'redux'
import createRootReducer from './app/reducers'

import loggerMiddleware from 'redux-logger'

import thunkMiddleware from 'redux-thunk'

export const history = createMemoryHistory()

export default function configureStore(preloadedState?: any) {
  const store = createStore(
    createRootReducer(history),
    compose(
      applyMiddleware(
        routerMiddleware(history),
        thunkMiddleware,
        // loggerMiddleware,
      ),
    ),
  )
  return store
}
