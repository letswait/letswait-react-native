import {
  CLEAR_CHAT,
  PUSH_CHAT,
  PUSH_CHAT_MATCH,
  PUSH_ENQUEUE,
  PUSH_MATCH,
  PUSH_MATCHES,
  PUSH_UNINITIALIZED,
  RESET_MATCHES,
  SET_MATCH_MESSAGE,
} from '../actions/matches'

import { AnyAction } from 'redux';

const initialEnqueuedMatches: any[] = []
export const enqueuedMatches = (state = initialEnqueuedMatches, action: AnyAction) => {
  switch(action.type) {
    case PUSH_ENQUEUE: return [...action.chatMatches, action.match]
    case RESET_MATCHES: return initialEnqueuedMatches
    case PUSH_MATCHES: return action.enqueuedMatches
    default: return [...state]
  }
}
const initialUninitializedMatches: any[] = []
export const uninitializedMatches = (state = initialUninitializedMatches, action: AnyAction) => {
  switch(action.type) {
    case PUSH_UNINITIALIZED: return [...action.chatMatches, action.match]
    case RESET_MATCHES: return initialUninitializedMatches
    case PUSH_MATCHES: return action.uninitializedMatches
    default: return [...state]
  }
}
const initialChatMatches: any[] = []
export const chatMatches = (state = initialChatMatches, action: AnyAction) => {
  switch(action.type) {
    case PUSH_CHAT_MATCH: return [...state, action.match]
    case RESET_MATCHES: return initialChatMatches
    case PUSH_MATCHES: return action.chatMatches
    default: return [...state]
  }
}

export const matchMessage = (state = 'Loading Matches...', action: AnyAction) => {
  switch(action.type) {
    case SET_MATCH_MESSAGE: return action.message
    default: return `${state}`
  }
}

export const activeChat = (state: any | null = null, action: AnyAction) => {
  switch(action.type) {
    case PUSH_CHAT_MATCH: return action.match
    case PUSH_CHAT: return action.match
    default: return state ? { ...state } : null
  }
}
