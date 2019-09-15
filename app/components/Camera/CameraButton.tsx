import React from 'react'
import {
  TouchableOpacity,
} from 'react-native'

import Feather from 'react-native-vector-icons/Feather'

interface IProps {
  onPress: () => any
  name: string
  size: number
  color: string
  style?: any

}
export default class FeatherButton extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <TouchableOpacity
        style={{ ...style.cameraButton, ...(this.props.style || null) }}
        onPress={() => this.props.onPress()}
      >
        <Feather
          name={this.props.name}
          size={this.props.size}
          color={this.props.color}
        />
      </TouchableOpacity>
    )
  }
}

const style = {
  cameraButton: {
    justifyContent: 'center' as 'center',
    alignItems: 'center' as  'center',
    height: '100%',
    width: 100,
    display: 'flex' as 'flex',
  },
}
