import React from 'react'
import {
  Alert,
  Animated,
  AppState,
  Dimensions,
  Easing,
  Image,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'
// import { AuthorizationStatus } from '../../../node_modules/@mauron85/react-native-background-geolocation/index'
import FastImage from 'react-native-fast-image';
import { isIphoneX } from 'react-native-iphone-x-helper'
import LinearGradient from 'react-native-linear-gradient'
import PushNotification from 'react-native-push-notification'
import Feather from 'react-native-vector-icons/Feather'
import { Route } from 'react-router'
import SwipeNavigation from './SwipeNavigation'

import config from '../../../config'
import { colors, spacing, type } from '../../../foundation'
import BackButton from '../../components/Buttons/BackButton'
import { api, authedApi } from '../../lib/api'

import { ObjectOf } from '../../types/helpers'
import AppToast from './AppToast'

import ChatComponent from './Chat/Chat'
import FeedComponent from './Feed/Feed'
import MatchesComponent from './Matches/Matches'
import ProfileComponent from './Profile/Profile'
import SettingsComponent from './Settings/Settings'

import MatchMakerModal from '../MatchMakerModal/MatchMakerModalComponent';

import { dismissModal } from '../../actions/navigation/modal';

const { width, height } = Dimensions.get('window')

// tslint:disable-next-line: no-var-requires
const feedIcon = require('../../assets/ui/feed-icon.png')

import io from 'socket.io-client'
import { ReduxStore } from '../../types/models';
// import config from '../../../config'

interface IProps {
  changeThemeLight: () => any
  currentRoute: string
  getMatches: () => any
  pushChatMatch: (match: any) => any
  push: (route: string) => any
  pushChange: (change: ReduxStore.User) => void,
  showToast: (message: string, action: Function, duration?: number) => any
  dismissModal: () => any
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
  navRotation: Animated.Value
  swipeRotation: Animated.Value
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
}
export default class AppRouter extends React.PureComponent<IProps, IState> {
  public state: IState = {
    navRotation: new Animated.Value(this.getRouteRotation(this.props.currentRoute)),
    swipeRotation: new Animated.Value(0),
    location: -1,
    loadingMatches: true,
    locationIsRunning: false,
    suggestedLocation: false,
    locationServicesEnabled: false,
    notification: false,
    activeMatch: undefined,
  }
  private profilePage: any
  private settingsPage: any
  private feedPage: any
  private matchPage: any
  private chatPage: any
  public componentDidMount() {
    // const socket = io(config.socket)
    // socket.connect()
    // socket.on('connect', () => {
    //   // call the server-side function 'adduser' and send one parameter (value of prompt)
    //   Alert.alert('Connected to socket!')
    //   // socket.emit('adduser', prompt("What's your name?"));
    // })
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
      // url: `${config.api}/api/profile/post-geolocation`,
      // httpHeaders: Object.assign({}, authedApi.headers),
      // postTemplate: {
      //   lat: '@latitude',
      //   lon: '@longitude',
      // },
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
  public checkGeolocation(silent = false) {
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
  public componentDidUpdate(prevProps: IProps) {
    if(JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      if(this.props.currentRoute !== prevProps.currentRoute) {
        this.setRotation(this.getRouteRotation(this.props.currentRoute))
      }
    }
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
      // BackgroundGeolocation.start()
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
      case '/app/chat': return 0
      default: return 0.5
    }
  }
  private getRotationRoute(rot: number) {
    switch(rot) {
      case 1: return '/app/settings'
      case 0.75: return '/app/profile'
      case 0.5: return '/app'
      case 0.25: return '/app/matches'
      case 0: return '/app/chat'
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
    AppState.removeEventListener('change', this.appStateChange);
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
    const navButtonWrapper = (n: number, hideOverflow: boolean = true) => {
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
        ...(hideOverflow ? null : { overflow: 'visible' as 'visible' }),
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

    const matchedUser = this.props.activeChat ?
      this.props.activeChat.userProfiles[0]._id === this.props.user!._id ?
        this.props.activeChat.userProfiles[1] :
        this.props.activeChat.userProfiles[0] :
      null

    console.log(matchedUser)

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
            locationServicesEnabled={this.state.locationServicesEnabled}
            onGeolocation={() => this.requestGeolocation()}
          />
        </Animated.View>
        <Animated.View
          style={{ ...screen(-1), ...style.marginPaddedScreen }}
          pointerEvents={this.props.currentRoute === '/app/matches' ? 'auto' : 'none'}
        >
          <MatchesComponent
            shouldUpdate={this.props.currentRoute === '/app/matches' || this.state.loadingMatches}
          />
        </Animated.View>
        <Animated.View
          style={screen(1)}
          pointerEvents={this.props.currentRoute === '/app/profile' ? 'auto' : 'none'}
        >
          <ProfileComponent
            shouldUpdate={this.props.currentRoute === '/app/profile'}
            ref={c => this.profilePage = c}
            setUser={(newUser: ReduxStore.User) => this.props.pushChange(newUser)}
          />
        </Animated.View>
        <Animated.View
          style={screen(2)}
          pointerEvents={this.props.currentRoute === '/app/settings' ? 'auto' : 'none'}
        >
          <SettingsComponent
            shouldUpdate={this.props.currentRoute === '/app/settings'}
            setUser={(newUser: ReduxStore.User) => this.props.pushChange(newUser)}
          />
        </Animated.View>
        <Animated.View
          style={screen(-2)}
          pointerEvents={this.props.currentRoute === '/app/chat' ? 'auto' : 'none'}
        >
          <ChatComponent
            shouldUpdate={this.props.currentRoute === '/app/chat'}
          />
        </Animated.View>
        <View style={style.navContainer}>
          <Animated.View style={navBackground}>
            <View style={buttonPosition(-2)} pointerEvents="box-none">
              <Animated.View style={navButtonWrapper(-2, false)} pointerEvents="box-none">
                {this.props.currentRoute === '/app/chat' && !!matchedUser ?
                  <TouchableOpacity
                    onPress={() => this.props.push('/app/chat')}
                    style={style.chatHeader}
                  >
                    <FastImage
                      style={style.chatHeaderImage}
                      source={{ uri: matchedUser.profile.images[0] }}
                    />
                    <Text style={style.chatHeaderText}>
                      {matchedUser.name}
                    </Text>
                  </TouchableOpacity> : null
                  // <TouchableOpacity
                  //   onPress={() => this.props.push('/app/chat')}
                  //   style={style.navButton}
                  // >
                  //   <Feather
                  //     name="search"
                  //     size={26}
                  //     color={softwhite}
                  //     style={{ width: 26 }}
                  //   />
                  //   <Animated.Text style={navText(-2)}>Search</Animated.Text>
                  // </TouchableOpacity>
                }
              </Animated.View>
            </View>
            <View style={buttonPosition(-1)} pointerEvents="box-none">
              <Animated.View style={navButtonWrapper(-1)} pointerEvents="box-none">
                <TouchableOpacity
                  onPress={() => this.props.push('/app/matches')}
                  style={style.navButton}
                >
                  {this.props.currentRoute === '/app/chat' ?
                    <Feather
                      name="chevron-left"
                      size={26}
                      color={softwhite}
                      style={{ width: 26 }}
                    /> :
                    <Feather
                      name="inbox"
                      size={26}
                      color={softwhite}
                      style={{ width: 26 }}
                    />
                  }
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
                    width={32}
                    height={32}
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
        <Modal visible={!!this.props.modal && this.props.modal !== 'null'} animationType={'slide'} transparent>
          {this.props.modal && this.props.modal === 'spinner' && (
            <MatchMakerModal
              pushChat={(match: any, candidate: any) => this.props.pushChatMatch(match)}
              dismiss={() => this.props.dismissModal()}
              spinner={this.props.spinner}
            />
          )}
        </Modal>
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
  chatHeader: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
  },
  chatHeaderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden' as 'hidden',
    marginBottom: 2,
  },
  chatHeaderText: {
    ...type.small,
    fontWeight: '600' as '600',
    textAlign: 'center' as 'center',
    color: colors.white,
  },
}
