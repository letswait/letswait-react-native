import React from 'react'
import {
  Animated,
  Easing,
  Image,
  KeyboardTypeOptions,
  Text,
  TextInput,
  View,
} from 'react-native'
// import countryCodes from '../lib/countryCodes.json'

import Feather from 'react-native-vector-icons/Feather'
import { colors, spacing, type } from '../../../foundation'

interface IProps {
  title: string
  icon: string
  value?: string
  onChange: (text: string) => any
  onFocus?: () => any
  onEndEditing?: () => any
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
}
export default class Input extends React.Component<IProps, IState> {
  private input: any
  constructor(props: IProps) {
    super(props)
    this.state = {
      stageFocus: false,
      hasFocussed: false,
      titleSize: new Animated.Value(1),
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
  public render() {
    // const titleScale = this.state.titleSize.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [1, 1.7],
    // })
    // const titlePosX = this.state.titleSize.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [0, 69],
    // })
    // const titlePosY = this.state.titleSize.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [0, 18],
    // })
    const titleOpacity = this.state.titleSize.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.6],
    })
    return(
      <View style={style.container}>
        <Animated.View
          style={{
            ...style.titleWrapper,
            opacity: titleOpacity,
            // transform: [
            //   { scale: titleScale },
            //   { translateX: titlePosX },
            //   { translateY: titlePosY },
            // ],
          }}
        >
          <Text style={style.title}>
            {this.props.title}
          </Text>
        </Animated.View>
        <View
          style={{
            flex: 1,
            height: spacing.large,
            flexDirection: 'row' as 'row',
          }}
        >
          <View style={style.iconContainer}>
            <Feather name={this.props.icon} size={spacing.base} color={colors.white}/>
          </View>
          <View style={style.inputWrapper}>
            <TextInput
              style={style.input}
              value={this.props.value}
              onChangeText={(text: string) => this.props.onChange(text)}
              onFocus={() => this.onFocus()}
              onEndEditing={() => { if(!!this.props.onEndEditing) this.props.onEndEditing() }}
              secureTextEntry={this.props.secureTextEntry}
              autoCorrect={this.props.autoCorrect || false}
              autoFocus={this.props.autoFocus}
              selectTextOnFocus={this.props.selectTextOnFocus}
              keyboardType={this.props.keyboardType || 'default'}
              maxLength={this.props.maxLength}
              autoCapitalize={this.props.autoCapitalize || 'sentences'}
              ref={component => this.input = component}
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
    width: 223,
    flexDirection: 'column' as 'column',
    maxWidth: '100%',
  },
  iconContainer: {
    width: spacing.base,
    height: 28,
    marginRight: spacing.tiny,
    justifyContent: 'center' as 'center',
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
  input: {
    ...type.large,
    color: colors.white,
    flex: 1,
    width: '100%',
    maxWidth: 223-32,
    height: 28,
    marginRight: spacing.tiny,
    marginLeft: spacing.tiny,
  },
  bottomBorder: {
    width: '100%',
    height: 2,
    backgroundColor: colors.lilac,
  },
}
