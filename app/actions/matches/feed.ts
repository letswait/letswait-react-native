import {
  ACCEPT_MATCH,
  DENY_MATCH,
  ENQUEUE_WHEEL,
  POPULATE_MATCH_FEED,
  REQUEST_FEED,
} from './index'

import { ReduxStore, SocketReturnTypes } from '../../types/models';

export const acceptMatch = (suitorId: ReduxStore.IMatchUser) => ({
  suitorId,
  type: ACCEPT_MATCH,
})

export const denyMatch = (suitorId: ReduxStore.IMatchUser) => ({
  suitorId,
  type: DENY_MATCH,
})

// Add Spinnable Match to Wheel Queue
export const enqueueWheel = (spinner: SocketReturnTypes.SpinnerInfo) => ({
  spinner,
  type: ENQUEUE_WHEEL,
})

export const requestFeed = (searchSettings: ReduxStore.SearchSettings) => ({
  searchSettings,
  type: REQUEST_FEED,
})
export const populateFeed = (feed: ReduxStore.Match[], searchSettings: ReduxStore.SearchSettings) => ({
  searchSettings,
  feed,
  type: POPULATE_MATCH_FEED,
})
