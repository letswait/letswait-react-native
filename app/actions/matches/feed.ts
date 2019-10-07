import {
  ACCEPT_MATCH,
  DENY_MATCH,
  ENQUEUE_WHEEL,
} from './index'

import { push } from 'connected-react-router'
import { ThunkDispatch } from 'redux-thunk'

import { ReduxStore } from '../../types/models';

export const acceptMatch = (suitorId: ReduxStore.IMatchUser) => ({
  suitorId,
  type: ACCEPT_MATCH,
})

export const denyMatch = (suitorId: ReduxStore.IMatchUser) => ({
  suitorId,
  type: DENY_MATCH,
})

// Add Spinnable Match to Wheel Queue
export const enqueueWheel = (spinner: any) => ({
  spinner,
  type: ENQUEUE_WHEEL,
})
