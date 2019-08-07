import { ApiResponse } from 'apisauce';
import { Dispatch } from 'redux'
import { api } from '../../lib/api'

export const COMMIT_SIGNUP_CHANGE = 'COMMIT_SIGNUP_CHANGE'
export const RESET_SIGNUP = 'RESET_SIGNUP'
export const POPULATE_SIGNUP = 'POPULATE_SIGNUP'
export const POPULATE_SIGNUP_ROUTES = 'POPULATE_SIGNUP_ROUTES'
export const REQUEST_SIGNUP = 'REQUEST_SIGNUP'
export const RECEIVE_SIGNUP = 'RECEIVE_SIGNUP'
export const INCREMENT_ROUTE = 'INCREMENT_ROUTE'
export const DECREMENT_ROUTE = 'DECREMENT_ROUTE'

export const CLEAR_SMS = 'CLEAR_SMS'
export const PUSH_SMS = 'PUSH_SMS'
export const REQUEST_LOGIN = 'REQUEST_LOGIN'
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN'

export const REQUEST_FB_LOGIN = 'REEQUEST_FB_LOGIN'
export const RECEIVE_FB_LOGIN = 'RECEIVE_FB_LOGIN'

export const REQUEST_SMS_VALIDATION = 'REQUEST_SMS_VALIDATION'
export const RECEIVE_SMS_VALIDATION = 'RECEIVE_SMS_VALIDATION'
export const CLEAR_SMS_VALIDATION = 'CLEAR_SMS_VALIDATION'

export const CLEAR_ERROR_MESSAGE = 'CLEAR_ERROR_MESSAGE'
export const UPDATE_ERROR_MESSAGE = 'UPDATE_ERROR_MESSAGE'

export const RECEIVE_AUTHENTICATION = 'RECEIVE_AUTHENTICATION'
export const REQUEST_AUTHENTICATION = 'REQUEST_AUTHENTICATION'
export const CLEAR_AUTHENTICATION = 'CLEAR_AUTHENTICATION'
export const REQUEST_REFRESH_TOKEN = 'REQUEST_REFRESH_TOKEN'
export const RECEIVE_REFRESH_TOKEN = 'RECEIVE_REFRESH_TOKEN'

export const POPULATE_USER = 'POPULATE_USER'
export const CLEAR_USER = 'CLEAR_USER'

export function errorMessage(dispatch: Dispatch, res: any, customMessage?: string) {
  if(customMessage) {
    dispatch(updateErrorMessage(customMessage))
  } else if(res && res.data && res.data.message) {
    dispatch(updateErrorMessage(res.data.message))
  } else {
    const err = new Error('There was a problem with the server')
    console.log(err)
    dispatch(updateErrorMessage(err.message))
  }
}

export const clearErrorMessage = () => ({
  type: CLEAR_ERROR_MESSAGE,
})
export const updateErrorMessage = (message: string) => ({
  message,
  type: UPDATE_ERROR_MESSAGE,
})

const requestSMSValidation = (smsValid: boolean) => ({
  smsValid,
  type: REQUEST_SMS_VALIDATION,
})
const receiveSMSValidation = (smsValid: boolean) => ({
  smsValid,
  type: RECEIVE_SMS_VALIDATION,
})
export function fetchSMS(sms: string) {
  return (dispatch: Dispatch) => {
    api
      .post('/api/user/validate-sms', { sms })
      .then((res: ApiResponse<any>) => {
        if(res.ok && res.data.sms) {
          dispatch(receiveSMSValidation(res.data.sms))
        } else {
          errorMessage(dispatch, res)
        }
      })
  }
}
export const clearSMSValidation = () => ({
  type: CLEAR_SMS_VALIDATION,
})
