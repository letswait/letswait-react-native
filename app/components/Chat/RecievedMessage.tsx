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
  sentTimestamp: Date,
  readTimestamp: Date | undefined
  message: {
    text: string,
    images?: string[]
    cloudfront?: string
    location?: {
      coordinates: number[],
    },
  },
  reactions: Map<string, string>
}
export default class SentMessage extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    let textMessage = ''
    const { text, images, cloudfront, location } = this.props.message
    textMessage = text || ''
    if(location) textMessage = 'Venue Location Sent'
    if(images) textMessage = 'Image Sent'
    if(cloudfront) textMessage = 'Video Sent'
    return (
      <View style={style.wrapper}>
        <TriangleCorner direction="left" />
        <View style={style.flexHelper} />
        <View style={style.container}>
          <Text style={style.message}>
            {textMessage}
          </Text>
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
    minHeight: 34,
    minWidth: 34,
    maxWidth: 225,
    flex: 0,
    padding: spacing.tiny,
    backgroundColor: colors.lilac,
    borderRadius: spacing.tiny,
    marginLeft: spacing.tiny + 8,
    borderWidth: 0,
  },
  message: {
    ...type.small,
    color: colors.white,
  },
}
