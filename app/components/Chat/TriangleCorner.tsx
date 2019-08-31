import React from 'react'
import {
  View,
} from 'react-native'

import { colors, spacing } from '../../../foundation';

interface IProps {
  direction: 'left' | 'right'
}
export default class TriangleCorner extends React.PureComponent<IProps> {
  public render() {
    const position = this.props.direction === 'left' ? { left: 6 } : { right: 6 }
    const wrapperStyle = {
      ...style.container,
      ...position,
    }
    return (
      <View
        style={wrapperStyle}
      >
        <View
          style={{
            ...style.triangle,
            ...(this.props.direction === 'left' ?
              {
                transform: [
                  { rotate: '180deg' },
                  // { translateY: -0.33 },
                ],
                borderTopColor: colors.lilac,
                borderRightWidth: 24,
                borderRightColor: 'transparent',
              } : {
                transform: [
                  { rotate: '180deg' },
                  // { translateY: -0.33 },
                ],
                borderTopColor: colors.lavender,
                borderLeftWidth: 24,
                borderLeftColor: 'transparent',
              }
            ),
          }}
        />
      </View>
    )
  }
}

const style = {
  container: {
    width: 24,
    height: 24,
    position: 'absolute' as 'absolute',
    bottom: 0,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid' as 'solid',
    borderTopWidth: 24,
  },
}
