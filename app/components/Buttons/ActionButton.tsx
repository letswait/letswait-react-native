import React from 'react'
import BaseButton, { IButtonStyle } from './BaseButton'

import { colors } from '../../../new_foundation'
import { ObjectOf } from '../../types/helpers'

import { ActivityIndicator } from 'react-native'

interface IProps {
  children: any
  onPress: () => any
  disabled?: boolean
  loading?: boolean
}
export default class ActionButton extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <BaseButton
        disabled={this.props.loading ? true : this.props.disabled}
        onPress={() => this.props.onPress()}
        style={{
          container: {
            margin: 16,
          },
          label: {
            color: colors.seafoam,
          },
        }}
        disabledStyle={{
          container: {
            margin: 16,
            borderColor: colors.cloud,
            color: this.props.loading ? colors.white : colors.transparentWhite,
          },
          label: {
            color: this.props.loading ? colors.seafoam : colors.cloud,
          },
        }}
      >
        {this.props.loading ? (
            <ActivityIndicator
              size="small"
              color={colors.shadow}
            />
          )  :
          this.props.children
        }
      </BaseButton>
    )
  }
}
