import React from 'react'
import {
  Image,
  View,
} from 'react-native'

import FastImage from 'react-native-fast-image';

interface IProps {
  source: string
}
export default class MatchImage extends React.Component<IProps> {
  public render() {
    return (
      <View style={style.imageContainer}>
        <FastImage source={{ uri: this.props.source }} style={style.image}/>
      </View>
    )
  }
}

const style = {
  imageContainer: {
    width: 120,
    height: 120,
    overflow: 'hidden' as 'hidden',
    backgroundColor: 'transparent',
    borderRadius: 60,
  },
  image: {
    width: '100%',
    height: '100%',
  },
}
