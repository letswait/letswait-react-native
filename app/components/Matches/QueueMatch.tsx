import React from 'react'
import {
  Animated,
  TouchableOpacity,
  View,
} from 'react-native'

import FastImage from 'react-native-fast-image'

import { colors, type } from '../../../new_foundation'

interface IProps {
  source?: string
  onPress: () => any
  enqueued?: boolean
}
export default class QueueMatch extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return this.props.enqueued ?
    (
      <TouchableOpacity
        onPress={() => this.props.onPress()}
        style={style.queueWrapper}
      >
        <View style={style.imageWrapper}>
          <View style={style.imageContainerEnqueued}>
            {this.props.source ?
              <FastImage
                source={{ uri: this.props.source }}
                style={style.image}
              /> : null
            }
          </View>
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={() => this.props.onPress()}
        style={style.queueWrapper}
      >
        <FastImage
          source={{ uri: this.props.source }}
          style={style.image}
        />
      </TouchableOpacity>
    )
  }
}

const style = {
  queueWrapper: {
    height: 67,
    width: 67,
    marginRight: 12,
    backgroundColor: 'transparent',
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
  imageContainerEnqueued: {
    width: 67,
    height: 67,
    borderRadius: 31,
    overflow: 'hidden' as 'hidden',
    borderWidth: 1,
    borderColor: colors.cloud,
    borderStyle: 'dashed' as 'dashed',
  },
  image: {
    width: 67,
    height: 67,
    borderRadius: 31,
    overflow: 'hidden' as 'hidden',
  },
}
