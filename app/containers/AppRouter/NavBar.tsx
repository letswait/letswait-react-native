import React from 'react'
import {
  Animated,
  Dimensions,
  Image,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native'

const { width } = Dimensions.get('window')

import { ifIphoneX } from 'react-native-iphone-x-helper';
import FeatherButton from '../../components/Camera/CameraButton';

import { colors } from '../../../new_foundation'

const dissapearValue = ifIphoneX(84, 64)

interface IProps {
  push: (route: string) => void
  currentRoute: string
}
interface IState {
  visible: boolean,
  offset: Animated.Value
  animating: boolean
  feedButton: Animated.Value
  matchButton: Animated.Value
  settingsButton: Animated.Value
}
export default class NavBar extends React.PureComponent<IProps,IState> {
  public state: IState = {
    visible: false,
    offset: new Animated.Value(dissapearValue),
    animating: false,
    feedButton: new Animated.Value(1),
    matchButton: new Animated.Value(0.5),
    settingsButton: new Animated.Value(0.5),
  }
  public componentDidMount() {
    this.animateUp()
  }
  public UNSAFE_componentWillReceiveProps(nextProps: IProps) {
    if(this.props.currentRoute !== nextProps.currentRoute) {
      this.animateUp()
      if(nextProps.currentRoute === '/app') {
        this.enableButton(this.state.feedButton)
      } else if(nextProps.currentRoute === '/app/settings') {
        this.enableButton(this.state.settingsButton)
      } else if(this.props.currentRoute !== '/app/matches' && this.props.currentRoute !== '/app/chat') {
        this.enableButton(this.state.matchButton)
      }
      if(this.props.currentRoute === '/app') {
        this.disableButton(this.state.feedButton)
      } else if(this.props.currentRoute === '/app/settings') {
        this.disableButton(this.state.settingsButton)
      } else if(nextProps.currentRoute !== '/app/matches' && nextProps.currentRoute !== '/app/chat') {
        this.disableButton(this.state.matchButton)
      }
    }
  }
  public animateUp() {
    if(this.state.animating) return
    this.setState({ animating: true })
    Animated.timing(this.state.offset, {
      toValue: 0,
      duration: 150,
    }).start(() => this.setState({ animating: false }))
  }
  public animateDown() {
    if(this.state.animating) return
    this.setState({ animating: true })
    Animated.timing(this.state.offset, {
      toValue: dissapearValue,
      duration: 150,
    }).start(() => this.setState({ animating: false }))
  }
  public toggle() {
    if(this.state.animating) return
    if(this.state.visible) this.animateDown()
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
  public render() {
    const nav = {
      ...style.nav,
      ...(this.props.currentRoute === '/app' ? { ...style.floatNav } : { ...style.staticNav }),
      transform: [
        { translateY: this.state.offset },
      ],
      backgroundColor: this.state.feedButton.interpolate({
        inputRange: [0.5, 1],
        outputRange: ['rgba(255,255,255,0)', 'white'],
      }),
      borderColor: this.state.feedButton.interpolate({
        inputRange: [0.5, 1],
        outputRange: ['rgba(255,255,255,0)', colors.seafoam],
      }),
    }
    return (
      <Animated.View style={nav}>
        <TouchableWithoutFeedback
          onPress={() => this.props.push('/app')}
        >
          <Animated.Image
            style={{
              ...style.navIcon,
              opacity: this.state.feedButton,
            }}
            source={{ uri: 'logo-small' }}
          />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.props.push('/app/matches')}>
          <Animated.Image
            style={{
              ...style.navIcon,
              opacity: this.state.matchButton,
            }}
            source={{ uri: this.props.currentRoute === '/app' ? 'messages-seafoam' : 'messages' }}
          />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.props.push('/app/settings')}>
          <Animated.Image
            style={{
              ...style.navIcon,
              opacity: this.state.settingsButton,
            }}
            source={{ uri: this.props.currentRoute === '/app' ? 'gender-all-seafoam' : 'gender-all' }}
          />
        </TouchableWithoutFeedback>
      </Animated.View>
    )
  }
}

const style = {
  nav: {
    width,
    flexDirection: 'row' as 'row',
    justifyContent: 'space-around' as 'space-around',
    alignItems: 'flex-end' as 'flex-end',
    overflow: 'hidden' as 'hidden',
    zIndex: 1,
    borderTopWidth: 2,
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
    marginTop: 16,
    marginBottom: ifIphoneX(39,20),
    width: 26,
    height: 26,
  },
}
