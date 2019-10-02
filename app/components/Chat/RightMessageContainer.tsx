import React from 'react'
import {
  Animated,
  Easing,
  Text,
  View,
} from 'react-native'

import { colors, type } from '../../../new_foundation'

import LinearGradient from 'react-native-linear-gradient'

export default class SentMessage extends React.PureComponent {
  public render() {
    return (
      <View style={style.wrapper}>
        <View style={style.flexHelper} />
        <LinearGradient
          colors={['#9EE3FE', '#93DBF8']}
          style={style.container}
        >
          {this.props.children}
        </LinearGradient>
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
    minHeight: 37,
    minWidth: 37,
    flex: 0,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    overflow: 'hidden' as 'hidden',
    borderWidth: 0,
  },
  message: {
    ...type.regular,
    color: colors.cosmos,
  },
}
