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
    const position = { right: 8 }
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
                  { translateY: -0.33 },
                ],
                borderTopColor: colors.lilac,
                borderRightWidth: spacing.small,
                borderRightColor: 'transparent',
              } : {
                transform: [
                  { rotate: '180deg' },
                  { translateY: -0.33 },
                ],
                borderTopColor: colors.lavender,
                borderLeftWidth: spacing.small,
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
    width: 16,
    height: 16,
    position: 'absolute' as 'absolute',
    bottom: 0.5,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid' as 'solid',
    borderTopWidth: spacing.small,
  },
}
