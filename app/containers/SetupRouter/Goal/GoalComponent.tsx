import React from 'react'
import {
  Text,
  View,
} from 'react-native'

import ActionButton from '../../../components/Buttons/ActionButton'

import { colors, type } from '../../../../new_foundation'

import ToggleButton from '../../../components/Buttons/ToggleButton'
import Input from '../../../components/Inputs/Input'

import SetupWrapper from '../SetupWrapperComponent'

import { Goal } from '../../../types/helpers.d'

interface IProps {
  path: string
  currentRoute: number
  routes: string[]
  errorMessage?: string
  goal?: Goal
  incrementRoute: () => any
  change: (changes: any) => any
  push: (route: string) => any
  updateProfile: () => any
}
interface IState {
  goal?: Goal,
  disabled: boolean
}
export default class GoalComponent extends React.PureComponent<IProps, IState> {
  public state: IState = {
    goal: this.props.goal || undefined,
    disabled: !this.props.goal,
  }
  public componentDidMount() {
    this.props.change({ goal: undefined })
  }
  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if(JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      // Change in Props
      if(this.props.goal && prevProps.goal !== this.props.goal) {
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
  private setGoal(goal: Goal) {
    this.setState({
      goal,
      disabled: !goal,
    })
  }
  public render() {
    return (
      <SetupWrapper>
        <Text style={style.title}>
          What are you looking for?
        </Text>
        <View style={style.contentWrapper}>
          <ToggleButton
            active={this.state.goal === Goal.serious}
            onPress={() => this.setGoal(Goal.serious)}
          >
            Something serious
          </ToggleButton>
          <ToggleButton
            active={this.state.goal === Goal.exclusive}
            onPress={() => this.setGoal(Goal.exclusive)}
          >
            Something exclusive
          </ToggleButton>
          <ToggleButton
            active={this.state.goal === Goal.casual}
            onPress={() => this.setGoal(Goal.casual)}
          >
            Something casual
          </ToggleButton>
          <ToggleButton
            active={this.state.goal === Goal.unsure}
            onPress={() => this.setGoal(Goal.unsure)}
          >
            I'm not sure yet
          </ToggleButton>
        </View>
        <ActionButton
          onPress={() => this.props.change({ goal: this.state.goal })}
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
    ...type.title2,
    color: colors.white,
    marginTop: 40,
    marginBottom: 48,
  },
  contentWrapper: {
    flex: 1,
  },
}
