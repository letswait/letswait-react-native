import React from 'react'
import {
  TouchableOpacity,
} from 'react-native'

import Feather from 'react-native-vector-icons/Feather'
import { colors, spacing, type } from '../../../foundation'

interface IProps {
  onPress: () => any
  backgroundColor: string,
  icon: string
}
export default class SpinnerButton extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <TouchableOpacity
        style={{
          ...style.container,
          backgroundColor: this.props.backgroundColor,
        }}
        onPress={() => this.props.onPress()}
      >
        <Feather
          name={this.props.icon}
          size={32}
          color={colors.white}
        />
      </TouchableOpacity>
    )
  }
}

const style = {
  container: {
    width: 60,
    height: 60,
    borderRadius: 60/2,
    overflow: 'hidden' as  'hidden',
    justifyContent: 'center' as  'center',
    alignItems: 'center' as  'center',
  },
}
