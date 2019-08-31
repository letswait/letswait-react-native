import React from 'react'
import {
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

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
        outputRange: ['rgba(163, 114, 226, 0.15)', 'rgba(182, 127, 255, 0.5)'],
      }),
    }
    const slideStyle = {
      ...style.slide,
      backgroundColor: this.state.toggleState.interpolate({
        inputRange: [0, 1],
        outputRange: ['#DFAFFF', '#CA8BF4'],
      }),
      left: this.state.toggleState.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 20],
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
    marginLeft: 8,
    marginRight: 8,
    flexDirection: 'row' as 'row',
    height: 48,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  text: {
    lineHeight: 20,
    fontSize: 14,
    fontWeight: '500' as '500',
    flexGrow: 1,
    flex: 1,
    color: '#A372E2',
  },
  track: {
    width: 48,
    height: 20,
    borderRadius: 10,
  },
  slide: {
    width: 28,
    height: 28,
    position: 'absolute' as 'absolute',
    borderRadius: 14,
    top: 10,
  },
  buttonWrapper: {
    width: 48,
    height: 48,
    flexGrow: 0,
    flex: 0,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
}
