import React from 'react'
import {
  Text,
  View,
} from 'react-native'

import CodeInput from '../../../components/Inputs/CodeInput'

import ActionButton from '../../../components/Buttons/ActionButton'

import Feather from 'react-native-vector-icons/Feather'
import { colors, spacing, type } from '../../../../foundation'
import SetupWrapper from '../SetupWrapperComponent';

interface IProps {
  currentRoute: number
  routes: string[]
  errorMessage: string
  code: string
  sms: string
  incrementRoute: () => any
  change: (changes: any) => any
  push: (route: string) => any
  postCode: (sms: string, code: string) => any
}
interface IState {
  code: string,
  disabled: boolean
}
export default class CodeConfirmationComponent extends React.PureComponent<IProps, IState> {
  public state: IState = {
    code: '',
    disabled: true,
  }
  public componentDidMount() {
    this.props.change({ code: undefined })
  }
  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if(JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      // If there is profile data to update, push to that route.
      if(prevProps.routes.length === 0 && this.props.routes.length) {
        this.props.push(this.props.routes[this.props.currentRoute])
      }
    }
  }
  private setCode(code: string) {
    this.setState({ code, disabled: code.length !== 4 })
  }
  private clear() {
    this.setState({ code: '', disabled: true })
  }
  public render() {
    return (
      <SetupWrapper>
        <Text style={style.title}>
          Confirm SMS
        </Text>
        <View style={style.contentWrapper}>
          <CodeInput
            onComplete={code => this.setCode(code)}
            onClear={() => this.clear()}
          />
        </View>
        <ActionButton
          onPress={() => this.props.postCode(this.props.sms, this.state.code)}
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
