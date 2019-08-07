import React from 'react'
import {
  Alert,
  Image,
  ImageBackground,
  Linking,
  Platform,
  Text,
  View,
} from 'react-native'
import SafariView from 'react-native-safari-view';

import { colors, spacing, type } from '../../../foundation'

import { isIphoneX } from 'react-native-iphone-x-helper'
import { api, collectUUID, refreshApi } from '../../lib/api'

import AsyncStorage from '@react-native-community/async-storage'
import { storeToken } from '../../lib/asyncStorage'

import LinearGradient from 'react-native-linear-gradient'

import moment from 'moment'
import FacebookLoginButton from '../../components/Buttons/FacebookLoginButton'
import WisteriaButton from '../../components/Buttons/WisteriaButton'

interface IProps {
  push: (route: string, state?: any) => any
  changeThemeDark: () => any
  auth: () => any
  populateUser: (user: any) => any
  populateSignupRoutes: (routes: string[]) => any
}
export default class WelcomeScreen extends React.PureComponent<IProps,{}> {
  public componentDidMount() {
    // Add event listener to handle OAuthLogin:// URLs
    Linking.addEventListener('url', e => this.handleOpenURL(e.url));
    // Launched from an external URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleOpenURL(url)
        // this.handleOpenURL({ url });
      }
    });
    this.props.changeThemeDark()
    AsyncStorage.getItem('user').then((user: any) => {
      // If there is no user, check for auth to finish signup
      console.log(user)
      if(!user || !user.length || typeof user.unset === 'boolean') {
        console.log('no user')
        AsyncStorage.multiGet(['authToken', 'refreshToken', 'expiresOn'], (err, res) => {
          if(err || !res) return // do nothing, allow user to sign in
          const authToken = res[0][1] ? res[0][1] : ''
          const refreshToken = res[1][1] ? res[1][1] : ''
          const expiresOn = res[2][1] ? res[2][1] : ''
          if(authToken.length && expiresOn.length && refreshToken.length) {
            const expire = moment(expiresOn)
            if(expire.isValid()) {
              if(expire.isBefore(moment())) { // Token expired, request new token
                this.requestRefreshToken()
              } else {
                this.props.auth()
              }
            } else { // Refresh Token
              this.requestRefreshToken()
            }
          } else if(refreshToken.length) {
            this.requestRefreshToken()
          }
          return
          // else: do nothing, allow users to sign in
        })
      } else {
        console.log(JSON.parse(user))
        const userObject = JSON.parse(user)
        this.props.populateUser(userObject)
        setTimeout(() => this.props.push('/app'), 50)
      }
    })
  }
  public componentWillUnmount() {
    // Remove event listener
    Linking.removeEventListener('url', e => this.handleOpenURL(e.url));
  };
  private requestRefreshToken() {
    refreshApi.get('/api/user/check-auth/error').then(async (result: any) => {
      if(result.ok) {
        if(result.data && result.data.accepted) {
          if(result.data.remainingSetupRoutes && result.data.remainingSetupRoutes.length) {
            this.props.populateSignupRoutes(result.data.remainingSetupRoutes)
          } else {
            this.props.populateUser(result.data.user)
            const didStoreAuth = await storeToken('authToken', result.data.accessToken)
            const didStoreExpire = await storeToken('expiresOn', result.data.expiresOn)
            const didStoreUser = await storeToken('user', JSON.stringify(result.data.user))
            if(didStoreUser && didStoreAuth && didStoreExpire) {
              this.props.push('/app')
            }
          }
        }
      }
    })
  }
  public handleOpenURL(url: string) {
    // tslint:disable-next-line: no-unused-expression
    Platform.OS === 'ios' && SafariView.dismiss()
    console.log('Opening URL?', url)
    // Extract stringified user string out of the URL
    if(url.indexOf('letswaitdating://app?user=') !== -1) {
      const user_string = url.match(/user=([^#]+)/)![1]
      this.setState({
        // Decode the user string and parse it into JSON
        user: JSON.parse(decodeURI(user_string)),
      });
    } else if(url.indexOf('letswaitdating://app?routes=') !== -1) {
      const route_string = url.match(/routes=([^#]+)/)![1]
      const routes = JSON.parse(decodeURI(route_string))
      // console.log(this, this.props, routes)
      this.props.populateSignupRoutes(routes)
      this.props.push(routes[0])
    } else {
      Alert.alert('Sign In Failed', 'Could not sign into Facebook. Try again later.')
    }
  };
  public loginWithFacebook = async () => {
    Alert.alert('Couldn\'t Log In', 'Facebook Login is disabled for now.')
    // const uuid = await collectUUID()
    // this.openURL(`${config.api}/api/user/facebook-auth?uuid=${uuid}`);
  }
  public render() {
    return (
      <ImageBackground
        source={{ uri: 'welcome_splash' }}
        style={style.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[colors.transparent, 'rgba(255,255,255,81)', colors.white]}
          locations={[0, 0.45, 1]}
          angle={90}
          style={style.whiteGradient}
        />
        <View style={style.logoArea}>
          <Image
            source={{ uri: 'logo' }}
            style={style.logo}
          />
          <View style={style.titleLine}>
            <Text style={style.smallTitleText}>Lets</Text>
            <Text style={style.largeTitleText}>Wait</Text>
          </View>
        </View>
        <View style={style.buttonArea}>
          <View style={style.buttonSpacer}/>
          <FacebookLoginButton
            onPress={() => this.loginWithFacebook()}
          />
          <View style={style.buttonSpacer}/>
          <WisteriaButton
            onPress={() => this.props.push('/setup/sms')}
          >
            Build Better Relationships
          </WisteriaButton>
        </View>
      </ImageBackground>
    )
  }
}

const style = {
  backgroundImage: {
    width: '100%' as '100%',
    height: '100%' as '100%',
    alignItems: 'center' as 'center',
  },
  whiteGradient: {
    width: '100%' as '100%',
    height: 112,
    position: 'absolute' as 'absolute',
    bottom: 0,
    left: 0,
    opacity: 0.5,
  },
  logoArea: {
    flex: 1,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  titleLine: {
    paddingTop: spacing.tiny,
    flexDirection: 'row' as 'row',
  },
  smallTitleText: {
    ...type.title2,
    color: '#B762C4',
    fontWeight: '400' as '400',
  },
  largeTitleText: {
    ...type.title2,
    fontWeight: '600' as '600',
    color: '#B762C4',
  },
  buttonArea: {
    flex: 1,
    flexDirection: 'column-reverse' as 'column-reverse',
    alignItems: 'center' as 'center',
    paddingBottom: 50,
  },
  textUnderline: {
    textDecorationLine: 'underline' as 'underline',
  },
  buttonSpacer: {
    height: 12,
  },
  facebookLogin: {
    height: 53,
  },
}

const alerts = {
  500: 'There was a problem contacting the server',
  400: 'Something went wrong logging in',
  200: 'Successfully logged into Facebook',
}
