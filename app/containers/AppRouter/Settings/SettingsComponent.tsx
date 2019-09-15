import React from 'react'
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from 'react-native'

import { isIphoneX } from 'react-native-iphone-x-helper'

import { colors, type } from '../../../../new_foundation'

import GenderRadio from './GenderRadio'
import InputSlider from './InputSlider'
import InputToggle from './InputToggle'
// import SettingContainer from './SettingContainer'
import SettingGroup from './SettingGroup'
// import SettingHeader from './SettingHeader'

import AsyncStorage from '@react-native-community/async-storage'
import FastImage from 'react-native-fast-image'
import { authedApi } from '../../../lib/api';
import { ReduxStore } from '../../../types/models';

import ControlledCornerPage from '../ControlledCornerPage';

const { width, height } = Dimensions.get('screen')

interface IProps {
  user: ReduxStore.User
  currentRoute: string
  clearUser: () => any
  push: (route: string) => any
  setUser: (user: ReduxStore.User) => any
}
interface IState {
  scrollEnabled: boolean
  settings: {
    searchSettings: ReduxStore.IUserSearchSettings,
    hideUser: boolean,
  }
  sliderLength: number
}
export default class FeedComponent extends React.Component<IProps, IState> {
  public state: IState = {
    scrollEnabled: true,
    settings: {
      searchSettings: this.props.user.searchSettings,
      hideUser: false,
    },
    sliderLength: width - 80,
  }
  constructor(props: IProps) {
    super(props)
  }
  private logout() {
    authedApi.get('/api/user/logout').then(async (response) => {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'expiresOn', 'user'])
      this.props.clearUser()
      this.props.push('/')
    })
  }
  private disableScroll() {
    this.setState({ scrollEnabled: false })
  }
  private enableScroll() {
    this.setState({ scrollEnabled: true })
  }
  private pushSearchRadius(change: number) {
    this.enableScroll()
    this.props.setUser({
      ...this.props.user,
      searchSettings: {
        ...this.props.user.searchSettings,
        radius: change,
      },
    })
  }
  private changeSearchRadius(radius: number) {
    this.setState({
      settings: {
        ...this.state.settings,
        searchSettings: {
          ...this.state.settings.searchSettings,
          radius,
        },
      },
    })
  }
  private pushSexualPreference(preference: 'male'  | 'female' | 'everyone') {
    this.setState({
      settings: {
        ...this.state.settings,
        searchSettings: {
          ...this.state.settings.searchSettings,
          sexualPreference: preference,
        },
      },
    })
    this.props.setUser({
      ...this.props.user,
      searchSettings: {
        ...this.props.user.searchSettings,
        sexualPreference: preference,
      },
    })
  }
  private pushHide(value: boolean) {
    this.setState({
      settings: {
        ...this.state.settings,
        hideUser: value,
      },
    })
    this.props.setUser({
      ...this.props.user,
      hideProfile: value,
    })
  }
  private pushAgeRange(ageRange: [number, number]) {
    this.enableScroll()
    const newUser = {
      ...this.props.user,
      searchSettings: {
        ...this.props.user.searchSettings,
        ageRange,
      },
    }

    this.props.setUser(newUser)
  }
  private changeAgeRange(ageRange: [number, number]) {
    this.setState({
      settings: {
        ...this.state.settings,
        searchSettings: {
          ...this.state.settings.searchSettings,
          ageRange,
        },
      },
    })
  }
  public render() {
    const { sexualPreference, radius, ageRange } = this.state.settings.searchSettings
    console.log(this.props.user)
    return (
        <KeyboardAvoidingView behavior="position" style={style.container}>
          <ScrollView
            scrollEnabled={this.state.scrollEnabled}
            style={style.settingsWrapper}
            contentContainerStyle={style.settingsContainer}
          >
            <InputSlider
              heading="Age"
              subheading={`Between ${ageRange[0]} and ${ageRange[1]}`}
              values={ageRange}
              min={18}
              max={100}
              sliderLength={this.state.sliderLength}
              onValuesChangeStart={() => this.disableScroll()}
              onValuesChange={(values: number[]) => this.changeAgeRange([values[0], values[1]])}
              onValuesChangeFinish={(values: number[]) => this.pushAgeRange([values[0], values[1]])}
            />
            <GenderRadio
              style={{ width: width - 80 }}
              value={sexualPreference}
              data={['male', 'female', 'everyone']}
              display={[{
                image: 'gender-man',
                text: 'MEN',
              }, {
                image: 'gender-woman',
                text: 'WOMEN',
              }, {
                image: 'gender-all',
                text: 'ALL',
              }]}
              onChange={value => this.pushSexualPreference(value as 'male' | 'female' | 'everyone')}
            />
            <InputSlider
              heading="Distance"
              subheading={`Up to ${radius} Miles Away`}
              values={[radius]}
              min={1}
              max={100}
              sliderLength={this.state.sliderLength}
              onValuesChangeStart={() => this.disableScroll()}
              onValuesChange={(values: number[]) =>  this.changeSearchRadius(values[0])}
              onValuesChangeFinish={(values: number[]) => this.pushSearchRadius(values[0])}
            />
            <SettingGroup>
              <InputToggle
                value={this.state.settings.hideUser}
                onChange={value => this.pushHide(value)}
              >
                Hide Profile
              </InputToggle>
              <Text style={style.infoBody}>
                Turning Your Public Profile off hides you from everyone
                except the people you have already connected with.
              </Text>
            </SettingGroup>
          </ScrollView>
        </KeyboardAvoidingView>
    )
  }
}

const style = {
  container: {
    backgroundColor: colors.seafoam,
  },
  settingsWrapper: {
    width: '100%',
    height: '100%',
  },
  settingsContainer: {
    paddingTop: isIphoneX ? 102 : 78,
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    paddingBottom: 44,
  },
  searchSettings: {
    flex: 1,
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    backgroundColor: 'transparent',
  },
  searchSliderContainer: {
    flexDirection: 'column' as 'column',
    alignItems: 'flex-start' as 'flex-start',
    justifyContent: 'center' as 'center',
  },
  infoBody: {
    ...type.small,
    width: '100%',
    marginTop: 8,
  },
}
