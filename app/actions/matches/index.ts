export const GET_MATCHES = 'GET_MATCHES'
export const PUSH_MATCHES = 'PUSH_MATCHES'
export const PUSH_MATCH = 'PUSH_MATCH'
export const RESET_MATCHES = 'RESET_MATCHES'

export const PUSH_CHAT = 'PUSH_CHAT'
export const CLEAR_CHAT = 'CLEAR_CHAT'

export const POST_MESSAGE = 'POST_MESSAGE'
export const REPLACE_MESSAGE = 'REPLACE_MESSAGE'
export const REPLACE_ACTIVE_MESSAGE = 'REPLACE_ACTIVE_MESSAGE'

export const SET_MATCH_MESSAGE = 'SET_MATCH_MESSAGE'

export const PUSH_ENQUEUE = 'PUSH_ENQUEUE'
export const PUSH_UNINITIALIZED = 'PUSH_UNINITIALIZED'
export const PUSH_CHAT_MATCH = 'PUSH_CHAT_MATCH'

export const PUSH_MATCHED_CHAT = 'PUSH_MATCHED_CHAT'
export const PUSH_ENQUEUED_CHAT = 'PUSH_ENQUEUED_CHAT'

import { ApiResponse } from 'apisauce'
import { push } from 'connected-react-router'
import { ThunkDispatch } from 'redux-thunk'

import { authedApi } from '../../lib/api'
import { storeToken } from '../../lib/asyncStorage';

import { ReduxStore } from 'app/types/models'
import { Alert } from 'react-native';
import { showModal } from '../navigation/modal'

/**
 * @funciton changeActiveChat: Originally in /actions/matches/chat.ts but created a require cycle.
 */
export const changeActiveChat = (match: ReduxStore.Match) => ({
  match,
  type: PUSH_CHAT,
})

export const setMatchMessage = (message: string = '') => ({
  message,
  type: SET_MATCH_MESSAGE,
})

export const resetMatches = () => ({
  type: RESET_MATCHES,
})
export const pushMatches = (body: any) => ({
  type: PUSH_MATCHES,
  enqueuedMatches: body.enqueuedMatches,
  uninitializedMatches: body.uninitializedMatches,
  chatMatches: body.chatMatches,
})
export function getMatches() {
  return (dispatch: ThunkDispatch<{},{}, any>) => {
    authedApi.get('/api/matches/get-matches').then((res: ApiResponse<any>) => {
      if(res.ok && res.data) {
        const didStoreMatches = storeToken('matches', JSON.stringify(res.data))
        if(didStoreMatches) {
          dispatch(pushMatches(res.data))
          dispatch(setMatchMessage(res.data.message))
        } else {
          Alert.alert('Could not save matches')
        }
      } else {
        dispatch(resetMatches())
        dispatch(setMatchMessage('Could not Load Matches'))
      }
    })
  }
}

export const pushToUninitialized = (match: any) => ({
  match,
  type: PUSH_UNINITIALIZED,
})
export const pushToChatMatches = (match: any) => ({
  match,
  type: PUSH_CHAT_MATCH,
})
export function pushEnqueuedMatch(match: any) {
  return (dispatch: ThunkDispatch<{},{},any>, getState: any) => {
    // const { enqueuedMatches } = getState()
    // for(let i = enqueuedMatches.length; i--;) {
    //   if(enqueuedMatches[i]._id === match._id) {
    //     delete enqueuedMatches[i]
    //     break
    //   }
    // }
    dispatch(push('/app/chat'))
    dispatch(pushToChatMatches(match))
  }
}

export function previewDate(match: ReduxStore.Match) {
  return (dispatch: ThunkDispatch<{},{},any>, getState: any) => {
    dispatch(changeActiveChat(match))
    dispatch(showModal('datepreview'))
  }
}
