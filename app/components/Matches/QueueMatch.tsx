import React from 'react'
import {
  Animated,
  TouchableOpacity,
  View,
} from 'react-native'

import FastImage from 'react-native-fast-image'

import { colors, spacing, type } from '../../../foundation'

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
        <View style={style.shadowHelper}/>
        <View style={style.imageWrapper}>
          <View style={style.imageContainer}>
            <FastImage
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
  imageContainerEnqueued: {
    width: 75,
    height: 75,
    borderRadius: 75/2,
    overflow: 'hidden' as 'hidden',
    borderWidth: 1,
    borderColor: colors.lilac,
    borderStyle: 'dashed' as 'dashed',
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
