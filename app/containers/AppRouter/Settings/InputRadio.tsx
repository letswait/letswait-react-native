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
  value: string
  data: string[]
  display: string[]
  onChange: (value: string) => void
}
interface IState {
  width: number,
  transformX: Animated.Value
}
export default class InputSlider extends React.PureComponent<IProps, IState> {
  public state: IState = {
    width: 0,
    transformX: new Animated.Value((() => {
      for(let i = 0; i < this.props.data.length; i++) {
        if(this.props.data[i] === this.props.value) {
          return i
        }
      }
      return 0
    })()),
  }
  public change(response: string) {
    let animatedValue: number = 0
    for(let i = 0; i < this.props.data.length; i++) {
      if(this.props.data[i] === response) {
        animatedValue = i
      }
    }
    Animated.timing(this.state.transformX, {
      toValue: animatedValue,
      duration: 150,
      easing: Easing.inOut(Easing.circle),
    }).start()
    this.props.onChange(response)
  }
  public render() {
    const activeText = {
      ...style.text,
      color: '#fff',
    }
    const text = {
      ...style.text,
      opacity: 0.9,
      color: '#A372E2',
    }
    const activeSelection = {
      ...style.activeSelection,
      width: `${(1 / this.props.data.length) * 100}%`,
      transform: [{
        translateX: this.state.transformX.interpolate({
          inputRange: [0, 1],
          outputRange: [0, (1 / this.props.data.length) * this.state.width],
        }),
      }],
    }
    return (
      <View style={style.container} onLayout={event => this.setState({ width: event.nativeEvent.layout.width })}>
        <Animated.View style={activeSelection}/>
        {this.props.data.length && this.props.data.map((response, i, arr) => {
          return (
            <View key={i} style={style.responseWrapper}>
              <TouchableOpacity onPress={() => this.change(response)}>
                <Text style={response === this.props.value ? activeText : text}>
                  {this.props.display[i]}
                </Text>
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    )
  }
}

const style = {
  container: {
    width: '100%',
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
    borderColor: 'rgba(239, 53, 255, 0.2)',
    borderWidth: 1.5,
    backgroundColor: '#fff',
    flexDirection: 'row' as 'row',
    height: 48,
  },
  text: {
    lineHeight: 20,
    fontSize: 17,
    fontWeight: '500' as '500',
    textAlign: 'center' as 'center',
  },
  activeSelection: {
    backgroundColor: 'rgba(192, 125, 237, 0.9)',
    borderColor: '#fff',
    borderWidth: 1.5,
    height: 48,
    position: 'absolute' as 'absolute',
    top: -1.5,
    left: -1.5,
    borderRadius: 8,
  },
  responseWrapper: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    zIndex: 1,
  },
}
