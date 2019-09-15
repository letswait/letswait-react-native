import React from 'react'
import {
  KeyboardAvoidingView,
  Text,
  View,
} from 'react-native'

import { ifIphoneX } from 'react-native-iphone-x-helper'

import LinearGradient from 'react-native-linear-gradient'
import Feather from 'react-native-vector-icons/Feather'
import { Route } from 'react-router'

import { colors } from '../../../new_foundation'
import BackButton from '../../components/Buttons/BackButton'

import BirthdayComponent from './Birthday/Birthday'
import CodeComponent from './CodeConfirmation/CodeConfirmation'
import FoodComponent from './Food/Food'
import GenderComponent from './Gender/Gender'
import GoalComponent from './Goal/Goal'
import NameComponent from './Name/Name'
import SMSComponent from './PhoneNumber/PhoneNumber'
import PhotosComponent from './Photos/Photos'
import SexualPreferenceComponent from './SexualPreference/SexualPreference'

interface IProps {
  previousRoute: () => any
  changeThemeLight: () => any
  currentRoute: number
  showProgressBar: boolean
  routes?: string[]
  path: string
}
export default class SetupRouter extends React.PureComponent<IProps, {}> {
  public componentDidMount() {
    this.props.changeThemeLight()
  }
  public render() {
    return (
      <View
        style={style.background}
      >
        <View style={style.navbar}>
          <View style={style.navSideWrapper}>
            <BackButton
              onPress={() => this.props.previousRoute()}
            />
          </View>
          <View
            style={{
              ...style.progressBarWrapper,
              ...((
                this.props.path === '/setup/sms' ||
                this.props.path === '/setup/code'
                ) ? { opacity: 0 } : null
              ),
            }}
          >
            <View style={style.progressBarContainer}>
              { this.props && this.props.routes && this.props.routes.length ?
                // tslint:disable-next-line: prefer-array-literal
                new Array(this.props.routes.length).fill({}).map((o, i) => {
                  return (
                    <View
                      key={i}
                      style={{
                        ...style.progressBarSegment,
                        ...(this.props.currentRoute >= i ? style.activeSegment : null),
                        ...(
                            this.props.routes && this.props.routes.length === i ?
                              { borderRightWidth: 0 }
                              : null
                        ),
                      }}
                    />
                  )
                }) : null
              }
            </View>
          </View>
          <View style={style.navSideWrapper}/>
        </View>
        {/* Signup Routes */}
        <Route path={'/setup/sms'} component={SMSComponent}/>
        <Route path={'/setup/code'} component={CodeComponent}/>
        <Route path={'/setup/birthdate'} component={BirthdayComponent}/>
        <Route path={'/setup/name'} component={NameComponent}/>
        <Route path={'/setup/gender'} component={GenderComponent}/>
        <Route path={'/setup/sexual-preference'} component={SexualPreferenceComponent}/>
        <Route path={'/setup/photo-upload'} component={PhotosComponent}/>
        <Route path={'/setup/food-interests'} component={FoodComponent}/>
        <Route path={'/setup/goals'} component={GoalComponent}/>
      </View>
    )
  }
}

const style = {
  background: {
    width: '100%' as '100%',
    height: '100%' as '100%',
    alignItems: 'center' as 'center',
    paddingTop: ifIphoneX(64, 40),
    paddingBottom: ifIphoneX(24, 0),
    backgroundColor: colors.seafoam,
  },
  navbar: {
    width: '100%' as '100%',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
  },
  navSideWrapper: {
    flex: 1,
  },
  progressBarWrapper: {
    flex: 2,
    flexDirection: 'row' as 'row',
    paddingLeft: 8,
    paddingRight: 8,
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 5,
    borderColor: colors.white,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row' as 'row',
    overflow: 'hidden' as 'hidden',
  },
  progressBarSegment: {
    flex: 1,
    borderRightColor: colors.white,
    borderRightWidth: 1,
  },
  activeSegment: {
    backgroundColor: colors.white,
  },
}
