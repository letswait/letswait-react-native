import {
  CLEAR_CHAT,
  PUSH_CHAT,
  PUSH_CHAT_MATCH,
  PUSH_ENQUEUE,
  PUSH_ENQUEUED_CHAT,
  PUSH_MATCH,
  PUSH_MATCHED_CHAT,
  PUSH_MATCHES,
  PUSH_UNINITIALIZED,
  RESET_MATCHES,
  SET_MATCH_MESSAGE,
  REPLACE_ACTIVE_MESSAGE,
  REPLACE_MESSAGE,
} from '../actions/matches'

import { AnyAction } from 'redux';
import { ReduxStore } from '../types/models';

const initialEnqueuedMatches: ReduxStore.Match[] = []
export const enqueuedMatches = (state = initialEnqueuedMatches, action: AnyAction) => {
  switch(action.type) {
    case PUSH_ENQUEUED_CHAT: return state.filter((match, index) => index !== action.index)
    case PUSH_ENQUEUE: return [...state, action.match]
    case RESET_MATCHES: return initialEnqueuedMatches
    case PUSH_MATCHES: return action.enqueuedMatches
    default: return [...state]
  }
}
const initialUninitializedMatches: ReduxStore.Match[] = []
export const uninitializedMatches = (state = initialUninitializedMatches, action: AnyAction) => {
  switch(action.type) {
    case PUSH_UNINITIALIZED: return [...state, action.match]
    case RESET_MATCHES: return initialUninitializedMatches
    case PUSH_MATCHES: return action.uninitializedMatches
    default: return [...state]
  }
}
const initialChatMatches: ReduxStore.Match[] = []
export const chatMatches = (state = initialChatMatches, action: AnyAction) => {
  switch(action.type) {
    case PUSH_MATCHED_CHAT: return state.map((match, i, arr) => {
      // console.log(match)
      if(i === action.index) {
        return {
          ...match,
          chat: match.chat.concat([action.message]),
        }
      }
      return { ...match }
    })
    case REPLACE_ACTIVE_MESSAGE:
    case REPLACE_MESSAGE: return state.map((match, i, arr) => {
      // console.log(match)
      if(i === action.index) {
        return {
          ...match,
          chat: state[i].chat.map((message, ii, ar) => {
            if(message._id === action.message._id) return action.message
            return state[i].chat[ii]
          }),
        }
      }
      return { ...match }
    })
    case PUSH_ENQUEUED_CHAT: return [action.match, ...state]
    case PUSH_CHAT_MATCH: return [action.match, ...state]
    case RESET_MATCHES: return initialChatMatches
    case PUSH_MATCHES: return action.chatMatches
    // case PUSH_ENQUEUED_CHAT: return state.concat([action.match])
    default: return [...state]
  }
}

export const matchMessage = (state = 'Loading Matches...', action: AnyAction) => {
  switch(action.type) {
    case SET_MATCH_MESSAGE: return action.message
    default: return `${state}`
  }
}

const initialActiveChat: ReduxStore.Match = {
  _id: '00000000',
  timestamp: new Date(),
  userProfiles: [{
    _id: '000001',
    age: 21,
    name: 'nully',
    profile: {
      gender: 'male',
      images: [''],
      food: [''],
      goal: 'unsure',
      work: {
        position: '',
        employer: '',
      },
      aboutMe: 'How\'d you find this card?',
      school: {
        name: '',
      },
      questions: {},
    },
  }],
  state: 'matched',
  users: {
    '000001': 'accepted',
    '000002': 'accepted',
  },
  chat: [],
  dates: [],
}
export const activeChat = (state = initialActiveChat, action: AnyAction) => {
  switch(action.type) {
    case PUSH_MATCHED_CHAT: return { ...state, chat: [...state.chat, action.message] }
    case REPLACE_ACTIVE_MESSAGE: return { ...state, chat: state.chat.map((message, i, arr) => {
      if(message._id === action.message._id) return action.message
      return state.chat[i]
    })}
    case PUSH_ENQUEUED_CHAT: return action.message
    case PUSH_CHAT_MATCH: return action.match
    case PUSH_CHAT: return action.match
    default: return state ? { ...state } : null
  }
}
