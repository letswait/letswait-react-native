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
    minHeight: 37,
    minWidth: 37,
    flex: 0,
    backgroundColor: '#E3F1FF',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    overflow: 'hidden' as 'hidden',
    borderWidth: 0,
  },
  message: {
    ...type.regular,
    color: colors.cosmos,
  },
}
