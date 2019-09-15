import React from 'react'
import BaseButton from './BaseButton'

import { colors } from '../../../new_foundation'

interface IProps {
  children: any
  onPress: () => any
  active?: boolean
  disabled?: boolean
}
export default class ToggleButton extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    const shouldForceMode = typeof this.props.disabled === 'boolean'
    const enabledStyle = shouldForceMode && this.props.disabled ?
      style.buttonDisabled : style.buttonDefault
    const disabledStyle = shouldForceMode && !this.props.disabled ?
      style.buttonDefault : style.buttonDisabled
    return (
      <BaseButton
        toggleable={true}
        onPress={() => this.props.onPress()}
        style={enabledStyle}
        disabledStyle={disabledStyle}
        disabled={!this.props.active || false}
      >
        {this.props.children}
      </BaseButton>
    )
  }
}

const style = {
  buttonDefault: {
    container: {
      backgroundColor: 'transparent',
      borderColor: colors.white,
      width: 253,
    },
    label: {
      color: colors.white,
    },
  },
  buttonDisabled: {
    container: {
      backgroundColor: 'transparent',
      borderColor: colors.cloud,
      width: 253,
    },
    label: {
      color: colors.white,
    },
  },
}
