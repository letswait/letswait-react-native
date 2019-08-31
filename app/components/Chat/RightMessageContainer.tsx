import React from 'react'
import {
  Animated,
  Easing,
  Text,
  View,
} from 'react-native'

import { colors, spacing, type } from '../../../foundation'

import TriangleCorner from './TriangleCorner'

export default class SentMessage extends React.PureComponent {
  public render() {
    return (
      <View style={style.wrapper}>
        <TriangleCorner direction="right" />
        <View style={style.flexHelper} />
        <View style={style.container}>
          {this.props.children}
        </View>
      </View>
    )
  }
}

const style = {
  wrapper: {
    width: '100%',
    flexDirection: 'row' as 'row',
  },
  flexHelper: {
    flex: 1,
  },
  container: {
    marginTop: 8,
    minHeight: 34,
    minWidth: 34,
    maxWidth: 225,
    flex: 0,
    backgroundColor: colors.lavender,
    borderRadius: 12,
    overflow: 'hidden' as 'hidden',
    marginRight: 16,
    borderWidth: 0,
  },
  message: {
    ...type.small,
    color: colors.white,
  },
}
