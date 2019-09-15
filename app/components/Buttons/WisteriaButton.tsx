import React from 'react'
import BaseButton from './BaseButton'

import { colors } from '../../../new_foundation'

interface IProps {
  children: any
  onPress: () => any
}
export default class WisteriaButton extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <BaseButton onPress={() => this.props.onPress()} style={style.buttonDefault}>
        {this.props.children}
      </BaseButton>
    )
  }
}

const style = {
  buttonDefault: {
    container: {
      backgroundColor: colors.lavender,
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
