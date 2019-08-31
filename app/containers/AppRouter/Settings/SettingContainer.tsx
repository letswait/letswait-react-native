import React from 'react'
import {
  LayoutRectangle,
  View,
} from 'react-native'

interface IProps {
  layout?: (layout: LayoutRectangle) => void,
}
export default class SettingsContainer extends React.PureComponent<IProps> {
  public render() {
    return (
      <View
        style={style}
        {...(this.props.layout ?
          { onLayout: event => this.props.layout!(event.nativeEvent.layout) } :
          (undefined as any)
        )}
      >
        {this.props.children}
      </View>
    )
  }
}

const style = {
  flex: 0,
  flexGrow: 0,
  borderRadius: 8,
  padding: 8,
  shadowRadius: 2.5,
  justifyContent: 'center' as 'center',
  alignItems: 'center' as 'center',
  backgroundColor: '#fff',
  shadowColor: '#A478DF',
  shadowOpacity: 0.16,
  shadowOffset: {
    width: 0,
    height: 1.5,
  },
  width: '100%',
  marginBottom: 16,
}
