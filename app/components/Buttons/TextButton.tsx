import React, { Children } from 'react'
import {
  Text,
  TouchableOpacity,
} from 'react-native'

import { colors, type } from '../../../foundation'

interface IProps {
  children: any
  onPress: () => any
  style?: any
}
export default class TextButton extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <TouchableOpacity onPress={() => this.props.onPress()}>
        <Text style={{ ...style, ...this.props.style }}>
          {this.props.children}
        </Text>
      </TouchableOpacity>
    )
  }
}

const style = {
  ...type.small,
  textAlign: 'center' as 'center',
  color: 'rgba(55,55,55,1)',
}
