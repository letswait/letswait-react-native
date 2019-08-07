import React from 'react'
import {
  Animated,
  Easing,
  PanResponder,
  Text,
  View,
} from 'react-native'

/**
 * @todo Create Custom Slider & Multi-Slider to give better custom app feel.
 */
interface IProps {
  value?: number
  onChange: (value: number) => any
  min?: number,
  max?: number,
}
interface IState {

}
export default class Slider extends React.PureComponent<IProps, IState> {
  public state = {

  }
  constructor(props: IProps) {
    super(props)
  }
  private panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
  })
}