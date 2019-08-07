import React from 'react'
import {
  Text,
  View,
} from 'react-native'

import ActionButton from '../../../components/Buttons/ActionButton'

import { colors, spacing, type } from '../../../../foundation'

import ToggleButton from '../../../components/Buttons/ToggleButton'
import Input from '../../../components/Inputs/Input'

import SetupWrapper from '../SetupWrapperComponent'

interface IProps {
  path: string
  currentRoute: number
  routes: string[]
  errorMessage?: string
  sexualPreference?: string
  incrementRoute: () => any
  change: (changes: any) => any
  push: (route: string) => any
  updateProfile: () => any
}
interface IState {
  sexualPreference: string,
  disabled: boolean
}
export default class SexualPreferenceComponent extends React.PureComponent<IProps, IState> {
  public state: IState = {
    sexualPreference: this.props.sexualPreference || '',
    disabled: this.props.sexualPreference ? false : true,
  }
  public componentDidMount() {
    this.props.change({ sexualPreference: undefined })
  }
  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if(JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      // Change in Props
      if(
        this.props.sexualPreference &&
        prevProps.sexualPreference !== this.props.sexualPreference
      ) {
        this.props.incrementRoute()
      } else if(prevProps.currentRoute !== this.props.currentRoute) {
        if(this.props.currentRoute >= this.props.routes.length) {
          this.props.updateProfile()
        } else {
          this.props.push(this.props.routes[this.props.currentRoute])
        }
      }
    }
  }
  private setSexualPreference(sexualPreference: string) {
    this.setState({
      sexualPreference,
      disabled: (sexualPreference.length === 0),
    })
  }
  public render() {
    return (
      <SetupWrapper>
        <Text style={style.title}>
          Who are you interested in?
        </Text>
        <View style={style.contentWrapper}>
          <ToggleButton
            active={this.state.sexualPreference === 'Men'}
            onPress={() => this.setSexualPreference('Men')}
          >
            Men
          </ToggleButton>
          <ToggleButton
            active={this.state.sexualPreference === 'Women'}
            onPress={() => this.setSexualPreference('Women')}
          >
            Women
          </ToggleButton>
          <ToggleButton
            active={this.state.sexualPreference === 'Everyone'}
            onPress={() => this.setSexualPreference('Everyone')}
          >
            Everyone
          </ToggleButton>
        </View>
        <ActionButton
          onPress={() => this.props.change({ sexualPreference: this.state.sexualPreference })}
          disabled={this.state.disabled}
        >
          Next
        </ActionButton>
      </SetupWrapper>
    )
  }
}

const style = {
  title: {
    ...type.title3,
    color: colors.white,
    marginTop: spacing.small+spacing.base,
    marginBottom: spacing.large,
  },
  contentWrapper: {
    flex: 1,
  },
}
