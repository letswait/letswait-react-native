import { populateUser } from './auth'

// import { push } from 'connected-react-router';
// import { Alert } from 'react-native';
import { ThunkDispatch } from 'redux-thunk';
import { authedApi, refreshApi } from '../../lib/api';
import { storeToken } from '../../lib/asyncStorage';
import { ReduxStore } from '../../types/models'

import { Alert } from 'react-native'

export function pushChange(userChanges: ReduxStore.User) {
  return (dispatch: ThunkDispatch<{},{}, any>) => {
    authedApi.post('/api/profile/edit-settings', userChanges).then(async (res: any) => {
      if(res.ok && res.data) {
        const user = res.data
        console.log('USER: ', user)
        if(user && user._id) {
          const didStoreUser = await storeToken('user', JSON.stringify(user))
          if(didStoreUser) {
            dispatch(populateUser(user))
          } else {
            Alert.alert('Could not Save User')
          }
        }
      }
    })
  }
}
