import React from 'react'
import {
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { colors, type } from '../../../../new_foundation'

interface IProps {
  value: boolean
  onChange: (value: boolean) => void
}
interface IState {
  toggleState: Animated.Value
}
export default class InputSlider extends React.PureComponent<IProps, IState> {
  public state: IState = {
    toggleState: new Animated.Value(this.props.value ? 1 : 0),
  }
  public change(value: boolean) {
    Animated.timing(this.state.toggleState, {
      toValue: value ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.exp),
    }).start()
    this.props.onChange(value)
  }
  public render() {
    const trackStyle = {
      ...style.track,
      backgroundColor: this.state.toggleState.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.cloud, colors.seafoam],
      }),
    }
    const slideStyle = {
      ...style.slide,
      left: this.state.toggleState.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 18],
      }),
    }
    return (
      <View style={style.container}>
        <Text style={style.text}>
          {this.props.children}
        </Text>
        <TouchableOpacity onPress={() => this.change(!this.props.value)}>
          <View style={style.buttonWrapper}>
            <Animated.View style={trackStyle} />
            <Animated.View style={slideStyle} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const style = {
  container: {
    flexDirection: 'row' as 'row',
    height: 20,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  text: {
    ...type.input,
    flex: 0,
  },
  track: {
    width: 36,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.cloud,
  },
  slide: {
    width: 18,
    height: 18,
    position: 'absolute' as 'absolute',
    borderRadius: 9,
    backgroundColor: colors.white,
    shadowColor: colors.cosmos,
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  buttonWrapper: {
    width: 36,
    height: 18,
    marginLeft: 8,
    marginTop: 1,
    marginBottom: 1,
    flexGrow: 0,
    flex: 0,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
}
