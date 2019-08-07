import React from 'react'
import {
  View,
} from 'react-native'

import { colors, spacing } from '../../../foundation';

interface IProps {
  direction: 'left' | 'right'
}
export default class TriangleCorner extends React.Component<IProps> {
  public render() {
    return (
      <View
        style={{
          ...style.container,
          ...(this.props.direction === 'left' ?
            {
              left: 2,
            } : {
              right: 2,
            }
          ),
        }}
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
    bottom: 0,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid' as 'solid',
    borderTopWidth: spacing.small,
  },
}
