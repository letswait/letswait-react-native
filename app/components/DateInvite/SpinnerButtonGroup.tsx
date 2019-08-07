import React from 'react'
import {
  View,
} from 'react-native'

import Feather from 'react-native-vector-icons/Feather'
import { colors, spacing, type } from '../../../foundation'

import SpinnerButton from './SpinnerButton'
import SpinnerButtonSmall from './SpinnerButtonSmall'

interface IProps {
  onDeny: () => any,
  onRespin: () => any,
  onAccept: () => any,
}
export default class SpinnerButtonGroup extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <View style={style.wrapper}>
        <SpinnerButton
          onPress={() => this.props.onDeny()}
          backgroundColor="rgb(210,44,60)"
          icon={'x'}
        />
        <View style={{ width: 32 }}/>
        <SpinnerButtonSmall
          onPress={() => this.props.onRespin()}
          backgroundColor={'rgb(74,144,226)'}
          icon={'refresh-cw'}
        />
        <View style={{ width: 32 }}/>
        <SpinnerButton
          onPress={() => this.props.onAccept()}
          backgroundColor={'rgb(63,143,27)'}
          icon={'check'}
        />
      </View>
    )
  }
}

const style = {
  wrapper: {
    flexDirection: 'row' as 'row',
    alignItems: 'flex-end' as 'flex-end',
  },
}
