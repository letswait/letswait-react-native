import { AnyAction } from 'redux';
import {
  CHANGE_STATUS_BAR,
  CHANGE_STATUS_BAR_COLOR,
  CHANGE_STATUS_BAR_THEME,
  CHANGE_TOAST,
  DISMISS_MODAL,
  IS_LOADING,
  NOT_LOADING,
  PUSH_SPINNER,
  RESET_SPINNER,
  SHOW_MODAL,
  TOGGLE_LOADING,
} from '../actions/navigation'

import { SocketReturnTypes } from 'app/types/models';

const initialStatusBarState = {
  color: '',
  theme: 'light-content',
}
export const statusBar = (state = initialStatusBarState, action: AnyAction) => {
  switch(action.type) {
    case CHANGE_STATUS_BAR_COLOR: return { ...state, color: action.color }
    case CHANGE_STATUS_BAR_THEME: return { ...state, theme: action.theme }
    case CHANGE_STATUS_BAR: return { color: action.color, theme: action.theme }
    default: return { ...state }
  }
}

const initialToastState = {
  message: 'No Action',
  duration: 1600,
  action: () => console.log('No Action to Press'),
}
export const toast = (state = initialToastState, action: AnyAction) => {
  return action.type === CHANGE_TOAST ?
    { message: action.message, action: action.action, duration: action.duration } :
    { ...state }
}

export const modal = (state = null, action: AnyAction) => {
  switch(action.type) {
    case SHOW_MODAL: return action.modalType
    case DISMISS_MODAL: return null
    default: return `${state}`
  }
}

const defaultSpinner: SocketReturnTypes.SpinnerInfo = {
  wheel: {
    segments: [
      { label: 'SUSHI' },
      { label: 'COMEDY' },
      { label: 'PIZZA' },
      { label: 'CHINESE' },
      { label: 'JAPANESE' },
      { label: 'MUSIC' },
      { label: 'COFFEE' },
      { label: 'MEXICAN' },
      { label: 'MOVIES' },
      { label: 'OUTDOOR' },
      { label: 'ITALIAN' },
      { label: 'AMERICAN' },
    ],
    chosenSegment: -1,
  },
  match: null,
  candidate: null,
  user: null,
}
export const spinner = (state = defaultSpinner , action: AnyAction) => {
  switch(action.type) {
    case RESET_SPINNER: return Object.assign({}, defaultSpinner, { user: action.user, candidate: action.candidate })
    case PUSH_SPINNER: return action.spinner
    default: return state !== null ? { ...state } : null
  }
}

export const loading = (state: boolean = false, action: AnyAction) => {
  switch(action.type) {
    case IS_LOADING: return true
    case TOGGLE_LOADING: return !state
    case NOT_LOADING: return false
    default: return !!state
  }
}
