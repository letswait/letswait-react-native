import React from 'react'
import {
  Text,
  View,
} from 'react-native'
import { colors } from '../../../../new_foundation';

export default class SettingGroup extends React.PureComponent<{},{}> {
  public render() {
    return (
      <View style={style.groupWrapper}>
        {this.props.children}
      </View>
    )
  }
}

const style = {
  groupWrapper: {
    width: '100%',
    padding: 40,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'flex-start' as 'flex-start',
    backgroundColor: colors.capri,
  },
}
