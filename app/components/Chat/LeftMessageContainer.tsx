import React from 'react'
import {
  Animated,
  Easing,
  Text,
  View,
} from 'react-native'

import { colors, type } from '../../../new_foundation'

export default class SentMessage extends React.PureComponent {
  public render() {
    return (
      <View style={style.wrapper}>
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
    flexDirection: 'row-reverse' as 'row-reverse',
  },
  flexHelper: {
    flex: 1,
  },
  container: {
    minHeight: 43,
    minWidth: 43,
    maxWidth: 200,
    flex: 0,
    backgroundColor: '#DCDDDE',
    borderRadius: 12,
    overflow: 'hidden' as 'hidden',
    borderWidth: 0,
  },
  message: {
    ...type.regular,
    color: colors.cosmos,
  },
}
