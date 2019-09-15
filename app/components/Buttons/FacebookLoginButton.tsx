import React from 'react'
import BaseButton from './BaseButton'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { colors } from '../../../new_foundation'

interface IProps {
  onPress: () => any
}
export default class FacebookLoginButton extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <BaseButton onPress={() => this.props.onPress()} style={style.buttonDefault}>
        <FontAwesome name="facebook-square" color={colors.white} size={26}/>
        &nbsp; Login with Facebook
      </BaseButton>
    )
  }
}

const style = {
  buttonDefault: {
    container: {
      backgroundColor: colors.facebookBlue,
      // border reset
      borderColor: 'transparent',
      width: 253,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height:1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
    },
    label: {
      color: colors.white,
    },
  },
}
