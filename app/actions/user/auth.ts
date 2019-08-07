import { ApiResponse } from 'apisauce'
import { push } from 'connected-react-router'
import moment from 'moment'
import { AnyAction, Dispatch } from 'redux'
import { api, authedApi, refreshApi } from '../../lib/api'
import { retrieveToken, storeToken } from '../../lib/asyncStorage'
import {
  CLEAR_AUTHENTICATION,
  CLEAR_USER,
  POPULATE_SIGNUP_ROUTES,
  POPULATE_USER,
  RECEIVE_AUTHENTICATION,
  REQUEST_AUTHENTICATION,
} from './index'

import AsyncStorage from '@react-native-community/async-storage'
import { Alert } from 'react-native'
import { ThunkDispatch } from 'redux-thunk'

const clearedAuthentication = () => ({
  type: CLEAR_AUTHENTICATION,
})
export function clearAuthentication() {
  return (dispatch: Dispatch) => {
    AsyncStorage.multiRemove(['authToken','refreshToken','expiresIn'], (errors) => {
      if(!errors) dispatch(clearedAuthentication())
    })
  }
}

export const populateSignupRoutes = (routes: string[]) => ({
  routes,
  type: POPULATE_SIGNUP_ROUTES,
})
export const clearUser = () => ({
  type: CLEAR_USER,
})
export const populateUser = (user: any) => ({
  user,
  type: POPULATE_USER,
})
export function authDevice(inhibitAlerts: boolean = false) {
  return (dispatch: ThunkDispatch<{},{}, any>) => {
    authedApi.get('/api/user/check-auth').then(async (res: any) => {
      if(res.ok && res.data) {
        const {
          accepted,
          user,
          remainingSetupRoutes,
          requestRefreshToken,
        } = res.data
        console.log('USER: ', res.data)
        if(accepted && user) {
          dispatch(populateUser(user))
          const didStoreUser = await storeToken('user', JSON.stringify(user))
          if(didStoreUser) {
            dispatch(push('/app'))
          }
        } else if(
          !accepted &&
          remainingSetupRoutes &&
          remainingSetupRoutes.length
        ) {
          dispatch(populateSignupRoutes(remainingSetupRoutes))
        } else if(!accepted && requestRefreshToken) {
          refreshApi.get('/api/user/check-auth/error').then(async (result: any) => {
            if(result.ok) {
              if(result.data && result.data.accepted) {
                if(result.data.remainingSetupRoutes && result.data.remainingSetupRoutes.length) {
                  dispatch(populateSignupRoutes(result.data.remainingSetupRoutes))
                } else {
                  dispatch(populateUser(result.data.user))
                  const didStoreAuth = await storeToken('authToken', result.data.accessToken)
                  const didStoreExpire = await storeToken('expiresOn', result.data.expiresOn)
                  const didStoreUser = await storeToken('user', JSON.stringify(result.data.user))
                  if(didStoreUser && didStoreAuth && didStoreExpire) {
                    dispatch(push('/app'))
                  } else {
                    abortAuth('Could not store user in asyncStorage')
                  }
                }
              } else {
                abortAuth('no data supplied to result')
              }
            } else {
              abortAuth('something went wrong with the request')
            }
          })
        } else {
          abortAuth('data not accepted')
        }
      } else {
        abortAuth('res is not okay, something went wrong with the request')
      }
    })
    function abortAuth(reason?: string) {
      if(reason && !inhibitAlerts) Alert.alert('Error Authorizing Account', reason)
      dispatch(clearAuthentication())
      dispatch(push('/'))
    }
  }
}
