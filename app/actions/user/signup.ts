import { Dispatch } from 'redux'
import { api, authedApi } from '../../lib/api'
// import { initialSignupRoutes } from '../../reducers/user'

import { ApiResponse } from 'apisauce';
import { goBack, push } from 'connected-react-router';
import {
  clearSMSValidation,
  COMMIT_SIGNUP_CHANGE,
  DECREMENT_ROUTE,
  errorMessage,
  INCREMENT_ROUTE,
  POPULATE_SIGNUP_ROUTES,
  RESET_SIGNUP,
  updateErrorMessage,
} from './index'

import { ThunkDispatch } from 'redux-thunk';
import { storeToken } from '../../lib/asyncStorage'
import { authDevice, populateSignupRoutes, populateUser } from './auth'

import { startLoading, stopLoading } from '../navigation'

export const incrementRoute = () => ({
  type: INCREMENT_ROUTE,
})
const decrementRoute = () => ({
  type: DECREMENT_ROUTE,
})
export function previousRoute() {
  return (dispatch: Dispatch, getState: () => any) => {
    const { router } = getState()
    dispatch(goBack())
    if(router.location.path === '/setup/sms') {
      dispatch(clearSMSValidation())
    } else {
      dispatch(decrementRoute())
    }
  }
}

export const signupChange = (changes: any) => ({
  changes,
  type: COMMIT_SIGNUP_CHANGE,
})

/**
 * Posts SMS code to /auth
 * @param sms - International SMS String with no decorators or spaces
 * expects rest.data:
 * {
 *    accepted: boolean,
 *    message?: string,
 *    authToken?: string,
 *    refreshToken?: string
 * }
 */
export function postSMS(sms: string) {
  return (dispatch: Dispatch) => {
    dispatch(startLoading())
    api
      .post('/api/user/auth', { sms })
      .then(async (res: ApiResponse<any>) => {
        /** @todo place all this in a try-catch block for simpler error handling */
        if(res.ok && res.data.accepted && res.data.authToken && res.data.refreshToken) {
          // Store Tokens
          const didStoreAuth = await storeToken('authToken', res.data.authToken)
          const didStoreRefresh =  await storeToken('refreshToken', res.data.refreshToken)
          const didClearExpire = await storeToken('expiresIn', '')
          dispatch(stopLoading())
          if(didStoreAuth && didStoreRefresh && didClearExpire) {
            // Add SMS to Signup data, keeps it available for code validation.
            dispatch(signupChange({ sms }))
          } else {
            errorMessage(
              dispatch,
              res,
              `Could not store tokens: {\n
                authToken: ${didStoreAuth},\n
                refreshToken: ${didStoreRefresh},\n
                expireCleared: ${didClearExpire}\n
              }`,
            )
          }
        } else {
          errorMessage(
            dispatch,
            res,
            `Something went wrong with the request :/\n ${JSON.stringify(res)}`,
          )
        }
      })
  }
}

/**
 * Posts SMS and SMS Code to login or signup to app.
 * @param sms - International SMS String with no decorators or spaces
 * @param code - SMS Code, 4 digits long
 */
export function postCode(sms: string, code: string) {
  return (dispatch: Dispatch) => {
    dispatch(startLoading())
    authedApi
      .post('/api/user/code', { sms, code })
      .then(async (res: ApiResponse<any>) => {
        const {
          accepted,
          user,
          remainingSetupRoutes,
        } = res.data
        dispatch(stopLoading())
        if(res.ok && res.data && accepted) {
          // If SMS Code is validated enter app
          console.log()
          if(user) {
            dispatch(populateUser(user))
            const didStoreUser = await storeToken('user', JSON.stringify(user))
            if(didStoreUser) {
              dispatch(push('/app'))
            }
          } else if(remainingSetupRoutes && remainingSetupRoutes.length) {
            // Or Navigate to further setup
            dispatch(populateSignupRoutes(remainingSetupRoutes))
            dispatch(push(remainingSetupRoutes[0]))
          } else {
            errorMessage(dispatch, res, JSON.stringify(res.data))
          }
        } else {
          errorMessage(dispatch, res, JSON.stringify(res.headers))
        }
      })
  }
}

/**
 * @todo replace this with 'postChangeProfile()'
 */
export function postChangeProfile() {
  return (dispatch: ThunkDispatch<{},{},any>, getState: () => any) => {
    dispatch(startLoading())
    const { signup } = getState()
    authedApi
      .post('/api/profile/post-change-profile', {
        ...(signup.gender ? { gender: signup.gender } : null),
        ...(signup.sexualPreference ? { sexualPreference: signup.sexualPreference } : null),
        ...(signup.photos && signup.photos.length ? { photos: signup.photos } : null),
        ...(signup.food ? (() => {
          const approvedFood: string[] = []
          console.log('Here is the food: ', signup.food)
          for(const food in signup.food) {
            if(signup.food[food]) approvedFood.push(food)
          }
          console.log(approvedFood)
          return { food: approvedFood }
        })() : null),
        ...(signup.name ? { name: signup.name } : null),
        ...(signup.birth ? { birth: signup.birth } : null),
        ...(signup.goal ? { goal: signup.goal } : null),
      })
      .then((res: ApiResponse<any>) => {
        dispatch(stopLoading())
        if(res.ok) {
          if(res.data && res.data.remainingSetupRoutes && res.data.remainingSetupRoutes.length) {
            dispatch(populateSignupRoutes(res.data.remainingSetupRoutes))
          } else {
            dispatch(authDevice())
          }
        } else {
          errorMessage(dispatch, res)
        }
      })
  }
}
