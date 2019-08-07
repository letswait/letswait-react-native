import React from 'react'
import {
  Image,
  View,
} from 'react-native'

import { colors, spacing, type } from '../../../foundation'

interface IProps {
  source: string,
  position: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
}
export class SpinnerSegment extends React.PureComponent<IProps> {
  public render() {
    return (
      <View
        style={{
          ...style.container,
          transform: [
            { rotate: `${45*this.props.position}deg` },
          ],
        }}
      >
        <Image
          source={{ uri: this.props.source }}
          style={style.image}
          resizeMode="contain"
        />
      </View>
    )
  }
}

const style = {
  container: {
    position: 'absolute' as 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start' as 'flex-start',
    alignItems: 'center' as 'center',
  },
  image: {
    width: spacing.large,
    height: spacing.large,
    marginTop: spacing.base,
  },
}
