import React from 'react'
import {
  Alert,
  Animated,
} from 'react-native'

import {
  gyroscope,
  SensorData,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors'
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators'

setUpdateIntervalForType(SensorTypes.gyroscope, 400); // defaults to 100ms

interface IProps {
  children: any
  vertical?: boolean
  style?: any
  maxOffset?: number
}
interface IState {
  buoyancy: Animated.ValueXY
  maxOffset: number
  offset: Animated.Value
  vertical?: boolean
}
export default class DynamicListContainer extends React.PureComponent<IProps, IState> {
  private scrollAnimation: Animated.CompositeAnimation | undefined
  private buoyancyAnimation: Animated.CompositeAnimation | undefined
  public state: IState = {
    offset: new Animated.Value(0),
    buoyancy: new Animated.ValueXY({ x: 0, y: 0 }),
    // constants
    maxOffset: this.props.maxOffset || 8,
    vertical: this.props.vertical,
  }
  constructor(props: IProps) {
    super(props)
    const source = gyroscope

    const stabalizer = source.pipe(filter(({ x, y, z, timestamp }) => Math.abs(x) > 0.1 || Math.abs(y) > 0.1))

    this.gyroscope = stabalizer.subscribe(
      ({ x, y, z, timestamp }) => {
        if(this.buoyancyAnimation) {
          this.buoyancyAnimation.stop()
        }
        this.buoyancyAnimation = Animated.sequence([
          Animated.timing(this.state.buoyancy, {
            delay: 30 * Math.abs(x+y),
            duration: 300,
            toValue: {
              x: x * this.state.maxOffset,
              y: y * this.state.maxOffset,
            },
            useNativeDriver: true,
          }),
          Animated.timing(this.state.offset, {
            duration: 5000,
            toValue: 0,
            useNativeDriver: true,
          }),
        ])
        this.buoyancyAnimation.start()
      },
      (error) => {
        this.unsubscribeGyroscope()
      },
    );
  }
  private gyroscope: Subscription | null = null
  public componentWillUnmount() {
    this.unsubscribeGyroscope()
  }
  private unsubscribeGyroscope = () => this.gyroscope && this.gyroscope.unsubscribe()
  private offsetInterp = {
    inputRange: [-this.state.maxOffset * 1.5, this.state.maxOffset * 1.5],
    outputRange: [this.state.maxOffset, this.state.maxOffset],
    extrapolate: 'clamp' as 'clamp',
  }
  public render() {
    const translateY = this.state.buoyancy.y.interpolate(this.offsetInterp)
    const translateX = this.state.buoyancy.x.interpolate(this.offsetInterp)
    return (
      <Animated.View
        style={{
          ...this.props.style,
          transform: [{ translateX },{ translateY }],
        }}
      >
        {this.props.children}
      </Animated.View>
    )
  }
}
