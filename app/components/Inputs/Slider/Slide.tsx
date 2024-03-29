import React from 'react'
import {
  Animated,
  Easing,
  PanResponder,
  Text,
  View,
} from 'react-native'

interface IProps {
  min: number
  max: number
  value?: number
  minPercent?: string
  maxPercent?: string
}
interface IState {
  startPercent: string
  barWidth: number
}
export default class Slide extends React.PureComponent<IProps, IState> {
  public state = {
    startPercent: '0%',
    barWidth: 0,
  }
  private panResponder = PanResponder.create({
    // Grant PanResponder
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      // The gesture has started. Show visual feedback so the user knows
      // what is happening!
      // gestureState.d{x,y} will be set to zero now
      // this.setState({startPercent})
    },
    onPanResponderMove: (evt, gestureState) => {
      // The most recent move distance is gestureState.move{X,Y}
      // The accumulated gesture distance since becoming responder is
      // gestureState.d{x,y}
      // gestureState.dx
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      // The user has released all touches while this view is the
      // responder. This typically means a gesture has succeeded
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
  })
  // public render() {
  //   // const barAligner = {
  //   //   ...style.barAligner,

  //   // }
  //   // return (
  //   //   // <View
  //   //   //   style={style.barWrapper}
  //   //   //   onLayout={e => this.barWrapperRendered()}
  //   //   // >
  //   //   //   <Animated.View style={barAligner}>
  //   //   //     <View style={style.slideHitbox} {...this.panResponder.panHandlers}>
  //   //   //       <View style={style.slide}>

  //   //   //       </View>
  //   //   //     </View>
  //   //   //   </View>
  //   //   // </View>
  //   // )
  // }
}

const style = {
  barWrapper: {
    height: 4,
    left: 0,
    top: 0,
    position: 'absolute' as 'absolute',
  },

}
