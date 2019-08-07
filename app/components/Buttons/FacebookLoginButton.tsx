import React from 'react'
import BaseButton from './BaseButton'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { colors, spacing, type } from '../../../foundation'

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
      backgroundColor: 'rgba(59,89,152,1)',
      borderColor: 'rgba(255,255,255,0)',
      width: 253,
      shadowColor: '#20335E',
      shadowOffset: { width: 0, height:1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
    },
    label: {
      color: colors.white,
    },
  },
}
