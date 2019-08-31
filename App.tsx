import React from 'react'

import { Provider } from 'react-redux'

import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'
import configureStore, { history } from './configureStore'

const store = configureStore()

import StatusBar from './app/containers/StatusBar/StatusBar'
import NotificationService from './app/lib/NotificationService'

// Routing
import { Alert, Platform } from 'react-native'
import { PushNotification } from 'react-native-push-notification'
import AppRouter from './app/containers/AppRouter/AppRouter'
import SetupRouter from './app/containers/SetupRouter/SetupRouter'
import SplashScreen from './app/containers/Splash/Splash'
import WelcomeScreen from './app/containers/Welcome/Welcome'
import { authedApi } from './app/lib/api'
import { retrieveToken, storeToken } from './app/lib/asyncStorage'

export default class App extends React.Component {
  constructor(props: any) {
    super(props)
    this.notificationService = new NotificationService(
      this.onRegister.bind(this),
      this.onNotification.bind(this),
    )
    this.notificationService.configure(
      this.onRegister.bind(this),
      this.onNotification.bind(this),
    )
  }
  public onRegister = async ({ token, os }: { token: string, os: string }) => {
    const localToken = await retrieveToken('notificationToken')
    if(!localToken || localToken !== token) {
      const res: any = await authedApi.post('/api/user/post-sns-token', { token, os })
      if(res.ok && res.data && res.data.accepted) {
        const storedToken = await storeToken('notificationToken', token)
        if(!storedToken) Alert.alert('Could Not Store Token')
      }
    }
  }
  public onNotification = (notification: PushNotification) => {
    console.log('Got Push Notification:', notification)
  }
  public notificationService: any
  public render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <>
            <StatusBar/>
            <Switch>
              <Route exact path="/" component={WelcomeScreen}/>
              <Route path="/setup" component={SetupRouter}/>
              <Route path="/app" component={AppRouter}/>
            </Switch>
          </>
        </ConnectedRouter>
      </Provider>
    )
  }
}
