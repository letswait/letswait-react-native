import { AnyAction } from 'redux';
import {
  CHANGE_STATUS_BAR,
  CHANGE_STATUS_BAR_COLOR,
  CHANGE_STATUS_BAR_THEME,
  CHANGE_TOAST,
} from '../actions/navigation'

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
