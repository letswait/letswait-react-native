import React from 'react'
import {
  Image,
  View,
} from 'react-native'

import { colors, spacing } from '../../../foundation';

interface IProps {
  source: string
}
export default class MatchImage extends React.Component<IProps> {
  public render() {
    return (
      <View style={style.imageContainer}>
        <Image source={{ uri: this.props.source }} style={style.image}/>
      </View>
    )
  }
}

const style = {
  imageContainer: {
    width: spacing.xlarge * 2,
    height: spacing.xlarge * 2,
    borderWidth: 2,
    borderColor: colors.wisteria,
    overflow: 'hidden' as 'hidden',
    backgroundColor: colors.transparent,
    borderRadius: spacing.xlarge,
  },
  image: {
    width: '100%',
    height: '100%',
  },
}
