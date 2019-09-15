import React from 'react'
import {
  Text,
  View,
} from 'react-native'

import { colors, type } from '../../../../new_foundation';
import MultiSlider from '../../../components/Inputs/MultiSlider/MultiSlider'

interface IProps {
  values: number[]
  heading: string
  subheading: string
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
      <View>
        <View style={style.headerWrapper}>
          <Text style={style.header}>{this.props.heading}</Text>
          <Text style={style.subheader}>{this.props.subheading || ''}</Text>
        </View>
        <MultiSlider
          {...this.props}
          containerStyle={{
            marginTop: 35,
            marginBottom: 24,
          }}
          markerContainerStyle={{
          }}
          markerStyle={{
            width: 18,
            height: 18,
            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 2,
            shadowColor: colors.shadow,
            borderWidth: 0,
          }}
          minMarkerOverlapDistance={3}
          selectedStyle={{
            backgroundColor: colors.white,
            // opacity: 0.7,
          }}
          trackStyle={{
            height: 3,
            // borderRadius: 3,
            // opacity,
            backgroundColor: colors.capri,
            transform: [{ translateY: -1.5 }],
          }}
        />
      </View>
    )
  }
}

const style = {
  headerWrapper: {
    marginTop: 24,
    // marginBotto÷m: 16,
    width: 'auto' as 'auto',
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'center' as 'center',
    alignItems: 'flex-end' as 'flex-end',
  },
  header: {
    ...type.input,
    flex: 0,
  },
  subheader: {
    ...type.input,
    flex: 1,
    textAlign: 'right' as 'right',
  },
}
