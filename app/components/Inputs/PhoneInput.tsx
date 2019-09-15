import React from 'react'
import {
  Animated,
  Easing,
  KeyboardTypeOptions,
  Text,
  TextInput,
  View,
} from 'react-native'

import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js'
import Feather from 'react-native-vector-icons/Feather'
import { colors, type } from '../../../new_foundation'

// tslint:disable-next-line: no-var-requires
const countryCodeSymbols = require('../../lib/countryCodes.json')

interface IProps {
  onValid: (number: string) => any
  onInvalid: () => any
  onFocus?: () => any
  onEndEditing?: () => any
  value?: string
  secureTextEntry?: boolean
  autoFocus?: boolean
  autoCorrect?: boolean
  selectTextOnFocus?: boolean
  keyboardType?: KeyboardTypeOptions
  maxLength?: number
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
}
interface IState {
  stageFocus: boolean
  hasFocussed: boolean
  titleSize: Animated.Value
  localNumber: string,
  countryCode: string,
}
export default class Input extends React.Component<IProps, IState> {
  private countryCodeInput: any
  private localNumberInput: any
  constructor(props: IProps) {
    super(props)
    let number = {
      localNumber: '',
      countryCode: '+1',
    }
    if(props.value) {
      const tempNumber = parsePhoneNumberFromString(props.value)
      if(tempNumber) {
        number = {
          localNumber: tempNumber.nationalNumber as string,
          countryCode: tempNumber.countryCallingCode as string,
        }
      }
    }
    this.state = {
      stageFocus: false,
      hasFocussed: false,
      titleSize: new Animated.Value(1),
      ...!!this.props.value ? {
        localNumber: number.localNumber,
        countryCode: number.countryCode,
      } : number,
    }
  }
  public onFocus() {
    if(!this.state.hasFocussed) {
      Animated.timing(this.state.titleSize, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      }).start(() => {
        this.setState((prevState): IState => {
          return {
            ...prevState,
            hasFocussed: true,
          }
        })
      })
    }
    if(this.props.onFocus) {
      this.props.onFocus()
    }
  }
  public onChange(text: string, input: 'country code' | 'local') {
    let countryCode: string
    let localNumber: string
    if(input === 'country code') {
      if(!text) {
        countryCode = '+'
      } else {
        countryCode = text
      }
      localNumber = this.state.localNumber
    } else {
      countryCode = this.state.countryCode,
      localNumber = text
    }
    const totalPhoneNumber: string = (countryCode + localNumber).replace(/-/g,'')
    if(totalPhoneNumber.length > 5) {
      const phoneNumber = parsePhoneNumberFromString(totalPhoneNumber)
      if(phoneNumber && phoneNumber.isValid()) {
        this.props.onValid(phoneNumber.number as string)
      } else {
        this.props.onInvalid()
      }
    } else {
      this.props.onInvalid()
    }
    const asYouType = new AsYouType()
    const formattedPhoneNumber = asYouType.input(totalPhoneNumber)
    if(localNumber.length) {
      const localNumberArray = formattedPhoneNumber.match(/\ (.*)/)
      localNumber = !!localNumberArray ? localNumberArray![0].substr(1) : localNumber
    }
    if(countryCode.length) {
      const countryCodeArray = formattedPhoneNumber.match(/.+?(?=\ )/)
      countryCode = !!countryCodeArray ? countryCodeArray![0] : countryCode
    }
    this.setState((prevState: IState): IState => {
      return {
        ...prevState,
        countryCode,
        localNumber,
      }
    })
    if(input === 'country code' && (!!asYouType.country || text === '+1')) {
      this.localNumberInput.focus()
    }
  }
  private onKeyPress(e: any) {
    if(e.nativeEvent.key === 'Backspace') {
      if(this.state.localNumber.length === 0) {
        this.countryCodeInput.focus()
      }
    }
  }
  public render() {
    const titleOpacity = this.state.titleSize.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.6],
    })
    const countryCodeWidth = 18 + (this.state.countryCode.length * 13)
    return(
      <View style={style.container}>
        <Animated.View
          style={{
            ...style.titleWrapper,
            opacity: titleOpacity,
          }}
        >
          <Text style={style.title}>
            Phone Number
          </Text>
        </Animated.View>
        <View
          style={{
            flex: 1,
            height: 48,
            flexDirection: 'row' as 'row',
          }}
        >
          <View style={style.iconContainer}>
            {countryCodeSymbols[this.state.countryCode] ?
              <Text style={style.icon}>
                {countryCodeSymbols[this.state.countryCode]}
            </Text> :
            <Feather name="phone" size={24} color={colors.white}/>
            }
          </View>
          <Animated.View
            style={{
              ...style.inputWrapper,
              ...style.countryCodeWrapper,
              width: countryCodeWidth,
            }}
          >
            <TextInput
              style={{
                ...style.input,
                width: countryCodeWidth,
              }}
              value={this.state.countryCode}
              ref={ref => this.countryCodeInput = ref}
              onChangeText={(text: string) => this.onChange(text, 'country code')}
              onFocus={() => this.onFocus()}
              onEndEditing={() => { if(!!this.props.onEndEditing) this.props.onEndEditing() }}
              secureTextEntry={this.props.secureTextEntry}
              autoCorrect={this.props.autoCorrect || false}
              selectTextOnFocus={this.props.selectTextOnFocus}
              keyboardType="numeric"
              maxLength={5}
              autoCapitalize={this.props.autoCapitalize || 'sentences'}
            />
            <View style={style.bottomBorder}/>
          </Animated.View>
          <View style={style.inputWrapper}>
            <TextInput
              style={style.input}
              value={this.state.localNumber}
              ref={ref => this.localNumberInput = ref}
              onChangeText={(text: string) => this.onChange(text, 'local')}
              onKeyPress={(event: any) => this.onKeyPress(event)}
              onFocus={() => this.onFocus()}
              onEndEditing={() => { if(!!this.props.onEndEditing) this.props.onEndEditing() }}
              secureTextEntry={this.props.secureTextEntry}
              autoFocus={this.props.autoFocus || true}
              autoCorrect={this.props.autoCorrect || false}
              selectTextOnFocus={this.props.selectTextOnFocus}
              keyboardType="numeric"
              maxLength={15}
              autoCapitalize={this.props.autoCapitalize || 'sentences'}
            />
            <View style={style.bottomBorder}/>
          </View>
        </View>
      </View>
    )
  }
}

const style = {
  container: {
    height: 55,
    width: 250,
    flexDirection: 'column' as 'column',
    maxWidth: '100%',
  },
  iconContainer: {
    width: 24,
    height: 28,
    marginRight: 8,
    justifyContent: 'center' as 'center',
  },
  icon: {
    fontSize: 24,
    lineHeight: 24,
  },
  titleWrapper: {
    height: 25,
  },
  title: {
    ...type.small,
    color: colors.white,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'column' as 'column',
    height: 30,
  },
  countryCodeWrapper: {
    flex: 0,
    width: 32,
    marginRight: 8,
  },
  input: {
    ...type.large,
    color: colors.white,
    flex: 1,
    width: '100%',
    maxWidth: 223-32,
    height: 28,
    marginRight: 8,
    marginLeft: 8,
  },
  bottomBorder: {
    width: '100%',
    height: 2,
    backgroundColor: colors.white,
  },
}
