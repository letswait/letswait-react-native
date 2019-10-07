import React from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  Text,
  View,
} from 'react-native'

const { width, height } = Dimensions.get('window')

/**
 * @todo Create Custom Slider & Multi-Slider to give better custom app feel.
 */
interface IProps {
  onRelease: (e: any) => any
}
export default class Slider extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  private panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {
      // The gesture has started. Show visual feedback so the user knows
      // what is happening!
      // gestureState.d{x,y} will be set to zero now
      // this.setState({startPercent})
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      // The user has released all touches while this view is the
      // responder. This typically means a gesture has succeeded
      this.props.onRelease(gestureState)
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
  public render() {
    return (
      <View pointerEvents="box-none" style={style.container}>
        <View {...this.panResponder.panHandlers} style={style.rightSwipe}/>
        <View {...this.panResponder.panHandlers} style={style.leftSwipe}/>
      </View>
    )
  }
}

const style = {
  container: {
    height,
    width,
    position: 'absolute' as 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
  },
  rightSwipe: {
    height,
    width: 32,
  },
  leftSwipe: {
    height,
    width: 32,
  },
}
