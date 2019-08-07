import React from 'react'
import {
  View,
} from 'react-native'

import Feather from 'react-native-vector-icons/Feather'
import { colors, spacing, type } from '../../../foundation'

import MatchImage from './MatchImage'

interface IProps {
  sources: string[]
}
export default class Date extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <View style={style.wrapper}>
        <MatchImage source={this.props.sources[0]}/>
        <Feather
          name="plus"
          size={24}
          color={colors.lilac}
          style={style.icon}
        />
        <MatchImage source={this.props.sources[1]}/>
      </View>
    )
  }
}

const style = {
  wrapper: {
    flexDirection: 'row' as 'row',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as  'center',
  },
  icon: {
    margin: spacing.tiny,
  },
}
