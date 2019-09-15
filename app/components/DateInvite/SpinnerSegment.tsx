import React from 'react'
import {
  Image,
  View,
  Animated,
  Easing,
  Text,
} from 'react-native'

import { type, colors } from '../../../new_foundation'

interface IProps {
  label: string
  position: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
  hideImage: boolean
}
export class SpinnerSegment extends React.PureComponent<IProps> {
  public render() {
    return (
      <View
        style={{
          ...style.container,
          transform: [
            { rotate: `${30*this.props.position}deg` },
          ],
        }}
      >
        <Text style={style.label}>
          {this.props.label}
        </Text>
      </View>
    )
  }
}

const style = {
  container: {
    position: 'absolute' as 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center' as 'center',
    alignItems: 'flex-start' as 'flex-start',
  },
  label: {
    ...type.title2,
    width: 85,
    fontSize: 12,
    lineHeight: 14,
    textAlign: 'right' as 'right',
    marginRight: 170,
    color: colors.white,
  },
}
