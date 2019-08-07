import React from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'
import { isIphoneX } from 'react-native-iphone-x-helper'
import LinearGradient from 'react-native-linear-gradient'
import PushNotification from 'react-native-push-notification'
import Feather from 'react-native-vector-icons/Feather'
import { Route } from 'react-router'
import SwipeNavigation from './SwipeNavigation'

import config from '../../../config'
import { colors, spacing, type } from '../../../foundation'
import BackButton from '../../components/Buttons/BackButton'
import { authedApi } from '../../lib/api'

import { ObjectOf } from '../../types/helpers'
import AppToast from './AppToast'

import FeedComponent from './Feed/Feed'
import MatchesComponent from './Matches/Matches'
import ProfileComponent from './Profile/Profile'
import SettingsComponent from './Settings/Settings'

const { width, height } = Dimensions.get('window')

// tslint:disable-next-line: no-var-requires
const feedIcon = require('../../assets/ui/feed-icon.png')

interface IProps {
  changeThemeLight: () => any
  currentRoute: string
  push: (route: string) => any
  showToast: (message: string, action: Function, duration?: number) => any
  toast: {
    message: string
    duration: number
    action: Function,
  }
  user?: any
}
interface IState {
  navRotation: Animated.Value
  swipeRotation: Animated.Value
  location: 0 | 1 | 2,
  locationIsRunning: boolean
  notification: boolean,
}
export default class AppRouter extends React.Component<IProps, IState> {
  public state: IState = {
    navRotation: new Animated.Value(this.getRouteRotation(this.props.currentRoute)),
    swipeRotation: new Animated.Value(0),
    location: 0,
    locationIsRunning: false,
    notification: false,
  }
  private profilePage: any
  private settingsPage: any
  private feedPage: any
  private matchPage: any
  private chatPage: any
  public componentDidMount() {
    this.props.changeThemeLight()
    PushNotification.checkPermissions((permissions) => {
      this.setState({ notification: permissions.alert || false })
      if(permissions.alert === false) {
        this.props.showToast('Open Settings to turn on Notifications', async () => {
          const canOpen = await Linking.canOpenURL('app-settings:')
          if(canOpen) {
            Linking.openURL('app-settings:')
          }
        })
      } else if(permissions.alert === undefined) {
        this.requestNotification()
      }
    })
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 30,
      distanceFilter: 50,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: true,
      startOnBoot: true,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
      interval: 10000,
      saveBatteryOnBackground: true,
      url: `${config.api}/api/profile/post-geolocation`,
      httpHeaders: Object.assign({}, authedApi.headers),
      postTemplate: {
        lat: '@latitude',
        lon: '@longitude',
      },
    });

    BackgroundGeolocation.on('location', (location) => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask((taskKey) => {
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
      this.setState({ locationIsRunning: true, location: 1 });
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');
      this.setState({ locationIsRunning: false });
    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log(`[INFO] BackgroundGeolocation authorization status: ${status}`);
        // we need to set delay after permission prompt or otherwise alert will not be shown
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(() =>
          Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
            { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
          ]),      1000);
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
    this.requestGeolocation(false, true)
    // this.checkGeolocation()
  }
  public checkGeolocation() {
    BackgroundGeolocation.checkStatus((status) => {
      console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
      console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
      console.log(`[INFO] BackgroundGeolocation auth status: ${status.authorization}`);

      this.setState({ location: status.authorization })

      if(status.authorization === BackgroundGeolocation.AUTHORIZED && status.locationServicesEnabled) {
        if(!status.isRunning) {
          BackgroundGeolocation.start(); // triggers start on start event
        }
      }
    });
  }
  public componentDidUpdate(prevProps: IProps) {
    if(JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      if(this.props.currentRoute !== prevProps.currentRoute) {
        this.setRotation(this.getRouteRotation(this.props.currentRoute))
      }
    }
  }
  private requestGeolocation(toggle = false, silent?: boolean) {
    BackgroundGeolocation.checkStatus(({ isRunning, locationServicesEnabled, authorization }) => {
      if(isRunning) {
        if(toggle) BackgroundGeolocation.stop()
        return
      }
      // Background Location Denied
      if(!locationServicesEnabled) {
        Alert.alert(
          'Location services disabled',
          'Would you like to open location settings?',
          [
            {
              text: 'Yes',
              onPress: () => BackgroundGeolocation.showLocationSettings(),
            },
            {
              text: 'No',
              onPress: () => console.log('No Pressed'),
              style: 'cancel',
            },
          ],
        )
        return
      }
      if (authorization === 0) {
        BackgroundGeolocation.start();
      } else if (authorization === BackgroundGeolocation.AUTHORIZED) {
        BackgroundGeolocation.start()
      } else if(!silent) {
        BackgroundGeolocation.start()
      }
    })
  }
  private requestNotification() {
    PushNotification.requestPermissions(['alert', 'badge', 'sound']).then((permissions) => {
      this.setState({ notification: permissions.alert || false })
    })
    // Permissions.request('notification').then(notification => this.setState({ notification }))
  }
  private setRotation(rotInt: number) {
    const prevRot = (this.state as any).navRotation._value
    Animated.timing(this.state.navRotation, {
      toValue: rotInt,
      easing: Easing.elastic(1),
      duration: 300,
    }).start(() => {
      switch(prevRot) {
        case 0.75: this.profilePage.forceUpdate()
          break;
        default: console.log('nothing to update!')
      }
    })
  }
  private getRouteRotation(route: string) {
    switch(route) {
      case '/app/settings': return 1
      case '/app/profile': return 0.75
      case '/app': return 0.5
      case '/app/matches': return 0.25
      case '/app/matches/chat': return 0
      default: return 0.5
    }
  }
  private getRotationRoute(rot: number) {
    switch(rot) {
      case 1: return '/app/settings'
      case 0.75: return '/app/profile'
      case 0.5: return '/app'
      case 0.25: return '/app/matches'
      case 0: return '/app/matches/chat'
      default: return '/app'
    }
  }
  private releaseSwipe(gestureState: any) {
    const { dx, vx } = gestureState
    const navRot = (this.state as any).navRotation._value
    if((dx > 140 || (dx > 30 && vx > 0.5)) && navRot !== 1) {
      // Swipe Right - go left
      this.props.push(this.getRotationRoute(navRot + 0.25))
    } else if((dx < -140 || (dx < -30 && vx < -0.5)) && navRot !== 0.25) {
      // Swipe Left - go right
      this.props.push(this.getRotationRoute(navRot - 0.25))
    } else {
      this.props.push(this.getRotationRoute(navRot))
    }
  }
  public componentWillUnmount() {
    BackgroundGeolocation.events.forEach((event) => {
      BackgroundGeolocation.removeAllListeners(event)
    });
  }
  public render() {
    const buttonPosition = (n: number) => {
      return {
        ...style.buttonPosition,
        transform: [{ rotate: `${n*13}deg` }],
      }
    }
    const rotation = Animated.add(this.state.navRotation, this.state.swipeRotation).interpolate({
      inputRange: [0, 1],
      outputRange: ['26deg', '-26deg'],
      extrapolate: 'clamp',
    })
    const navBackground = {
      ...style.navBackground,
      transform: [
        { translateX: (-width*1.7) + (width/2) },
        { rotate: rotation },
      ],
    }
    const navButtonWrapper = (n: number) => {
      const stabalization = this.state.navRotation.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [
          `${(-2-n) * 13}deg`,
          `${(-1-n) * 13}deg`,
          `${(0-n) * 13}deg`,
          `${(1-n) * 13}deg`,
          `${(2-n) * 13}deg`,
        ],
      })
      return  {
        ...style.navButtonWrapper,
        transform: [
          { rotate: stabalization },
        ],
      }
    }
    const navText = (n: number) => {
      const opacity = this.state.navRotation.interpolate({
        inputRange: [0, 0.25,0.5, 0.75, 1],
        outputRange: [
          -2-n ? 0 : 1,
          -1-n ? 0 : 1,
          -n ? 0 : 1,
          1-n ? 0 : 1,
          2-n ? 0 : 1,
        ],
      })
      const rollout = this.state.navRotation.interpolate({
        inputRange: [0, 0.25,0.5, 0.75, 1],
        outputRange: [
          -2-n ? 0 : 150,
          -1-n ? 0 : 150,
          -n ? 0 : 150,
          1-n ? 0 : 150,
          2-n ? 0 : 150,
        ],
      })
      return {
        ...style.navText,
        opacity,
        maxWidth: rollout,
      }
    }
    const screen = (n: number) => {
      const w = 375
      const translateX = this.state.navRotation.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [
          (-2-n)*w, // -750
          (-1-n)*w, // -375
          (0-n)*w, // 0
          (1-n)*w, // 375
          (2-n)*w, // 750
        ],
      })
      const translateY = this.state.navRotation.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [
          -2-n ? -64 : 0,
          -1-n ? -64 : 0,
          -n ? -64 : 0,
          1-n ? -64 : 0,
          2-n ? -64 : 0,
        ],
      })
      const scale = this.state.navRotation.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [
          -2-n ? 0.6 : 1,
          -1-n ? 0.6 : 1,
          -n ? 0.6 : 1,
          1-n ? 0.6 : 1,
          2-n ? 0.6 : 1,
        ],
      })
      const opacity = this.state.navRotation.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [
          -2-n ? 0 : 1,
          -1-n ? 0 : 1,
          -n ? 0 : 1,
          1-n ? 0 : 1,
          2-n ? 0 : 1,
        ],
      })
      return {
        ...style.screenContainer,
        opacity,
        transform: [
          { scale },
          { translateX },
          { translateY },
        ],
      }
    }
    return (
      <View style={style.appWrapper}>
        <SwipeNavigation
          onRelease={(e: any) => this.releaseSwipe(e)}
        />
        <Animated.View
          style={{ ...screen(0), ...style.cardScreen }}
          pointerEvents={this.props.currentRoute === '/app' ? 'auto' : 'none'}
        >
          <FeedComponent
            shouldUpdate={this.props.currentRoute === '/app'}
            geolocation={this.state.location}
            onGeolocation={() => this.requestGeolocation()}
          />
        </Animated.View>
        <Animated.View
          style={{ ...screen(-1), ...style.marginPaddedScreen }}
          pointerEvents={this.props.currentRoute === '/app/matches' ? 'auto' : 'none'}
        >
          <MatchesComponent
            shouldUpdate={this.props.currentRoute.indexOf('/app/matches') !== -1}
          />
        </Animated.View>
        <Animated.View
          style={screen(1)}
          pointerEvents={this.props.currentRoute === '/app/profile' ? 'auto' : 'none'}
        >
          <ProfileComponent
            shouldUpdate={this.props.currentRoute.indexOf('/app/profile') !== -1}
            ref={c => this.profilePage = c}
          />
        </Animated.View>
        <Animated.View
          style={screen(2)}
          pointerEvents={this.props.currentRoute === '/app/settings' ? 'auto' : 'none'}
        >
          <SettingsComponent
            shouldUpdate={this.props.currentRoute.indexOf('/app/settings') !== -1}
          />
        </Animated.View>
        <View style={style.navContainer}>
          <Animated.View style={navBackground}>
            <View style={buttonPosition(-2)} pointerEvents="box-none">
              <Animated.View style={navButtonWrapper(-2)} pointerEvents="box-none">
                <TouchableOpacity
                  onPress={() => this.props.push('/app/matches/chat')}
                  style={style.navButton}
                >
                  <Feather
                    name="message-circle"
                    size={26}
                    color={softwhite}
                    style={{ width: 26 }}
                  />
                  <Animated.Text style={navText(-2)}>Chat</Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
            <View style={buttonPosition(-1)} pointerEvents="box-none">
              <Animated.View style={navButtonWrapper(-1)} pointerEvents="box-none">
                <TouchableOpacity
                  onPress={() => this.props.push('/app/matches')}
                  style={style.navButton}
                >
                  <Feather
                    name="inbox"
                    size={26}
                    color={softwhite}
                    style={{ width: 26 }}
                  />
                  <Animated.Text style={navText(-1)}>Matches</Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
            <View style={buttonPosition(0)} pointerEvents="box-none">
              <Animated.View style={navButtonWrapper(0)} pointerEvents="box-none">
                <TouchableOpacity
                  onPress={() => this.props.push('/app')}
                  style={style.navButton}
                >
                  {/* <Feather name="menu" size={26} color={softwhite} />
                  <Animated.Text style={navText(0)}>Feed</Animated.Text> */}
                  <Image
                    source={feedIcon}
                    width={29}
                    height={29}
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
            <View style={buttonPosition(1)} pointerEvents="box-none">
              <Animated.View style={navButtonWrapper(1)} pointerEvents="box-none">
                <TouchableOpacity
                  onPress={() => this.props.push('/app/profile')}
                  style={style.navButton}
                >
                  <Feather name="user" size={26} color={softwhite} />
                  <Animated.Text style={navText(1)}>
                    {this.props.user && this.props.user.name ? this.props.user.name : 'Profile'}
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
            <View style={buttonPosition(2)} pointerEvents="box-none">
              <Animated.View style={navButtonWrapper(2)} pointerEvents="box-none">
                <TouchableOpacity
                  onPress={() => this.props.push('/app/settings')}
                  style={style.navButton}
                >
                  <Feather name="settings" size={26} color={softwhite} />
                  <Animated.Text style={navText(2)}>Settings</Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        </View>
        <AppToast {...this.props.toast} />
      </View>
    )
  }
}

const softwhite = '#fafafa'

const diameter = width*3.4
const radius = width*1.7
const style = {
  appWrapper: {
    width,
    height,
    backgroundColor: colors.transparent,
  },
  navContainer: {
    width,
    height: isIphoneX ? 120 : 96,
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
  },
  navBackground: {
    position: 'absolute' as 'absolute',
    width: diameter,
    height: diameter,
    bottom: 0,
    borderRadius: radius,
    backgroundColor: '#A372E2',
  },
  buttonPosition: {
    padding: 21,
    flexDirection: 'row' as 'row',
    width: diameter,
    height: diameter,
    position: 'absolute' as 'absolute',
    bottom: 0,
    left: 0,
    alignItems: 'flex-end' as 'flex-end',
    justifyContent: 'center' as 'center',
  },
  navButtonWrapper: {
    overflow: 'hidden' as 'hidden',
    minWidth: 26,
    flex: 1,
    height: 26,
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
  },
  navButton: {
    flex: 0,
    height: 26,
    minWidth: 26,
    flexDirection: 'row' as 'row',
  },
  navText: {
    marginLeft: 4,
    ...type.large,
    lineHeight: 26,
    flex: 0,
    color: softwhite,
  },
  screenContainer: {
    width,
    height,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: colors.transparent,
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  cardScreen: {
    padding: 16,
    paddingBottom: isIphoneX ? 40 : 20,
    paddingTop: isIphoneX ? 136 : 112,
  },
  flushPaddedScreen: {
    paddingTop: isIphoneX ? 104 : 78,
  },
  marginPaddedScreen: {
    padding: 16,
    paddingTop: isIphoneX ? 136 : 112,
    paddingBottom: 0,
  },
}
