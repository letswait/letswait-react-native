import React from 'react'
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native'

import { isIphoneX } from 'react-native-iphone-x-helper'

import { colors, spacing, type } from '../../../../foundation'

import ConcordButton from '../../../components/Buttons/ConcordButton'
import InputRadio from './InputRadio'
import InputSlider from './InputSlider'
import InputToggle from './InputToggle'
import SettingContainer from './SettingContainer'
import SettingGroup from './SettingGroup'
import SettingHeader from './SettingHeader'

import AsyncStorage from '@react-native-community/async-storage';
import { authedApi } from '../../../lib/api';
import { ReduxStore } from '../../../types/models';

const { width, height } = Dimensions.get('screen')

interface IProps {
  shouldUpdate: boolean
  user: ReduxStore.User
  currentRoute: string
  disablePrerender?: boolean
  clearUser: () => any
  push: (route: string) => any
  setUser: (user: ReduxStore.User) => any
}
interface IState {
  prerendered: boolean
  scrollEnabled: boolean
  settings: {
    searchSettings: ReduxStore.IUserSearchSettings,
    hideUser: boolean,
  }
  sliderLength: number
}
export default class FeedComponent extends React.Component<IProps, IState> {
  public state: IState = {
    prerendered: false,
    scrollEnabled: true,
    settings: {
      searchSettings: this.props.user.searchSettings,
      hideUser: false,
    },
    sliderLength: width - 96,
  }
  constructor(props: IProps) {
    super(props)
  }
  // public shouldComponentUpdate() {
  //   if(!this.state.prerendered && !this.props.disablePrerender) {
  //     this.setState({ prerendered: true })
  //     return true
  //   }
  //   return !!this.props.shouldUpdate
  // }
  // public changeSettings(change: any) {
  //   this.setState((prevState) => {
  //     return {
  //       ...prevState,
  //     }
  //   })
  // }
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
  private transformAgeRange(ageRange: [number, number]) {
    return ageRange.map((n, i, arr) => Math.min(i ? 22 : 18, Math.max(100, n))) as [number, number]
  }
  public render() {
    const { sexualPreference, radius, ageRange } = this.state.settings.searchSettings
    console.log(this.props.user)
    return (
      <KeyboardAvoidingView behavior="position" style={{ height, width }}>
        <ScrollView
          scrollEnabled={this.state.scrollEnabled}
          style={style.settingsWrapper}
          contentContainerStyle={style.settingsContainer}
        >
          <SettingGroup title="Search Settings">
            <SettingContainer layout={layout => this.setState({ sliderLength: layout.width - 48 })}>
              <SettingHeader heading="Distance" subheading={`Up to ${radius} Miles Away`}/>
              <InputSlider
                values={[radius]}
                min={1}
                max={100}
                sliderLength={this.state.sliderLength}
                onValuesChangeStart={() => this.disableScroll()}
                onValuesChange={(values: number[]) =>  this.changeSearchRadius(values[0])}
                onValuesChangeFinish={(values: number[]) => this.pushSearchRadius(values[0])}
              />
            </SettingContainer>
            <SettingContainer>
              <SettingHeader heading="Age" subheading={`Between ${ageRange[0]} and ${ageRange[1]}`}/>
              <InputSlider
                values={ageRange}
                min={18}
                max={100}
                sliderLength={this.state.sliderLength}
                onValuesChangeStart={() => this.disableScroll()}
                onValuesChange={(values: number[]) => this.changeAgeRange([values[0], values[1]])}
                onValuesChangeFinish={(values: number[]) => this.pushAgeRange([values[0], values[1]])}
              />
            </SettingContainer>
            <SettingContainer>
              <SettingHeader heading="I'd like to meet..." />
              <InputRadio
                value={this.state.settings.searchSettings.sexualPreference}
                data={['male', 'female', 'everyone']}
                display={['Men', 'Women', 'Everyone']}
                onChange={value => this.pushSexualPreference(value as 'male' | 'female' | 'everyone')}
              />
            </SettingContainer>
          </SettingGroup>
          <SettingGroup title="User">
            <SettingContainer layout={layout => this.setState({ sliderLength: layout.width - 48 })}>
              <SettingHeader heading="Privacy" />
              <InputToggle
                value={this.state.settings.hideUser}
                onChange={value => this.pushHide(value)}
              >
                Hide Profile from Discovery
              </InputToggle>
            </SettingContainer>
          </SettingGroup>
          <ConcordButton
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
          </ConcordButton>
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
    paddingTop: isIphoneX ? 140 : 120,
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    marginLeft: 24,
    marginRight: 24,
    paddingBottom: 44,
  },
  searchSettings: {
    flex: 1,
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    backgroundColor: colors.transparent,
  },
  searchSliderContainer: {
    flexDirection: 'column' as 'column',
    alignItems: 'flex-start' as 'flex-start',
    justifyContent: 'center' as 'center',
  },
}
