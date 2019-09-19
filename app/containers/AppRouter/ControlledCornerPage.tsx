import React from 'react'
import {
  Dimensions,
  TouchableOpacity,
  View,
} from 'react-native'

import Feather from 'react-native-vector-icons/Feather'

import { ifIphoneX } from 'react-native-iphone-x-helper'

import { colors, type } from '../../../new_foundation'

const { width, height } = Dimensions.get('window')

const top = ifIphoneX(52, 28)
const bottom = ifIphoneX(20, 16)
const left = 20
const right = 20

interface IProps {
  topRight?: string | any
  onTopRight?: Function
  topLeft?: string | any
  onTopLeft?: Function
  bottomRight?: string | any
  onBottomRight?: Function
  bottomLeft?: string | any
  onBottomLeft?: Function
  style?: any
}
export default class ControlledCornerPage extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <View style={{ ...style.container, ...this.props.style }}>
        {this.props.children}
        {this.props.topRight ?
          <ControlledCorner
            {...(typeof this.props.topRight === 'string' ?
              { icon: this.props.topRight } : { contains: this.props.topRight }
            )}
            onPress={() => this.props.onTopRight!()}
            direction={{ top, right }}
          /> :
          null
        }
        {this.props.topLeft ?
          <ControlledCorner
            {...(typeof this.props.topLeft === 'string' ?
              { icon: this.props.topLeft } : { contains: this.props.topLeft }
            )}
            onPress={() => this.props.onTopLeft!()}
            direction={{ top, left }}
          /> :
          null
        }
        {this.props.bottomRight ?
          <ControlledCorner
            {...(typeof this.props.bottomRight === 'string' ?
              { icon: this.props.bottomRight } : { contains: this.props.bottomRight }
            )}
            onPress={() => this.props.onBottomRight!()}
            direction={{ bottom, right }}
          /> :
          null
        }
        {this.props.bottomLeft ?
          <ControlledCorner
            {...(typeof this.props.bottomLeft === 'string' ?
              { icon: this.props.bottomLeft } : { contains: this.props.bottomLeft }
            )}
            onPress={() => this.props.onBottomLeft!()}
            direction={{ bottom, left }}
          /> :
          null
        }
      </View>
    )
  }
}

const ControlledCorner = (props: {
  direction: any,
  onPress: Function,
  icon?: string,
  contains?: any,
}) => (
  <TouchableOpacity
    onPress={() => props.onPress()}
    style={{ ...style.controlledCornerCircle, ...props.direction }}
  >
    {props.icon ? <Feather name={props.icon} color={colors.white} size={32} /> : null}
    {props.contains ? props.contains : null}
  </TouchableOpacity>
)

const style = {
  container: {
    width,
    height,
  },
  controlledCornerCircle: {
    position: 'absolute' as 'absolute',
    width: 50,
    height: 50,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
}
