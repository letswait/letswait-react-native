import React, { RefObject } from 'react'
import {
  Animated,
  Easing,
  Image,
  PanResponder,
  PanResponderCallbacks,
  Text,
  View,
} from 'react-native'

import Haptic from 'react-native-haptic'

import { colors, spacing, type } from '../../../foundation'
import { SpinnerInfo, SpinnerSegmentType } from '../../types/spinner'

import { SpinnerSegment } from './SpinnerSegment'

import Queue from './Queue';

interface ISpinnerStyles {
  transform?: any[],
  width?: string,
  height?: string
}
interface ISpinnerValues {
  lastRotation: number,
  initialRotation: number,
  time: number
  rotation: number,
  friction: number,
  velocity: number,
}

interface IProps {
  onSpin: () => any
  onFinish: () => any
  segments: SpinnerInfo
  result?: SpinnerSegmentType
}
interface IState {
  spinnable: boolean
  rot: Animated.Value
  lastVelocity: string
}
export default class Spinner extends React.PureComponent<IProps, IState> {
  private spinnerRef: any
  private spinnerValues: ISpinnerValues = {
    initialRotation: 0,
    time: 0,
    lastRotation: 0,
    rotation: 0,
    friction: 0.001,
    velocity: 0,
  }
  private velocityQueue: Queue<number> = new Queue()
  private spinnerStyles: {style: ISpinnerStyles} = { style: {} }
  private panResponder = PanResponder.create({
    // Ask to be the responder:
    onStartShouldSetPanResponder: (evt, gestureState) => this.state.spinnable,
    onMoveShouldSetPanResponder: (evt, gestureState) => this.state.spinnable,

    onPanResponderGrant: (evt, gestureState) => {
      // The gesture has started. Show visual feedback so the user knows
      // what is happening!

      // gestureState.d{x,y} will be set to zero now
      // console.log('granted gesture to component: ', evt, gestureState)
      this.velocityQueue = new Queue(1)
      const θ = this.getRotation(evt, gestureState)
      this.spinnerValues.initialRotation = θ
    },
    onPanResponderMove: (evt, gestureState) => {
      // The most recent move distance is gestureState.move{X,Y}

      // The accumulated gesture distance since becoming responder is
      // gestureState.d{x,y}

      // translate x axis {h, k}, and location {x, y} in respect to the new origin
      const rot = this.getRotation(evt, gestureState)
      const changeRot = rot - this.spinnerValues.initialRotation
      const newRot = changeRot + this.spinnerValues.lastRotation
      this.spinnerStyles.style.transform = [{ rotate: `${newRot}rad` }]
      this.spinnerValues.rotation = newRot
      this.spinnerValues.time = evt.nativeEvent.timestamp
      this.velocityQueue.enqueue(this.getAngularVelocity(evt, gestureState))
      this.updateNativeStyles()
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      // The user has released all touches while this view is the
      // responder. This typically means a gesture has succeeded
      const θ = this.getRotation(evt, gestureState)
      const θΔ = θ - this.spinnerValues.lastRotation
      const newRot = this.spinnerValues.lastRotation + θΔ
      const time = evt.nativeEvent.timestamp

      // const velocity = (newRot - this.spinnerValues.rotation) / (time - this.spinnerValues.time)
      this.velocityQueue.enqueue(this.getAngularVelocity(evt, gestureState))
      let velocitySum = 0
      let velocityCount = 0
      while(!this.velocityQueue.isEmpty()) {
        velocitySum = this.velocityQueue.dequeue()!
        velocityCount++
      }
      const velocity = velocitySum / velocityCount
      this.spinnerValues.velocity = velocity
      this.spinnerValues.time = time
      this.spinnerValues.rotation = newRot
      this.spinnerValues.lastRotation = newRot
      const shouldSpin =
        (velocity > 0 && velocity >= 0.5) ||
        (velocity < 0 && velocity <= -0.5)
      this.setState((prevState: IState): IState => {
        return {
          ...prevState,
          spinnable: false,
        }
      })
      this.props.onSpin()
      this.moveSpinner(shouldSpin)
    },
    onPanResponderTerminate: (evt, gestureState) => {
      // Another component has become the responder, so this gesture
      // should be cancelled
    },
    onShouldBlockNativeResponder: (evt, gestureState) => {
      // Returns whether this component should block native components from becoming the JS
      // responder. Returns true by default. Is currently only supported on android.
      return true;
    },
  });
  constructor(props: IProps) {
    super(props)
    this.state = {
      spinnable: true,
      rot: new Animated.Value(0),
      lastVelocity: '',
    }
  }
  private moveSpinner(origin: boolean = false) {
    setTimeout(
      () => {
        // Change Rotation
        const newRot = this.spinnerValues.rotation + this.spinnerValues.velocity
        this.spinnerValues.rotation = newRot

        // Modify Velocity if got server response
        let velocity = this.spinnerValues.velocity
        if(this.props.result !== undefined) {
          velocity = velocity > 0 ?
            velocity - this.spinnerValues.friction :
            velocity + this.spinnerValues.friction
          this.spinnerValues.velocity = velocity
        }

        // Create Vibration
        const vibrateDeg = Math.abs(((newRot * 180)/Math.PI)%45)
        if(Math.abs(velocity) >= 0.20) {
          Haptic.generate('impactLight')
        } else if(Math.abs(velocity) >= 0.1 && vibrateDeg < 20) {
          Haptic.generate('impactLight')
        } else if(vibrateDeg <= 5) {
          Haptic.generate('impactLight')
        }

        if(0.03 > velocity && velocity > -0.03 && this.props.result) {
          this.spinnerStyles.style.transform = [{ rotate: `${newRot}rad` }]
          this.spinToSegment(this.props.result)
        } else {
          this.spinnerStyles.style.transform = [{ rotate: `${newRot}rad` }]
          this.updateNativeStyles()
          this.moveSpinner()
        }
      },
      10,
    )
  }
  private spinToSegment(segment: number) {
    // this.spinnerValues.rotation
    // this.setState((prevState: IState): IState => {
    //   return {
    //     ...prevState,
    //     spinnable: true,
    //   }
    // })
    const targetRot = (45 * (Math.PI/180)) * segment
    let slowSpinner = false
    // Establish Ranges
    const range = 6
    const halfRange = range / 2
    const radRange = range * Math.PI/180
    // Degree Offset for accurate targeting
    const ccDegreeOffset = 20
    // Counter Clockwise Degree Value
    const ccMaxDegree = halfRange + ccDegreeOffset
    // Counter Clockwise Target Radians
    const ccRadian = {
      min: Math.abs(this.normalizeAngle(
        targetRot - (halfRange * Math.PI/180) + (ccDegreeOffset * Math.PI/180),
      )), // 355deg
      max: Math.abs(this.normalizeAngle(targetRot + (ccMaxDegree * Math.PI/180))), // 5deg
    }
    // Degree Offset for accurate targeting
    const cDegreeOffset = 65
    // Clockwise Degree Values
    const cMinDegree = 45 - halfRange - cDegreeOffset
    const cMaxDegree = 45 + halfRange - cDegreeOffset
    // Clockwise Target Radians
    const cRadian = {
      min: Math.abs(this.normalizeAngle(targetRot + (cMinDegree * Math.PI/180))), // 40deg
      max: Math.abs(this.normalizeAngle(targetRot + (cMaxDegree * Math.PI/180))), // 50deg
    }
    console.log('Counter Clockwise Radians', ccRadian, 'Clockwise Radians', cRadian)
    const moveSpinner = () => {
      setTimeout(
        () => {
          // Change Rotation
          let velocity = this.spinnerValues.velocity
          const newRot = this.spinnerValues.rotation + velocity
          this.spinnerValues.rotation = newRot

          if(!slowSpinner) {
            // Normalize Rotation Radian between 0 and 2pi
            const normalizedRotation = Math.abs(this.normalizeAngle(newRot))
            console.log(normalizedRotation, velocity)
            if(velocity < 0) { // Counter-clockwise Rotation
              if(
                ( // if min is within range of 2pi
                  ccRadian.min + radRange >= Math.PI*2 &&
                  normalizedRotation >= ccRadian.min
                ) || ( // if max is within range of 0
                  ccRadian.max - radRange <= 0 &&
                  normalizedRotation <= ccRadian.max
                ) || ( // if min is within range of 2pi, use different
                  normalizedRotation >= ccRadian.min &&
                  normalizedRotation <= ccRadian.max
                )
              ) {
                slowSpinner = true
              }
            } else if(velocity > 0) { // Clockwise Rotation
              if(
                ( // if min is within range of 2pi
                  cRadian.min + radRange >= Math.PI*2 &&
                  normalizedRotation >= cRadian.min
                ) || ( // if max is within range of 0
                  cRadian.max - radRange <= 0 &&
                  normalizedRotation <= cRadian.max
                ) || ( // if min is within range of 2pi, use different
                  normalizedRotation >= cRadian.min &&
                  normalizedRotation <= cRadian.max
                )
              ) {
                slowSpinner = true
              }
            }
          } else {
            velocity = velocity > 0 ?
              velocity - this.spinnerValues.friction :
              velocity + this.spinnerValues.friction
            this.spinnerValues.velocity = velocity
          }

          // Create Vibration
          const vibrateDeg = Math.abs(((newRot * 180)/Math.PI)%45)
          if(vibrateDeg <= 5) {
            Haptic.generate('impactLight')
          }

          if(0.005 > velocity && velocity > -0.005) {
            this.spinnerStyles.style.transform = [{ rotate: `${targetRot}rad` }]
            this.updateNativeStyles()
            this.setState((prevState: IState): IState => {
              return {
                ...prevState,
                spinnable: true,
              }
            })
          } else {
            this.spinnerStyles.style.transform = [{ rotate: `${newRot}rad` }]
            this.updateNativeStyles()
            moveSpinner()
          }
        },
        10,
      )
    }
    moveSpinner()
  }
  private normalizeAngle(n: number, mode: 'radians' | 'degrees' = 'radians'): number {
    if(mode === 'radians') {
      let rad = n % (2 * Math.PI)
      if(rad < 0) {
        rad += Math.PI * 2
      }
      return rad
    }
    return n % 360
  }
  private getRotation(evt: any, gestureState: any): number {
    const { h, k } = { h: 150, k: 150 }
    let x = evt.nativeEvent.locationX
    x = x > h ? x - h : -Math.abs(x - h)
    let y = evt.nativeEvent.locationY
    y = y > k ? y - k : -Math.abs(y - k)
    return Math.atan2(y, x)
  }
  private getAngularVelocity(evt: any, gestureState: any): number {
    // Setup cartesian coordinates
    const { h, k } = { h: 150, k: 150 }
    // Find Touch Location And transform according to origin
    let touchX = evt.nativeEvent.locationX
    touchX = touchX - h
    let touchY = evt.nativeEvent.locationY
    touchY = k - touchY
    const { vx, vy } = gestureState
    const v = Math.sqrt((vx * vx) + (vy * vy))/5
    const θ = -1 * Math.atan(touchY / touchX)
    // Calculate Angular Velocity
    let a = v / θ
    if(a > 0) {
      a = Math.min(a, 0.5)
    } else {
      a = Math.max(a, -0.5)
    }
    return a
  }
  private updateNativeStyles() {
    return this.spinnerRef && this.spinnerRef.setNativeProps(this.spinnerStyles)
  }
  public render() {
    return (
      <View
        style={style.wrapper}
        {...this.panResponder.panHandlers}
      >
        <Animated.View
          ref={(component: any) => {
            this.spinnerRef = component
          }}
          pointerEvents="none"
          style={style.spinnerContainer}
        >
          <Image
            style={style.spinnerImage}
            source={require('../../../assets/images/spinner.png')}
          />
          {this.props.segments.map((segment, i, arr) => (
            <SpinnerSegment
              source={segment.image}
              position={i as SpinnerSegmentType}
            />
          ))}
        </Animated.View>
        <View style={style.innerWrapper} pointerEvents="none">
          <View style={style.tickerContainer}>
            <View style={style.ticker}/>
            <View style={style.center}>
              <Text>
                {this.state.lastVelocity}
              </Text>
              {/* <Image/> */}
              {/* <Text> */}

              {/* </Text> */}
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const style = {
  wrapper: {
    width: 300,
    height: 300,
  },
  spinnerContainer: {
    width: '100%',
    height: '100%',
  },
  spinnerImage: {
    width: '100%',
    height: '100%',
  },
  innerWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute' as 'absolute',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  tickerContainer: {
    width: 85,
    height: 85,
    overflow: 'visible' as 'visible',
  },
  center: {
    backgroundColor: colors.white,
    borderRadius: 85/2,
    height: 85,
    width: 85,
  },
  ticker: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid' as 'solid',
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderBottomWidth: 60,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.white,
    position: 'absolute' as 'absolute',
    top: -40,
    left: 85/2 - 30,
  },
}
