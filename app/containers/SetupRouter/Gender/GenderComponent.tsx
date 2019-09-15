import React from 'react'
import {
  Animated,
  Easing,
  Text,
  View,
} from 'react-native'

import ActionButton from '../../../components/Buttons/ActionButton'

import { colors, type } from '../../../../new_foundation'

import ToggleButton from '../../../components/Buttons/ToggleButton'
import Input from '../../../components/Inputs/Input'

import SetupWrapper from '../SetupWrapperComponent'

interface IProps {
  path: string
  currentRoute: number
  routes: string[]
  errorMessage?: string
  gender?: string
  incrementRoute: () => any
  change: (changes: any) => any
  push: (route: string) => any
  updateProfile: () => any
}
interface IState {
  gender: string,
  otherGender: string,
  disabled: boolean,
  maxHeight: Animated.Value
}
export default class GenderComponent extends React.PureComponent<IProps, IState> {
  public genderInput: any
  public state: IState = {
    gender: this.props.gender || '',
    otherGender: '',
    disabled: this.props.gender ? false : true,
    maxHeight: (
      this.props.gender && (
      this.props.gender === 'male' ||
      this.props.gender === 'female')
      ) || !this.props.gender ?
      new Animated.Value(0) : new Animated.Value(1),
  }
  public componentDidMount() {
    this.props.change({ gender: undefined })
  }
  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if(JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      // Change in Props
      if(this.props.gender && prevProps.gender !== this.props.gender) {
        this.props.incrementRoute()
      } else if(prevProps.currentRoute !== this.props.currentRoute) {
        if(this.props.currentRoute >= this.props.routes.length) {
          this.props.updateProfile()
        } else {
          this.props.push(this.props.routes[this.props.currentRoute])
        }
      }
    }
  }
  private animateIn() {
    Animated.timing(this.state.maxHeight, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
    }).start()
  }
  private animateOut() {
    Animated.timing(this.state.maxHeight, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
    }).start()
  }
  private setGender(g: string, showInput: boolean = false) {
    if(this.state.maxHeight._value === 0 && showInput) {
      this.animateIn()
      this.genderInput.input.focus()
    } else if(this.state.maxHeight._value === 1 && (!g.length || !showInput)) {
      this.animateOut()
      this.genderInput.input.blur()
    }
    let gender = g
    const otherGender = showInput ? g : this.state.otherGender
    this.setState((prevState) => {
      if(prevState.gender === gender) {
        gender = ''
      }
      return {
        gender,
        otherGender,
        disabled: (gender.length === 0),
      }
    })
  }
  public render() {
    const buttonOpacity = this.state.maxHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    })
    const maxHeight = this.state.maxHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 60],
    })
    // const buttonHeight = this.state.maxHeight.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [60, 0],
    // })
    console.log(this.state.gender, this.state.otherGender)
    return (
      <SetupWrapper>
        <Text style={style.title} adjustsFontSizeToFit numberOfLines={1}>
          How do you identify your gender?
        </Text>
        <View style={style.contentWrapper}>
          <Animated.View style={{ maxHeight, opacity: this.state.maxHeight }}>
            <Input
              title="Gender"
              icon="user"
              value={this.state.gender}
              onChange={text => this.setGender(text, true)}
              ref={component => this.genderInput = component}
            />
          </Animated.View>
          <ToggleButton
            active={this.state.gender.toLowerCase() === 'male'}
            onPress={() => this.setGender('Male')}
          >
            Male
          </ToggleButton>
          <ToggleButton
            active={this.state.gender.toLowerCase() === 'female'}
            onPress={() => this.setGender('Female')}
          >
            Female
          </ToggleButton>
          <Animated.View style={{ opacity: buttonOpacity }}>
            <ToggleButton
              disabled={true}
              onPress={() => this.setGender(this.state.otherGender, true)}
            >
              Other
            </ToggleButton>
          </Animated.View>
        </View>
        <ActionButton
          onPress={() => this.props.change({ gender: this.state.gender.toLowerCase() })}
          disabled={this.state.disabled}
        >
          Next
        </ActionButton>
      </SetupWrapper>
    )
  }
}

const style = {
  title: {
    ...type.title2,
    color: colors.white,
    marginTop: 40,
    marginBottom: 48,
    maxWidth: 300,
  },
  contentWrapper: {
    flex: 1,
  },
}
