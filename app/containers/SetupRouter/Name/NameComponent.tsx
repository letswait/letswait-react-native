import React from 'react'
import {
  Text,
  View,
} from 'react-native'

import ActionButton from '../../../components/Buttons/ActionButton'

import { colors, spacing, type } from '../../../../foundation'

import Input from '../../../components/Inputs/Input'

import SetupWrapper from '../SetupWrapperComponent'

interface IProps {
  path: string
  currentRoute: number
  routes: string[]
  errorMessage?: string
  name?: string
  incrementRoute: () => any
  change: (changes: any) => any
  push: (route: string) => any
  updateProfile: () => any
}
interface IState {
  name: string,
  disabled: boolean
}
export default class NameComponent extends React.PureComponent<IProps, IState> {
  public state: IState = {
    name: this.props.name || '',
    disabled: this.props.name ? false : true,
  }
  public componentDidMount() {
    this.props.change({ name: undefined })
  }
  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if(JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      // Change in Props
      if(this.props.name && prevProps.name !== this.props.name) {
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
  private setName(name: string) {
    this.setState({
      name,
      disabled: (name.length === 0),
    })
  }
  public render() {
    return (
      <SetupWrapper>
        <Text style={style.title}>
          What is your name?
        </Text>
        <View style={style.contentWrapper}>
          <Input
            title="Name"
            icon="user"
            value={this.state.name}
            onChange={text => this.setName(text)}
            autoFocus
          />
        </View>
        <ActionButton
          onPress={() => this.props.change({ name: this.state.name })}
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
