import React from 'react'
import BaseButton from './BaseButton'

import { colors } from '../../../foundation'

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
      backgroundColor: '#C07DED',
      borderColor: colors.transparent,
      width: 253,
      borderRadius: 20,
    },
    label: {
      color: colors.white,
    },
  },
}
