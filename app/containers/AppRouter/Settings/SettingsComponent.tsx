import React from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'

import { isIphoneX } from 'react-native-iphone-x-helper'

import WisteriaButton from '../../../components/Buttons/WisteriaButton'
import Input from '../../../components/Inputs/Input'

import AsyncStorage from '@react-native-community/async-storage';
import { authedApi } from '../../../lib/api';

const { width, height } = Dimensions.get('screen')

interface IProps {
  shouldUpdate: boolean
  user: any
  currentRoute: string
  disablePrerender?: boolean
  clearUser: () => any
  push: (route: string) => any
}
interface IState {
  prerendered: boolean
}
export default class FeedComponent extends React.Component<IProps, IState> {
  public state: IState = {
    prerendered: false,
  }
  constructor(props: IProps) {
    super(props)
  }
  public shouldComponentUpdate() {
    if(!this.state.prerendered && !this.props.disablePrerender) {
      this.setState({ prerendered: true })
      return true
    }
    if(this.props.shouldUpdate) {
      return true
    }
    return false
  }
  public changeSettings(change: any) {
    this.setState((prevState) => {
      return {
        ...prevState,
      }
    })
  }
  private logout() {
    authedApi.get('/api/user/logout').then(async (response) => {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'expiresOn', 'user'])
      this.props.clearUser()
      this.props.push('/')
    })
  }
  public render() {
    // if(
    //   !this.props.user ||
    //   this.props.user.unset ||
    //   (!this.props.user.profile || !this.props.user.profile.images || !this.props.user.profile.images.length)
    // ) {
    //   return (
    //     <View>
    //       <Text>Hello There</Text>
    //     </View>
    //   )
    // }
    return (
      <KeyboardAvoidingView behavior="position" style={{ height, width }}>
        <ScrollView
          style={style.settingsWrapper}
          contentContainerStyle={style.settingsContainer}
        >
          <WisteriaButton
            onPress={() => {
              Alert.alert(
                'Log Out?',
                'Are you sure you would like to log out?',
                [{
                  text: 'Cancel',
                  onPress: () => console.log('cancelled signout'),
                  style: 'cancel',
                }, {
                  text: 'Log Out',
                  onPress: () => this.logout(),
                }],
              )
            }}
          >
            Log Out
          </WisteriaButton>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const style = {
  settingsWrapper: {
    width: '100%',
    height: '100%',
  },
  settingsContainer: {
    paddingTop: isIphoneX ? 184 : 160,
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
  },
}
