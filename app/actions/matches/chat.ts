import {
  changeActiveChat,
  POST_MESSAGE,
  PUSH_CHAT,
  PUSH_ENQUEUED_CHAT,
  PUSH_MATCHED_CHAT,
  REPLACE_ACTIVE_MESSAGE,
  REPLACE_MESSAGE,
} from './index'

import { ApiResponse } from 'apisauce'
import { push } from 'connected-react-router'
import { ThunkDispatch } from 'redux-thunk'

import { authedApi } from '../../lib/api'
import { storeToken } from '../../lib/asyncStorage';
import { ReduxStore } from '../../types/models';

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

const pushMatchedMatch = (i: number, message: ReduxStore.IChat) => ({
  message,
  index: i,
  type: PUSH_MATCHED_CHAT,
})
const pushEnqueuedMatch = (newMatch: ReduxStore.Match, i: number) => ({
  match: newMatch,
  index: i,
  type: PUSH_ENQUEUED_CHAT,
})
export function pushMessage(matchId: ReduxStore.ObjectId, message: ReduxStore.IChat) {
  return (dispatch: ThunkDispatch<{}, {}, any>, getState: Function) => {
    const { enqueuedMatches, uninitializedMatches, chatMatches }: {
      enqueuedMatches: ReduxStore.Match[],
      uninitializedMatches: ReduxStore.Match[],
      chatMatches: ReduxStore.Match[],
    } = getState()
    let foundMatch = false
    let matchIndex: number
    foundMatch = chatMatches.some((v, i, arr) => {
      if(v && v._id.toString() === matchId.toString()) {
        matchIndex = i
        // 1. Pushes to ActiveChat
        // 2. Push to Matched Chat
        dispatch(pushMatchedMatch(i, message))
        return true
      }
      return false
    })

    if(!foundMatch) {
      foundMatch = enqueuedMatches.some((v, i, arr) => {
        if(v && v._id.toString() === matchId.toString()) {
          matchIndex = i
          // This is a oddly complex dispatch. There are three reducers that will respond.
          // 1. store.enqueuedChat(i: number) Removes the index from enqueuedMatches
          // 2. store.chatMatches(newMatch) Pushes Enqueued Match into chat matches preloaded with chat
          // 3. store.activeChat(newMatch) Replaces Active Match
          const newMatch: ReduxStore.Match = {
            ...v,
            chat: [...v.chat, message],
          }
          dispatch(pushEnqueuedMatch(newMatch, i))
          return true
        }
        return false
      })
    }

    if(!foundMatch) {
      console.log('match not found!')
    }
  }
}

const replaceActiveMessage = (i: number, message: ReduxStore.IChat) => ({
  message,
  index: i,
  type: REPLACE_ACTIVE_MESSAGE,
})
const replaceMessage = (i: number, message: ReduxStore.IChat) => ({
  message,
  index: i,
  type: REPLACE_MESSAGE,
})
export const replaceChatMessage = (matchId: ReduxStore.ObjectId, message: ReduxStore.IChat) => {
  return (dispatch: ThunkDispatch<{}, {}, any>, getState: Function) => {
    const { chatMatches, activeChat }: {
      chatMatches: ReduxStore.Match[],
      activeChat: any,
    } = getState()
    const matchIdString = matchId.toString()
    chatMatches.some((v, i, arr) => {
      if(v && v._id.toString() === matchIdString) {
        // 1. Pushes to ActiveChat
        // 2. Push to Matched Chat
        if(activeChat._id !== '00000000' && activeChat._id.toString() === matchIdString) {
          dispatch(replaceActiveMessage(i, message))
        } else {
          dispatch(replaceMessage(i, message))
        }
        return true
      }
      return false
    })
  }
}

export const postMessage = (matchId: ReduxStore.ObjectId, message: ReduxStore.IMessage) => ({
  matchId,
  message,
  type: POST_MESSAGE,
})
