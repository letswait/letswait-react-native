import React from 'react'
import {
  Text,
  View,
} from 'react-native'

interface IProps {
  title: string
}
export default class SettingGroup extends React.PureComponent<IProps> {
  public render() {
    return (
      <View style={style.groupWrapper}>
        <Text style={style.groupTitle}>{this.props.title}</Text>
        {this.props.children}
      </View>
    )
  }
}

const style = {
  groupWrapper: {
    width: '100%',
    marginBottom: 48,
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'flex-start' as 'flex-start',
  },
  groupTitle: {
    width: '100%',
    marginBottom: 12,
    marginLeft: 8,
    lineHeight: 25,
    fontSize: 21,
    fontWeight: '700' as '700',
    opacity: 0.65,
    color: '#A478DF',
  },
}
