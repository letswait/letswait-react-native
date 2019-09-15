import React, { ReactChildren, ReactNodeArray } from 'react'
import {
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native'

import { colors, type } from '../../../new_foundation'

export interface IButtonStyle {
  container: any
  label: any
}

interface IProps {
  children: any
  disabled?: boolean
  onPress: () => any
  style?: IButtonStyle
  disabledStyle?: IButtonStyle
  toggleable?: boolean
  altChildren?: boolean
}
interface IState {
  disabled: boolean
  disableProgress: Animated.Value
}
/**
 * @class BaseButton
 * @description Root rounded edge button, meant to extend additional button classes
 * @prop {string | any} children - button label
 * @prop {function} onPress - function fired when button is pressed while enabled or toggled
 * @prop {boolean} toggleable? - if true, relenquishes system control to the
 *                               user to be able to toggle button
 * @prop {boolean} disabled? - system control for toggling button usability
 * @prop {IButtonStyle} style? - custom styling when button is enabled,
 *                               meant to be used to modify colors and width
 * @prop {IButtonStyle} disabledStyle? - custom styling when button is disabled,
 *                                       meant to be used to modify colors and width
 */
export default class BaseButton extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      disabled: !!this.props.disabled,
      disableProgress: new Animated.Value(this.props.disabled ? 1 : 0),
    }
  }
  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if(this.props.disabled !== prevProps.disabled) {
      if(prevProps.disabled) {
        this.enable()
      } else {
        this.disable()
      }
    }
  }
  public onPress() {
    // Toggleable overrides the disabled state
    if(this.props.toggleable || !this.state.disabled) {
      this.props.onPress()
      if(this.props.toggleable) {
        if(this.state.disabled) {
          this.enable()
        } else {
          this.disable()
        }
      }
    }
  }
  private enable() {
    this.setState((prevState: IState): IState => {
      return {
        ...prevState,
        disabled: false,
      }
    })
    Animated.timing(
      this.state.disableProgress,
      {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      },
    ).start()
  }
  private disable() {
    this.setState((prevState: IState): IState => {
      return {
        ...prevState,
        disabled: true,
      }
    })
    Animated.timing(
      this.state.disableProgress,
      {
        toValue: 1,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      },
    ).start()
  }
  public render() {
    const backgroundColor = {
      default: this.props.style && this.props.style.container.backgroundColor ?
        this.props.style.container.backgroundColor : colors.white,
      disabled: this.props.disabledStyle && this.props.disabledStyle.container.backgroundColor ?
        this.props.disabledStyle.container.backgroundColor : 'transparent',
    }
    const borderColor = {
      default: this.props.style && this.props.style.container.borderColor ?
        this.props.style.container.borderColor : colors.white,
      disabled: this.props.disabledStyle && this.props.disabledStyle.container.borderColor ?
        this.props.disabledStyle.container.borderColor : colors.white,
    }
    const containerStyle = {
      ...style.container,
      ...(this.props.style ? this.props.style.container : null),
      backgroundColor: this.state.disableProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [backgroundColor.default, backgroundColor.disabled],
      }),
      borderColor: this.state.disableProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [borderColor.default, borderColor.disabled],
      }),
    }
    const labelColor = {
      default: this.props.style && this.props.style.label.color ?
        this.props.style.label.color : colors.cosmos,
      disabled: this.props.disabledStyle && this.props.disabledStyle.label.color ?
        this.props.disabledStyle.label.color : colors.white,
    }
    const labelStyle = {
      ...style.label,
      ...(this.props.style ? this.props.style.label : null),
      color: this.state.disableProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [labelColor.default, labelColor.disabled],
      }),
    }
    return (
      <TouchableOpacity
        onPress={() => this.onPress()}
        activeOpacity={this.state.disabled ? 1 : 0.2}
      >
        <Animated.View style={containerStyle}>
          {this.props.altChildren ?
            this.props.children :
            <Animated.Text
              style={labelStyle}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {this.props.children}
            </Animated.Text>
          }
        </Animated.View>
      </TouchableOpacity>
    )
  }
}

const style = {
  container: {
    maxWidth: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.white,
    width: 155,
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 16,
  },
  label: {
    ...type.large,
    textAlignVertical: 'center' as 'center',
    includeFontPadding: false,
    margin: 12,
    textAlign: 'center' as 'center',
  },
}
