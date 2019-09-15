import React, { Children } from 'react'
import {
  Text,
  TouchableOpacity,
} from 'react-native'

import Feather from 'react-native-vector-icons/Feather'
import { colors, type } from '../../../new_foundation'

interface IProps {
  onPress: () => any
  children?: any
}
export default class BackButton extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <TouchableOpacity onPress={() => this.props.onPress()} style={style.container}>
        <Feather name="chevron-left" size={24} color={colors.white}/>
        <Text style={style.label}>
          {this.props.children || 'Back'}
        </Text>
      </TouchableOpacity>
    )
  }
}

const style = {
  container: {
    flexDirection: 'row' as 'row',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as  'center',
  },
  label: {
    ...type.regular,
    textAlign: 'left' as 'left',
    color: colors.white,
  },
}
