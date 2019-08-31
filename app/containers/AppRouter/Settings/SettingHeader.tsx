import React from 'react'
import {
  Text,
  View,
} from 'react-native'

interface IProps {
  heading: string,
  subheading?: string,
}
export default class SettingHeader extends React.PureComponent<IProps> {
  public render() {
    return (
      <View style={style.headerWrapper}>
        <Text style={style.header}>{this.props.heading}</Text>
        <Text style={style.subheader}>{this.props.subheading || ''}</Text>
      </View>
    )
  }
}

const style = {
  headerWrapper: {
    margin: 8,
    marginBottom: 16,
    width: 'auto' as 'auto',
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'center' as 'center',
    alignItems: 'flex-end' as 'flex-end',
  },
  header: {
    flex: 0,
    lineHeight: 20,
    fontSize: 17,
    fontWeight: '500' as '500',
    color: '#A478DF',
  },
  subheader: {
    flex: 1,
    lineHeight: 16,
    fontSize: 14,
    fontWeight: '500' as '500',
    textAlign: 'right' as 'right',
    color: '#A478DF',
    opacity: 0.75,
  },
}
