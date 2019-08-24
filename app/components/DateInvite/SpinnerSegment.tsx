import React from 'react'
import {
  Image,
  View,
  Animated,
  Easing,
} from 'react-native'

import { colors, spacing, type } from '../../../foundation'

interface IProps {
  source: string,
  position: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  hideImage: boolean
}
export class SpinnerSegment extends React.PureComponent<IProps> {
  private imageOpacity = new Animated.Value(!!this.props.hideImage ? 0 : 1)
  public componentDidUpdate(prevProps: IProps) {
    if(!!this.props.hideImage !== !!prevProps.hideImage) {
      Animated.timing(this.imageOpacity, {
        toValue: !!this.props.hideImage ? 0 : 1,
        delay: 50,
        duration: 400,
        easing: Easing.out(Easing.ease)
      }).start()
    }
  }
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
        <Animated.Image
          source={{ uri: this.props.source }}
          style={{
            width: spacing.large,
            height: spacing.large,
            marginTop: spacing.base,
            opacity: this.imageOpacity,
          }}
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
}
