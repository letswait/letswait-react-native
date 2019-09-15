import React from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { isIphoneX } from 'react-native-iphone-x-helper'
import { colors, type } from '../../../new_foundation'

const { width, height } = Dimensions.get('window')

interface IProps {
  message: string,
  action: Function,
  duration: number,
}
export default class AppToast extends React.PureComponent<IProps,{}> {
  private progress = new Animated.Value(0)
  private translateYBase = isIphoneX ? 100 : 72
  public componentDidUpdate() {
    this.animate()
  }
  private animate() {
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(this.progress, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.delay(Math.max(this.props.duration - 600, 1000)),
      Animated.timing(this.progress, {
        toValue: 0,
        duration: 170,
        easing: Easing.in(Easing.elastic(1)),
        useNativeDriver: true,
      }),
    ]).start()
  }
  public render() {
    const translateY = this.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [this.translateYBase, 0],
    })
    const wrapper = {
      ...style.wrapper,
      transform: [
        { translateY },
      ],
    }
    return (
      <Animated.View style={wrapper} pointerEvents="box-none">
        <TouchableWithoutFeedback
          onPress={() => this.props.action()}
        >
          <View style={style.container}>
            <Text style={style.text}>
              {this.props.message}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    )
  }
}

const style = {
  wrapper: {
    width,
    position: 'absolute' as 'absolute',
    bottom: isIphoneX ? 48 : 28 ,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  container: {
    width: width-64,
    backgroundColor: colors.seafoam,
    borderColor: colors.white,
    borderWidth: 2,
    shadowColor: colors.cosmos,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    height: 48,
    borderRadius: 16,
  },
  text: {
    ...type.small,
    color: colors.white,
    textAlign: 'center' as 'center',
  },
}
