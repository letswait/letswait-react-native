import React from 'react'
import {
  Alert,
  Animated,
  AppState,
  Dimensions,
  Easing,
  Linking,
  Modal,
  ScrollView,
  View,
} from 'react-native'

import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'
import PushNotification from 'react-native-push-notification'

import { colors } from '../../../new_foundation'
import { authedApi } from '../../lib/api'

import AppToast from './AppToast'

import FastImage from 'react-native-fast-image'

import ChatComponent from './Chat/Chat'
import FeedComponent from './Feed/Feed'
import MatchesComponent from './Matches/Matches'
import ProfileComponent from './Profile/Profile'
import SettingsComponent from './Settings/Settings'

import MatchMakerModal from '../MatchMakerModal/MatchMakerModalComponent';

import { dismissModal, ModalType } from '../../actions/navigation/modal';

const { width, height } = Dimensions.get('window')

// tslint:disable-next-line: no-var-requires
const feedIcon = require('../../assets/ui/feed-icon.png')

import io from 'socket.io-client'
import { ReduxStore } from '../../types/models';
import ControlledCornerPage from './ControlledCornerPage';
// import config from '../../../config'

import PageTransition from './PageTransition'

import { Location } from 'history';
import { Route, Switch } from 'react-router';
import NavBar from './NavBar';

import DatePreviewComponent from './DatePreviewComponent'

interface IProps {
  changeThemeLight: () => any
  match: any,
  currentRoute: string
  location: Location
  getMatches: () => any
  pushChatMatch: (match: any) => any
  push: (route: string) => any
  pushChange: (change: ReduxStore.User) => void,
  showToast: (message: string, action: Function, duration?: number) => any
  dismissModal: () => any
  showModal: (modal: ModalType) => void
  activeChat: any
  toast: {
    message: string
    duration: number
    action: Function,
  },
  spinner: any,
  modal: string | null,
  user?: ReduxStore.User
}
interface IState {
  anim: Animated.Value;
  previousRoute?: string
  animating: boolean;
  location: -1 | 0 | 1 | 2,
  locationIsRunning: boolean
  locationServicesEnabled: boolean,
  notification: boolean,
  suggestedLocation: boolean
  loadingMatches: boolean
  activeMatch: {
    user: any,
    candidate: any,
    match: any,
  } | undefined
  backgroundColor: Animated.Value
  currentColor: string,
  nextColor: string,
}
export default class AppRouter extends React.PureComponent<IProps, IState> {
  public state: IState = {
    location: -1,
    anim: new Animated.Value(1),
    animating: false,
    loadingMatches: true,
    locationIsRunning: false,
    suggestedLocation: false,
    locationServicesEnabled: false,
    notification: false,
    activeMatch: undefined,
    backgroundColor: new Animated.Value(0),
    currentColor: colors.seafoam,
    nextColor: colors.seafoam,
  }
  private profilePage: any
  public componentDidMount() {
    AppState.addEventListener('change', this.appStateChange);
    this.props.getMatches()
    setTimeout(() => this.setState({ loadingMatches: false }), 10000)
    this.props.changeThemeLight()
    PushNotification.checkPermissions((permissions) => {
      this.setState({ notification: permissions.alert || false })
      if(!permissions.alert) {
        this.requestNotification()
        this.props.showToast('Open Settings to turn on Notifications', async () => {
          const canOpen = await Linking.canOpenURL('app-settings:')
          if(canOpen) {
            Linking.openURL('app-settings:')
          }
        })
      }
    })
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 30,
      distanceFilter: 50,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: false,
      startOnBoot: true,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
      interval: 10000,
      saveBatteryOnBackground: true,
    });

    BackgroundGeolocation.on('location', (location) => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask((taskKey) => {
        const {
          latitude,
          longitude,
          bearing,
          accuracy,
          altitude,
          provider,
          speed,
          time,
        } = location
        if(speed <= 5) {
          authedApi.post('/api/profile/post-geolocation', [longitude, latitude]).then()
        }
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      // handle stationary locations here
      // Actions.sendLocation(stationaryLocation);
    });

    BackgroundGeolocation.on('error', (error) => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
      this.setState({ locationIsRunning: true });
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');
      this.setState({ locationIsRunning: false });
    });

    BackgroundGeolocation.on('authorization', (status) => {
      // status === BackgroundGeolocation.
      // console.log(`[INFO] BackgroundGeolocation authorization status: ${status}`);
      // we need to set delay after permission prompt or otherwise alert will not be shown
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay after permission prompt or otherwise alert will not be shown
        setTimeout(() =>
          Alert.alert(
            'App requires location tracking',
            'Would you like to open app settings?',
            [
              {
                text: 'Yes',
                onPress: () => {
                  BackgroundGeolocation.showAppSettings()
                  setTimeout(() => this.forceUpdate(), 1000)
                },
              },
              {
                text: 'No',
                onPress: () => console.log('No Pressed'),
                style: 'cancel',
              },
            ],
        ),         1000);
      } else {
        this.setState({ location: status })
      }
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.on('abort_requested', () => {
      console.log('[INFO] Server responded with 285 Updates Not Required');

      // Here we can decide whether we want stop the updates or not.
      // If you've configured the server to return 285, then it means the server does not require further update.
      // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
      // But you might be counting on it to receive location updates in the UI,
      // so you could just reconfigure and set `url` to null.
    });

    BackgroundGeolocation.on('http_authorization', () => {
      console.log('[INFO] App needs to authorize the http requests');
    })
    this.checkGeolocation(true)
    // this.checkGeolocation()
  }
  // tslint:disable-next-line: function-name
  public UNSAFE_componentWillReceiveProps(nextProps: IProps) {
    if(nextProps.currentRoute !== this.props.currentRoute) {
      this.setBackgroundColor(nextProps.currentRoute)
      this.setState({ animating: true })
      Animated.timing(this.state.anim, {
        toValue: 0,
        duration: 75,
        useNativeDriver: true,
      }).start(() => {
        this.setState({ animating: false })
        Animated.timing(this.state.anim, {
          toValue: 1,
          duration: 75,
          useNativeDriver: true,
        }).start()
      })
    }
  }
  public checkGeolocation(silent = false) {
    // BackgroundGeolocation.checkStatus(({ isRunning }) => {
    //   this.setState({ locationIsRunning: isRunning });
    //   if (isRunning) {
    //     BackgroundGeolocation.start();
    //   }
    // });
    BackgroundGeolocation.checkStatus((status) => {
      // if(!permissions.alert) {
      // }
      this.setState({
        location: status.authorization,
        locationServicesEnabled: status.locationServicesEnabled,
        suggestedLocation: status.authorization === 1 ? false : this.state.suggestedLocation,
      })

      if(status.authorization === 1 && status.locationServicesEnabled) {
        if(!status.isRunning) {
          BackgroundGeolocation.start(); // triggers start on start event
        }
      } else {
        if(!silent) {
          BackgroundGeolocation.start()
        }
      }
    });
  }
  private appStateChange = (nextAppState: string) => {
    if(nextAppState === 'active' && !this.state.suggestedLocation) {
      this.requestGeolocation(true, false)
    }
  }
  private requestGeolocation(toggle = false, silent: boolean = false) {
    BackgroundGeolocation.checkStatus(({ isRunning, locationServicesEnabled, authorization }) => {
      if(isRunning) {
        if(toggle) BackgroundGeolocation.stop()
        return
      }
      // Background Location Denied, OnPress
      if(!silent) {
        // BackgroundGeolocation.start()
        if(locationServicesEnabled && authorization !== 1) {
          if(toggle) {
            if(!this.state.suggestedLocation) {
              this.setState({ suggestedLocation: true })
              this.props.showToast('For the best experience, Turn on Background Location', async () => {
                const canOpen = await Linking.canOpenURL('app-settings:')
                if(canOpen) {
                  Linking.openURL('app-settings:')
                }
              })
            }
          } else {
            Alert.alert(
              'Location services disabled',
              'Would you like to open location settings?',
              [
                {
                  text: 'Yes',
                  onPress: async () => {
                    const canOpen = await Linking.canOpenURL('app-settings:')
                    if(canOpen) {
                      Linking.openURL('app-settings:')
                    } else {
                      this.props.showToast('Could not open settings', () => console.log('clicked item'))
                    }
                  },
                },
                {
                  text: 'No',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            )
          }
          return
        }
      }
      this.checkGeolocation(silent)
    })
  }
  private requestNotification() {
    PushNotification.requestPermissions(['alert', 'badge', 'sound']).then((permissions) => {
      this.setState({ notification: permissions.alert || false })
    })
  }
  private setBackgroundColor(nextRoute: string): void {
    let nextColor = colors.seafoam
    if(nextRoute === '/app/chat') nextColor = colors.turmeric
    this.setState({ nextColor })
    this.state.backgroundColor.setValue(0)
    Animated.timing(this.state.backgroundColor, {
      toValue:  1,
      duration: 75,
      delay: 50,
    }).start(() => this.setState({ currentColor: nextColor }))
  }
  public componentWillUnmount() {
    BackgroundGeolocation.events.forEach((event) => {
      BackgroundGeolocation.removeAllListeners(event)
    });
    AppState.removeEventListener('change', this.appStateChange);
  }
  public navigatorScroll: ScrollView | null = null
  public navbar: NavBar | null = null
  public render() {
    const appWrapper = {
      ...style.appWrapper,
      backgroundColor: this.state.backgroundColor.interpolate({
        inputRange: [0, 1],
        outputRange: [this.state.currentColor, this.state.nextColor],
      }),
    }
    return (
      <Animated.View style={appWrapper}>
        <NavBar
          push={(route: string) => this.props.push(route)}
          currentRoute={this.props.currentRoute}
          ref={c => this.navbar = c}
        />
        <PageTransition
          anim={this.state.anim}
          currentRoute={this.props.currentRoute}
          animating={this.state.animating}
        >
          <Switch location={this.props.location}>
            <Route
              exact
              path="/app"
              render={() => (
                <FeedComponent
                  // shouldUpdate={this.props.currentRoute === '/app'}
                  geolocation={this.state.location}
                  locationServicesEnabled={this.state.locationServicesEnabled}
                  onGeolocation={() => BackgroundGeolocation.start()}
                  onScrollUp={() => this.navbar && this.navbar.animateUp()}
                  onScrollDown={() => this.navbar && this.navbar.animateDown()}
                />
              )}
            />
            <Route
              path="/app/matches"
              component={MatchesComponent}
            />
            <Route
              path="/app/chat"
              component={ChatComponent}
            />
            <Route
              path="/app/settings"
              render={() => (
                <ControlledCornerPage
                  topLeft={
                    <View style={style.profileContainer}>
                      <FastImage
                        style={style.profileImage}
                        source={{ uri: this.props.user!.profile.images[0] }}
                      />
                    </View>
                  }
                  onTopLeft={() => this.props.showModal('profile')}
                >
                  <SettingsComponent
                    setUser={(newUser: ReduxStore.User) => this.props.pushChange(newUser)}
                  />
                </ControlledCornerPage>
              )}
            />
          </Switch>
        </PageTransition>
        <AppToast {...this.props.toast} />
        <Modal visible={!!this.props.modal && this.props.modal !== 'null'} animationType={'slide'} transparent>
          {this.props.modal && this.props.modal === 'spinner' && (
            <ControlledCornerPage

            >
              <MatchMakerModal
                pushChat={(match: any, candidate: any) => this.props.pushChatMatch(match)}
                dismiss={() => this.props.dismissModal()}
                spinner={this.props.spinner}
              />
            </ControlledCornerPage>
          )}
          {this.props.modal && this.props.modal === 'profile' && (
            <ControlledCornerPage
              topLeft="chevron-left"
              onTopLeft={() => this.props.dismissModal()}
            >
              <ProfileComponent
                shouldUpdate
                setUser={(newUser: ReduxStore.User) => this.props.pushChange(newUser)}
              />
            </ControlledCornerPage>
          )}
          {this.props.modal && this.props.modal === 'datepreview' && (
            <DatePreviewComponent
              name={this.props.user ? this.props.user.name : ''}
              match={this.props.activeChat}
              dismiss={() => this.props.dismissModal()}
            />
          )}
        </Modal>
      </Animated.View>
    )
  }
}

const style = {
  profileContainer: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 25,
    overflow: 'hidden' as 'hidden',
    borderColor: colors.cloud,
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  appWrapper: {
    width,
    height,
    flexDirection: 'column-reverse' as 'column-reverse',
    backgroundColor: 'transparent',
  },
  appNav: {
    width,
    height,
    backgroundColor: 'transparent',
  },
  appNavInner: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
  },
}
