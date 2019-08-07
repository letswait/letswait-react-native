import { AnyAction } from 'redux';
import {
  CLEAR_AUTHENTICATION,
  CLEAR_ERROR_MESSAGE,
  CLEAR_SMS,
  CLEAR_SMS_VALIDATION,
  CLEAR_USER,
  COMMIT_SIGNUP_CHANGE,
  DECREMENT_ROUTE,
  INCREMENT_ROUTE,
  POPULATE_SIGNUP,
  POPULATE_SIGNUP_ROUTES,
  POPULATE_USER,
  PUSH_SMS,
  RECEIVE_AUTHENTICATION,
  RECEIVE_REFRESH_TOKEN,
  RECEIVE_SMS_VALIDATION,
  REQUEST_AUTHENTICATION,
  RESET_SIGNUP,
  UPDATE_ERROR_MESSAGE,
} from '../actions/user'

import {
  CHANGE_SEARCH_SETTINGS,
} from '../actions/profile'

import { Goal, ObjectOf } from '../types/helpers'

const initialSignupState: {
  sms?: string,
  code?: string,
  birth?: string,
  name?: string,
  gender?: string,
  sexualPreference?: string,
  photos?: string[],
  food?: ObjectOf<boolean>,
  goal?: Goal,
  routes: string[],
  currentRoute: number,
  showProgressBar: boolean,
} = {
  routes: [],
  currentRoute: 0,
  showProgressBar: false,
}
export const signup = (state = initialSignupState, action: AnyAction) => {
  switch(action.type) {
    case COMMIT_SIGNUP_CHANGE: return { ...state, ...action.changes }
    case RESET_SIGNUP: return initialSignupState
    case POPULATE_SIGNUP: return {
      ...initialSignupState,
      ...action.changes,
      ...action.routes,
    }
    case POPULATE_SIGNUP_ROUTES: return {
      ...state,
      routes: action.routes,
      showProgressBar: true,
    }
    case INCREMENT_ROUTE: return { ...state, currentRoute: state.currentRoute + 1 }
    case DECREMENT_ROUTE: return { ...state, currentRoute: state.currentRoute - 1 }
    default: return { ...state }
  }
}

const initialSMSValid: boolean = false
export const smsValid = (state = initialSMSValid, action: AnyAction) => {
  switch(action.type) {
    case RECEIVE_SMS_VALIDATION: return action.smsValid
    case CLEAR_SMS_VALIDATION: return initialSMSValid
    default: return !!state
  }
}

const initialErrorMessage: string = ''
export const errorMessage = (state = initialErrorMessage, action: AnyAction) => {
  switch(action.type) {
    case UPDATE_ERROR_MESSAGE: return action.message
    case CLEAR_ERROR_MESSAGE: return initialErrorMessage
    default: return `${state}`
  }
}

const initialAuthState: {
  token?: string,
  refreshToken?: string,
  expiresIn?: string,
  pending: boolean,
} = {
  pending: false,
}
export const authentication = (state = initialAuthState, action: AnyAction) => {
  switch(action.type) {
    case CLEAR_AUTHENTICATION: return initialAuthState
    case REQUEST_AUTHENTICATION: return { ...state, pending: true }
    case RECEIVE_AUTHENTICATION:
      return {
        ...state,
        token: action.token,
        refreshToken: action.refreshToken,
        expiresIn: action.expiresIn,
        pending: false,
      }
    default: return { ...state }
  }
}

const initialLoginState: string = ''
export const sms = (state = initialLoginState, action: AnyAction) => {
  switch(action.type) {
    case PUSH_SMS: return `${action.sms}`
    case CLEAR_SMS: return undefined
    default: return `${state}`
  }
}

const initialUserState: any = { unset: true }
export const user = (state = initialUserState, action: AnyAction) => {
  switch(action.type) {
    case CHANGE_SEARCH_SETTINGS: return {
      ...state,
      searchSettings: {
        ...state.searchSettings,
        ...action.payload,
      },
    }
    case CLEAR_USER: return initialUserState
    case POPULATE_USER: return { ...action.user }
    default: return { ...state }
  }
}
