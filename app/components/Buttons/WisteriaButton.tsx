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
      backgroundColor: '#B762C4',
      borderColor: colors.transparent,
      width: 253,
      shadowColor: '#5a2651',
      shadowOffset: { width: 0, height:1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
    },
    label: {
      color: colors.white,
    },
  },
}
