import React from 'react'
import { KeyboardAvoidingView } from 'react-native'

export default class SetupWrapper extends React.PureComponent {
  public render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={style.setupWrapper}
      >
       {this.props.children}
      </KeyboardAvoidingView>
    )
  }
}

const style = {
  setupWrapper: {
    flex: 1,
    alignItems: 'center' as 'center',
    flexDirection: 'column' as 'column',
    marginBottom: 24,
  },
}
