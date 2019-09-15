import React from 'react'
import {
  Animated,
  Easing,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import Feather from 'react-native-vector-icons/Feather'

import { colors, type } from '../../../../new_foundation'

interface IProps {
  value: string
  style: any
  data: string[]
  display: Array<{
    image?: string,
    icon?: string,
    text: string,
  }>
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
    // const activeText = {
    //   ...style.text,
    //   color: '#fff',
    // }
    const activeSelection = {
      ...style.activeSelection,
      // width: `${(1 / this.props.data.length) * 100}%`,
      transform: [{
        translateX: this.state.transformX.interpolate({
          inputRange: [0, 1],
          outputRange: [0, (1 / this.props.data.length) * this.state.width],
        }),
      }],
    }
    return (
      <View
        style={{ ...style.container, ...this.props.style }}
        onLayout={event => this.setState({ width: event.nativeEvent.layout.width })}
      >
        <Animated.View style={activeSelection}/>
        {this.props.data.length && this.props.data.map((response, i, arr) => {
          return (
            <TouchableOpacity
              key={i}
              style={style.responseWrapper}
              onPress={() => this.change(response)}
            >
              {this.props.display[i].icon ?
                <Feather
                  name={this.props.display[i].icon!}
                  color={colors.white}
                  size={64}
                /> :
                <Image
                  style={{ width: 56, height: 56 }}
                  source={{ uri: this.props.display[i].image! }}
                />
              }
              <Text style={style.text}>
                {this.props.display[i].text}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }
}

const style = {
  container: {
    width: '100%',
    minWidth: 324,
    marginTop: 12,
    marginBottom: 16,
    flexDirection: 'row' as 'row',
    height: 108,
  },
  text: {
    ...type.regular,
    textAlign: 'center' as 'center',
    marginTop: 4,
  },
  activeSelection: {
    backgroundColor: colors.capri,
    height: 108,
    width:108,
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    borderRadius: 54,
  },
  responseWrapper: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    zIndex: 1,
    height: 108,
  },
}
