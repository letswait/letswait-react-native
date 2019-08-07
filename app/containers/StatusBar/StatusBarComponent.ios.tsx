import React from 'react'
import { StatusBar, View } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'

interface IProps {
  color: string
  theme: 'dark-content' | 'light-content' | 'default'
}
export default class ConnectedStatusBar extends React.Component<IProps,{}> {
  public render() {
    if(this.props.color) {
      const style = {
        height: isIphoneX ? 44 : 20,
        width: '100%',
        top: 0,
        backgroundColor: this.props.color,
      }
      return (
        <View style={style}>
          <StatusBar barStyle={this.props.theme}/>
        </View>
      )
    }
    return (
      <StatusBar barStyle={this.props.theme}/>
    )
  }
}
