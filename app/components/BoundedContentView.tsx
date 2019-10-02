import * as React from 'react'
import {
  View,
} from 'react-native'

interface IProps {
  style?: any
}
export default class BoundedContentView extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <View style={Object.assign({},style,this.props.style)}>
        {this.props.children}
      </View>
    )
  }
}

const style = {
  backgroundColor: 'white',
  borderRadius: 8,
  overflow: 'hidden' as 'hidden',
  margin: 12,
  marginBottom: 0,
  flex: 1,
  flexDirection: 'column' as 'column',
  alignItems: 'center' as 'center',
}
