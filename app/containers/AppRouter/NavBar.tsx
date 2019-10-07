import React from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  PanResponderInstance,
  Text,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native'

const { width, height } = Dimensions.get('window')

import { ifIphoneX } from 'react-native-iphone-x-helper';
import FeatherButton from '../../components/Camera/CameraButton';

import { colors, type } from '../../../new_foundation'

const navHeight = ifIphoneX(84, 64)

interface IProps {
  push: (route: string) => void
  currentRoute: string
}
interface IState {
  visible: boolean,
  menuVisible: boolean,
  offset: Animated.Value
  animating: boolean
  feedButton: Animated.Value
  matchButton: Animated.Value
  settingsButton: Animated.Value
  swipeMenuPosition: Animated.Value
}
export default class NavBar extends React.Component<IProps, IState> {
  public state: IState = {
    visible: true,
    menuVisible: false,
    offset: new Animated.Value(navHeight),
    animating: false,
    feedButton: new Animated.Value(1),
    matchButton: new Animated.Value(0.5),
    settingsButton: new Animated.Value(0.5),
    swipeMenuPosition: new Animated.Value(0),
  }
  private lastPosition: number = 0
  // private menuStyles: {style: any} = { style: style.nav }
  private panResponder: PanResponderInstance
  constructor(props: IProps) {
    super(props);
    this.panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      // onMoveShouldSetPanResponder: (evt, gestureState) => this.state.animating && Math.abs(gestureState.dy) > 10,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        !this.state.animating && this.state.visible && Math.abs(gestureState.dy) > 3,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        this.lastPosition = (
          Math.min(0, Math.max(this.swipeMenuOffset, (this.state.swipeMenuPosition as any).__getValue())) +
          (this.state.offset as any).__getValue()
        )
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        this.state.swipeMenuPosition.setValue(
          Math.min(0, Math.max(this.swipeMenuOffset, this.lastPosition + gestureState.dy)),
        )
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        const absoluteDistance = Math.abs(gestureState.dy)
        this.state.swipeMenuPosition.setValue(
          Math.min(0, Math.max(this.swipeMenuOffset, this.lastPosition + gestureState.dy)),
        )
        // Case 1: close to end points
        if (absoluteDistance < 10) {
          if (this.lastPosition < 10) {
            this.animateHideMenu()
          } else {
            this.animateRevealMenu()
          }
        } else if (gestureState.vy > 0.5) {
          // Hide
          this.animateHideMenu()
        } else if (gestureState.vy < -0.5) {
          // Reveal
          this.animateRevealMenu()
        } else {
          if (gestureState.dy + this.lastPosition > -50) {
            this.animateHideMenu()
          } else {
            // Reveal
            this.animateRevealMenu()
          }
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return false;
      },
    });
  }
  public componentDidMount() {
    this.animateUp()
  }
  public componentDidUpdate(prevProps: IProps) {
    if (this.props.currentRoute !== prevProps.currentRoute) {
      this.animateUp()
      if (prevProps.currentRoute === '/app') {
        this.disableButton(this.state.feedButton)
      } else if (prevProps.currentRoute === '/app/settings') {
        this.disableButton(this.state.settingsButton)
      } else if (this.props.currentRoute !== '/app/matches' && this.props.currentRoute !== '/app/chat') {
        this.disableButton(this.state.matchButton)
      }
      if (this.props.currentRoute === '/app') {
        this.enableButton(this.state.feedButton)
      } else if (this.props.currentRoute === '/app/settings') {
        this.enableButton(this.state.settingsButton)
      } else if (prevProps.currentRoute !== '/app/matches' && prevProps.currentRoute !== '/app/chat') {
        this.enableButton(this.state.matchButton)
      }
    }
  }
  public animateRevealMenu() {
    if (this.state.animating) return
    this.setState({ animating: true })
    Animated.timing(this.state.swipeMenuPosition, {
      toValue: this.swipeMenuOffset,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    }).start(() => this.setState({ animating: false, menuVisible: true }))
  }
  public animateHideMenu() {
    if (this.state.animating) return
    this.setState({ animating: true })
    Animated.timing(this.state.swipeMenuPosition, {
      toValue: 0,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    }).start(() => this.setState({ animating: false, menuVisible: false }))
  }
  public animateUp() {
    if (this.state.animating) return
    this.setState({ animating: true })
    Animated.timing(this.state.offset, {
      toValue: 0,
      duration: 150,
    }).start(() => this.setState({ animating: false, visible: true }))
  }
  public animateDown() {
    if (this.state.animating) return
    this.setState({ animating: true })
    Animated.timing(this.state.offset, {
      toValue: navHeight,
      duration: 150,
    }).start(() => this.setState({ animating: false, visible: false }))
  }
  public toggle() {
    if (this.state.animating) return
    if (this.state.visible) this.animateDown()
    this.animateUp()
  }
  public disableButton(buttonValue: Animated.Value) {
    Animated.timing(buttonValue, {
      toValue: 0.5,
      duration: 150,
    }).start()
  }
  public enableButton(buttonValue: Animated.Value) {
    Animated.timing(buttonValue, {
      toValue: 1,
      duration: 150,
    }).start()
  }
  public swipeMenuOffset = -100
  public swipeMenuHeight = 100
  private swipeMenu: any
  public render() {
    const navWrapper = {
      ...style.navWrapper,
      ...(this.props.currentRoute === '/app' || this.props.currentRoute === '/app/chat' ?
      { ...style.floatNav } : { ...style.staticNav }),
    }
    const swipeMenuOverlayColor = this.props.currentRoute === '/app' || this.props.currentRoute === '/app/chat' ?
      'rgba( 0, 0, 0, 0.95)' :
      'rgba( 0, 0, 0, 0.6)'
    const swipeMenuOverlay = this.state.swipeMenuPosition.interpolate({
      inputRange: [this.swipeMenuOffset, 0],
      outputRange: [swipeMenuOverlayColor, 'transparent'],
      extrapolate: 'clamp',
    })
    const navOffset = Animated.add(this.state.offset, this.state.swipeMenuPosition)
    const navBorderRadius = this.state.swipeMenuPosition.interpolate({
      inputRange: [this.swipeMenuOffset, 0],
      outputRange: [18, 0],
    })
    const navBorderColor = this.state.feedButton.interpolate({
      inputRange: [0.5, 1],
      outputRange: ['rgba(255,255,255,0)', this.props.currentRoute === '/app' ? colors.seafoam : colors.cloud],
    })
    const navbarOpacity = this.state.swipeMenuPosition.interpolate({
      inputRange: [this.swipeMenuOffset, 0],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    })
    const navbarBackgroundColor = Animated.add(this.state.feedButton, this.state.swipeMenuPosition.interpolate({
      inputRange: [this.swipeMenuOffset, 0],
      outputRange: [1, 0],
    })).interpolate({
      inputRange: [0.5, 1],
      outputRange: ['rgba(255,255,255,0)', 'white'],
      extrapolate: 'clamp',
    })
    const swipeMenuHeight = navHeight + this.swipeMenuHeight
    const swipeMenuOpacity =
      this.state.swipeMenuPosition.interpolate({
        inputRange: [this.swipeMenuOffset, 0],
        outputRange: [1, 0],
      })
    const swipeAlertOpacity = this.state.swipeMenuPosition.interpolate({
      inputRange: [this.swipeMenuOffset, 0],
      outputRange: [0.3, 1],
      extrapolateLeft: 'clamp',
    })
    const shouldClampColor = !this.state.animating && !this.state.menuVisible && this.props.currentRoute === '/app'
    const swipeAlertColor = this.state.swipeMenuPosition.interpolate({
      inputRange: [this.swipeMenuOffset, shouldClampColor ? this.swipeMenuHeight : 0],
      outputRange: [colors.seafoam, colors.cloud],
      extrapolate: 'clamp',
    })
    return (
      <Animated.View style={navWrapper} {...this.panResponder.panHandlers}>
        {/* Whole Page Background */}
        <View pointerEvents={this.state.menuVisible ? 'auto' : 'none'} style={style.swipeMenuBackgroundWrapper}>
          <TouchableWithoutFeedback onPress={() => this.animateHideMenu()}>
            <Animated.View
              style={{
                ...style.swipeMenuBackground,
                backgroundColor: swipeMenuOverlay,
              }}
            />
          </TouchableWithoutFeedback>
        </View>

        {/* Nav Container */}
        <Animated.View
          style={{
            ...style.nav,
            transform: [{ translateY: navOffset }],
          }}
          ref={(c: any) => this.swipeMenu = c}
        >
          <Animated.View
              style={{
                width,
                height: swipeMenuHeight,
                backgroundColor: navbarBackgroundColor,
                borderTopLeftRadius: navBorderRadius,
                borderTopRightRadius: navBorderRadius,
                borderColor: navBorderColor,
                borderTopWidth: 1,
                position: 'absolute' as 'absolute',
                left: 0,
                top: 0,
              }}
          />

          {/* Swipe Menu */}
          <Animated.View
            style={{
              ...style.swipeMenu,
              height: swipeMenuHeight,
              opacity: swipeMenuOpacity,
              // backgroundColor: 'white',
              // backgroundColor: swipeMenuBackground,
            }}
          >
            <Image
              source={{
                uri: 'swipe-menu',
              }}
              style={{
                width,
                height: 164,
              }}
            />
          </Animated.View>

          {/* Navbar */}
          <Animated.View
            style={{
              ...style.navbar,
              opacity: navbarOpacity,
              // borderRadius: navBarBorderRadius,
            }}
          >
            {/* Home/Feed Screen Button */}
            <TouchableWithoutFeedback onPress={() => this.props.push('/app')}>
              <View style={style.iconWrapper}>
                <Animated.Image
                  source={{ uri: 'logo-small' }}
                  style={{
                    ...style.navIcon,
                    opacity: this.state.feedButton,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>

            {/* Matches Screen Button */}
            <TouchableWithoutFeedback onPress={() => this.props.push('/app/matches')}>
              <View style={style.iconWrapper}>
                <Animated.Image
                  style={{
                    ...style.navIcon,
                    opacity: this.state.matchButton,
                  }}
                  source={{ uri: this.props.currentRoute === '/app' ? 'messages-seafoam' : 'messages' }}
                />
              </View>
            </TouchableWithoutFeedback>

            {/* Profile/Settings Screen Button */}
            <TouchableWithoutFeedback onPress={() => this.props.push('/app/settings')}>
              <View style={style.iconWrapper}>
                <Animated.Image
                  style={{
                    ...style.navIcon,
                    opacity: this.state.settingsButton,
                  }}
                  source={{ uri: this.props.currentRoute === '/app' ? 'gender-all-seafoam' : 'gender-all' }}
                />
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>

          {/* Swipe Menu Bar & Text */}
          <Animated.View style={{ ...style.swipeAlertContainer, opacity: swipeAlertOpacity }}>
            <Animated.View style={{ ...style.swipeAlertBar, backgroundColor: swipeAlertColor }} />
            <Text style={style.swipeAlertText}>
              {this.state.menuVisible ? '' : 'swipe up for more.'}
            </Text>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    )
  }
}

const style = {
  swipeMenuBackgroundWrapper: {
    position: 'absolute' as 'absolute',
    left: 0,
    bottom: 0,
  },
  swipeMenuBackground: {
    width,
    height,
  },
  swipeAlertContainer: {
    width,
    height: 16,
    position: 'absolute' as 'absolute',
    left: 0,
    top: 0,
    alignItems: 'center' as 'center',
    justifyContent: 'flex-start' as 'flex-start',
  },
  swipeAlertBar: {
    width: width * 0.5,
    maxWidth: 96,
    height: 3,
    borderRadius: 1.5,
    marginTop: 2,
    backgroundColor: colors.seafoam,
  },
  swipeAlertText: {
    ...type.micro,
    color: colors.seafoam,
    // marginTop: 2,
    textAlign: 'center' as 'center',
  },
  swipeMenu: {
    width,
    position: 'absolute' as 'absolute',
    left: 0,
    top: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  navWrapper: {
    width,
    zIndex: 1,
  },
  nav: {
    width,
    zIndex: 1,
  },
  navbar: {
    width,
    flexDirection: 'row' as 'row',
    justifyContent: 'space-around' as 'space-around',
    alignItems: 'flex-end' as 'flex-end',
    // overflow: 'hidden' as 'hidden',
  },
  iconWrapper: {
    flex: 1,
    flexGrow: 1,
    height: navHeight,
    paddingTop: 12,
    paddingBottom: ifIphoneX(27, 8),
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    backgroundColor: colors.transparentWhite,
  },
  floatNav: {
    bottom: 0,
    position: 'absolute' as 'absolute',
  },
  staticNav: {
    flexGrow: 0,
    flex: 0,
  },
  navIcon: {
    width: 26,
    height: 26,
  },
}
