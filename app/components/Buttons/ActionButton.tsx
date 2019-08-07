import React from 'react'
import BaseButton, { IButtonStyle } from './BaseButton'

interface IProps {
  children: any
  onPress: () => any
  disabled?: boolean
}
export default class ActionButton extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <BaseButton
        disabled={this.props.disabled}
        onPress={() => this.props.onPress()}
        style={style.enabled}
        disabledStyle={style.disabled}
      >
        {this.props.children}
      </BaseButton>
    )
  }
}

const style: ObjectOf<IButtonStyle> = {
  enabled: {
    container: {
      margin: 16,
    },
    label: {

    },
  },
  disabled: {
    container: {
      margin: 16,
      borderColor: 'rgba(255,255,255,0.4)',
    },
    label: {
      color: 'rgba(255,255,255,0.4)',
    },
  },
}
