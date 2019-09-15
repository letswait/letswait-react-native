import React from 'react'
import BaseButton, { IButtonStyle } from './BaseButton'

import { colors } from '../../../new_foundation'
import { ObjectOf } from '../../types/helpers'

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
      color: colors.seafoam,
    },
  },
  disabled: {
    container: {
      margin: 16,
      borderColor: colors.cloud,
    },
    label: {
      color: colors.cloud,
    },
  },
}
