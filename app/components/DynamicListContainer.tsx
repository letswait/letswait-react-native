import React from 'react'
import {
  Animated,
  Easing,
  Alert,
} from 'react-native'

import {
  gyroscope, SensorData,
} from 'react-native-sensors'
import { Observable, Subscription } from 'rxjs';

interface IProps {
  children: any
  vertical: boolean
  style?: any
  maxOffset?: number
}
interface IState {
  maxOffset: number
  offset: Animated.Value
  vertical: boolean
}
export default class DynamicListContainer extends React.PureComponent<IProps, IState> {
  private scrollAnimation: Animated.CompositeAnimation | undefined
  public state: IState = {
    offset: new Animated.Value(0),
    // constants
    maxOffset: this.props.maxOffset || 8,
    vertical: this.props.vertical,
  }
  public onScroll (toValue: number, delay: number, duration: number = 300) {
    if(this.scrollAnimation) {
      this.scrollAnimation.stop()
    }
    this.scrollAnimation =
    Animated.sequence([
      Animated.timing(this.state.offset, {
        delay,
        duration,
        toValue: Math.max(this.state.maxOffset * -1, Math.min(this.state.maxOffset, toValue)),
        useNativeDriver: true,
      }),
      Animated.timing(this.state.offset, {
        duration: duration * 2,
        toValue: 0,
        useNativeDriver: true,
      }),
    ])
    this.scrollAnimation.start()
  }
  public render() {
    return (
      <Animated.View
        style={{
          ...this.props.style,
          transform: this.state.vertical ?
            [{ translateY: this.state.offset }] :
            [{ translateX: this.state.offset }],
        }}
      >
        {this.props.children}
      </Animated.View>
    )
  }
}
