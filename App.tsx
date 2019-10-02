import React from 'react'

import { Provider } from 'react-redux'

import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'
import configureStore, { history } from './configureStore'

const store = configureStore()

import StatusBar from './app/containers/StatusBar/StatusBar'
import NotificationService from './app/lib/NotificationService'

// Routing
import { Alert, AlertIOS, Platform } from 'react-native'
import AppRouter from './app/containers/AppRouter/AppRouter'
import SetupRouter from './app/containers/SetupRouter/SetupRouter'
import SplashScreen from './app/containers/Splash/Splash'
import WelcomeScreen from './app/containers/Welcome/Welcome'
import { authedApi } from './app/lib/api'
import { retrieveToken, storeToken } from './app/lib/asyncStorage'

import PushNotificationIOS, { PushNotificationPermissions } from '@react-native-community/push-notification-ios'

// PushNotificationIOS

// PushNotificationIOS.({
//   alertAction: 'View',
//   alertBody: 'testing the raw notification API now',
// })

// interface IProps {}
interface IState {
  permissions: PushNotificationPermissions
}
export default class App extends React.PureComponent<{}, IState> {
  // constructor(props: any) {
  //   super(props)
  //   this.notificationService = new NotificationService(
  //     this.onRegister.bind(this),
  //     this.onNotification.bind(this),
  //   )
  //   this.notificationService.configure(
  //     this.onRegister.bind(this),
  //     this.onNotification.bind(this),
  //   )
  // }
  // public onRegister = async ({ token, os }: { token: string, os: string }) => {
  //   const localToken = await retrieveToken('notificationToken')
  //   if(!localToken || localToken !== token) {
  //     const res: any = await authedApi.post('/api/user/post-sns-token', { token, os })
  //     if(res.ok && res.data && res.data.accepted) {
  //       const storedToken = await storeToken('notificationToken', token)
  //       if(!storedToken) Alert.alert('Could Not Store Token')
  //     }
  //   }
  // }
  // public onNotification = (notification: PushNotification) => {
  //   console.log('Got Push Notification:', notification)
  // }
  // public notificationService: any
  // tslint:disable-next-line: function-name
  public UNSAFE_componentWillMount() {
    PushNotificationIOS.addEventListener('register', this.onRegistered);
    PushNotificationIOS.addEventListener(
      'registrationError',
      this.onRegistrationError,
    );
    PushNotificationIOS.addEventListener(
      'notification',
      this.onRemoteNotification,
    );
    PushNotificationIOS.addEventListener(
      'localNotification',
      this.onLocalNotification,
    );
  }

  public componentWillUnmount() {
    PushNotificationIOS.removeEventListener('register', this.onRegistered);
    PushNotificationIOS.removeEventListener(
      'registrationError',
      this.onRegistrationError,
    );
    PushNotificationIOS.removeEventListener(
      'notification',
      this.onRemoteNotification,
    );
    PushNotificationIOS.removeEventListener(
      'localNotification',
      this.onLocalNotification,
    );
  }
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

  private sendLocalNotification() {
    PushNotificationIOS.presentLocalNotification({
      alertAction: 'View',
      alertBody: 'Sample local notification',
      applicationIconBadgeNumber: 1,
    });
  }

  private async onRegistered(deviceToken: string) {
    const localToken = await retrieveToken('notificationToken')
    if(!localToken || localToken !== deviceToken) {
      const res: any = await authedApi.post('/api/user/post-sns-token', { token: deviceToken })
      if(res.ok && res.data && res.data.accepted) {
        const storedToken = await storeToken('notificationToken', deviceToken)
        if(!storedToken) Alert.alert('Could Not Store Token')
      } else {
        Alert.alert('Could not register device token for remote push, please try again!')
      }
    }
  }

  private onRegistrationError(error: any) {
    Alert.alert(
      'Failed To Register For Remote Push',
      `Error (${error.code}): ${error.message}`,
      [
        {
          text: 'Dismiss',
          onPress: () => undefined,
        },
      ],
    );
  }

  private onRemoteNotification(notification: any) {
    const result = `Message: ${notification.getMessage()};\n
      badge: ${notification.getBadgeCount()};\n
      sound: ${notification.getSound()};\n
      category: ${notification.getCategory()};\n
      content-available: ${notification.getContentAvailable()}.`;

    Alert.alert('Push Notification Received', result, [
      {
        text: 'Dismiss',
        onPress: () => undefined,
      },
    ]);
  }

  private onLocalNotification(notification: any) {
    Alert.alert(
      'Local Notification Received',
      `Alert message: ${notification.getMessage()}`,
      [
        {
          text: 'Dismiss',
          onPress: () => undefined,
        },
      ],
    );
  }

  private showPermissions() {
    PushNotificationIOS.checkPermissions((permissions) => {
      this.setState({ permissions });
    });
  }
}
