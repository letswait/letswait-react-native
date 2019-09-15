import {
  PUSH_CHAT,
  PUSH_ENQUEUED_CHAT,
  PUSH_MATCHED_CHAT,
} from './index'

import { ApiResponse } from 'apisauce'
import { push } from 'connected-react-router'
import { ThunkDispatch } from 'redux-thunk'

import { authedApi } from '../../lib/api'
import { storeToken } from '../../lib/asyncStorage';
import { ReduxStore } from '../../types/models';

export const changeActiveChat = (match: ReduxStore.Match) => ({
  match,
  type: PUSH_CHAT,
})
export function openChat(matchId: any) {
  return (dispatch: ThunkDispatch<{},{}, any>, getState: Function) => {
    const { enqueuedMatches, uninitializedMatches, chatMatches } = getState()
    let chatMatch = null
    if(chatMatches.length) {
      for(let i = chatMatches.length; i--;) {
        if(chatMatches[i]._id === matchId) {
          chatMatch = chatMatches[i]
          break
        }
      }
    }
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
    if(!chatMatch) {
      dispatch(push('/app/matches'))
    } else {
      dispatch(push('/app/chat'))
      dispatch(changeActiveChat(chatMatch))
    }
  }
}

const pushMatchedChat = (i: number, message: ReduxStore.IChat) => ({
  message,
  index: i,
  type: PUSH_MATCHED_CHAT,
})
const pushEnqueuedChat = (newMatch: ReduxStore.Match, i: number) => ({
  match: newMatch,
  index: i,
  type: PUSH_ENQUEUED_CHAT,
})
export function pushChat(matchId: string, message: ReduxStore.IChat) {
  return (dispatch: ThunkDispatch<{}, {}, any>, getState: Function) => {
    const { enqueuedMatches, uninitializedMatches, chatMatches }: {
      enqueuedMatches: ReduxStore.Match[],
      uninitializedMatches: ReduxStore.Match[],
      chatMatches: ReduxStore.Match[],
    } = getState()
    let foundMatch = false
    let matchIndex: number
    foundMatch = chatMatches.some((v, i, arr) => {
      if(v && v._id.toString() === matchId) {
        matchIndex = i
        // 1. Pushes to ActiveChat
        // 2. Push to Matched Chat
        dispatch(pushMatchedChat(i, message))
        return true
      }
      return false
    })

    if(!foundMatch) {
      foundMatch = enqueuedMatches.some((v, i, arr) => {
        if(v && v._id.toString() === matchId) {
          matchIndex = i
          // This is a oddly complex dispatch. There are three reducers that will respond.
          // 1. store.enqueuedChat(i: number) Removes the index from enqueuedMatches
          // 2. store.chatMatches(newMatch) Pushes Enqueued Match into chat matches preloaded with chat
          // 3. store.activeChat(newMatch) Replaces Active Match
          const newMatch: ReduxStore.Match = {
            ...v,
            chat: [...v.chat, message],
          }
          dispatch(pushEnqueuedChat(newMatch, i))
          return true
        }
        return false
      })
    }

    if(!foundMatch) {
      console.log('match not found!')
    }

    // This is good for extracting a match from the matches. not suited to modify and replace matches.
    // if(chatMatches.length) {
      // for(let i = chatMatches.length; i--;) {
        // if(chatMatches[i]._id.toString() === matchId) {
          // chatMatch = chatMatches[i]
          // break
        // }
      // }
    // }
    // if(!chatMatch && enqueuedMatches.length) {
      // for(let i = enqueuedMatches.length; i--;) {
        // if(enqueuedMatches[i]._id.toString === matchId) {
          // chatMatch = enqueuedMatches[i]
          // break
        // }
      // }
    // }
    // if(!chatMatch && uninitializedMatches.length) {
      // for(let i = uninitializedMatches.length; i--;) {
        // if(uninitializedMatches[i]._id === matchId) {
          // chatMatch = uninitializedMatches[i]
          // break
        // }
      // }
    // }
  }
}
