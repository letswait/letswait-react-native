import React from 'react'
import {
  Animated,
  Easing,
  Text,
  View,
} from 'react-native'

import { colors, spacing, type } from '../../../foundation'

import TriangleCorner from './TriangleCorner'

interface IProps {
  message: string,
}
export default class SentMessage extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <View style={style.wrapper}>
        <TriangleCorner direction="right"/>
        <View style={style.flexHelper} />
        <View style={style.container}>
          <Text style={style.message}>
            {this.props.message}
          </Text>
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
    minHeight: 34,
    minWidth: 34,
    maxWidth: 225,
    flex: 0,
    padding: spacing.tiny,
    backgroundColor: colors.lavender,
    borderRadius: spacing.tiny,
    marginRight: spacing.tiny + 2,
    borderWidth: 0,
  },
  message: {
    ...type.small,
    color: colors.white,
  },
}
