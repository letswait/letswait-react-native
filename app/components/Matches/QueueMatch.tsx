import React from 'react'
import {
  Animated,
  Image,
  TouchableOpacity,
  View,
} from 'react-native'

import { colors, spacing, type } from '../../../foundation'

interface IProps {
  source: string
  onPress: () => any
}
export default class Match extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.onPress()}
        style={style.queueWrapper}
      >
        <View style={style.shadowHelper}/>
        <View style={style.imageWrapper}>
          <View style={style.imageContainer}>
            <Image
              source={{ uri: this.props.source }}
              style={style.image}
            />
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const style = {
  queueWrapper: {
    height: 107,
    width: 83,
    backgroundColor: colors.transparent,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  imageWrapper: {
    position: 'absolute' as 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  imageContainer: {
    width: 75,
    height: 75,
    borderRadius: 75/2,
    overflow: 'hidden' as 'hidden',
  },
  shadowHelper: {
    height: 55,
    width: 55,
    borderRadius: 55/2,
    backgroundColor: colors.wisteria,
    shadowColor: colors.wisteria,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
}
