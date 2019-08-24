export const GET_MATCHES = 'GET_MATCHES'
export const PUSH_MATCHES = 'PUSH_MATCHES'
export const PUSH_MATCH = 'PUSH_MATCH'
export const RESET_MATCHES = 'RESET_MATCHES'

export const PUSH_CHAT = 'PUSH_CHAT'
export const CLEAR_CHAT = 'CLEAR_CHAT'

export const SET_MATCH_MESSAGE = 'SET_MATCH_MESSAGE'

export const PUSH_ENQUEUE = 'PUSH_ENQUEUE'
export const PUSH_UNINITIALIZED = 'PUSH_UNINITIALIZED'
export const PUSH_CHAT_MATCH = 'PUSH_CHAT_MATCH'

import { ApiResponse } from 'apisauce'
import { push } from 'connected-react-router'
import { ThunkDispatch } from 'redux-thunk'

import { authedApi } from '../../lib/api'
import { Alert } from 'react-native';

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
        dispatch(pushMatches(res.data))
        dispatch(setMatchMessage(res.data.message))
      } else {
        dispatch(resetMatches())
        dispatch(setMatchMessage('Could not Load Matches'))
      }
    })
  }
}

export const changeActiveChat = (match: number) => ({
  match,
  type: PUSH_CHAT,
})
export function openChat(matchId: any) {
  return (dispatch: ThunkDispatch<{},{}, any>, getState: Function) => {
    const { enqueuedMatches, uninitializedMatches, chatMatches } = getState()
    let chatMatch = null
    if(!chatMatch && enqueuedMatches.length) {
      for(let i = enqueuedMatches.length; i--;) {
        if(enqueuedMatches[i]._id === matchId) {
          chatMatch = enqueuedMatches[i]
          break
        }
      }
    }
    if(!chatMatch && uninitializedMatches.length) {
      for(let i = uninitializedMatches.length; i--;) {
        if(uninitializedMatches[i]._id === matchId) {
          chatMatch = uninitializedMatches[i]
          break
        }
      }
    }
    if(!chatMatch && chatMatches.length) {
      for(let i = chatMatches.length; i--;) {
        if(chatMatches[i]._id === matchId) {
          chatMatch = chatMatches[i]
          break
        }
      }
    }
    if(!chatMatch) {
      dispatch(push('/app/matches'))
    } else {
      dispatch(push('/app/chat'))
      dispatch(changeActiveChat(chatMatch))
    }
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
    const { enqueuedMatches } = getState()
    for(let i = enqueuedMatches.length; i--;) {
      if(enqueuedMatches[i]._id === match._id) {
        delete enqueuedMatches[i]
        break
      }
    }
    dispatch(push('/app/chat'))
    dispatch(pushToChatMatches(match))
  }
}
