import React from 'react'
import {
  View,
} from 'react-native'

import MultiSlider from '../../../components/Inputs/MultiSlider/MultiSlider'

interface IProps {
  values: number[]
  min?: number
  max?: number
  sliderLength?: number
  onValuesChangeStart?: () => void
  onValuesChange?: (values: number[]) => void
  onValuesChangeFinish?: (values: number[]) => void
}
export default class InputSlider extends React.PureComponent<IProps> {
  public render() {
    return (
      <MultiSlider
        {...this.props}
        containerStyle={{
          marginTop: 32,
        }}
        markerContainerStyle={{
        }}
        markerStyle={{
          width: 32,
          height: 32,
          borderWidth: 2,
          borderColor: 'rgba(192, 125, 237, 0.7)',
          shadowColor: 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 0,
          shadowOpacity: 0,
        }}
        minMarkerOverlapDistance={3}
        selectedStyle={{
          backgroundColor: '#C07DED',
          opacity: 0.7,
        }}
        trackStyle={{
          height: 6,
          borderRadius: 3,
          opacity: 0.25,
          backgroundColor: '#A372E2',
          transform: [{ translateY: -3 }],
        }}
      />
    )
  }
}
