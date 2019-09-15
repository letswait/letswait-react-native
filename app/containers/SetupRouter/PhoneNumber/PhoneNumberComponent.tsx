import React from 'react'
import {
  KeyboardAvoidingView,
  Text,
  View,
} from 'react-native'

import ActionButton from '../../../components/Buttons/ActionButton'
import PhoneInput from '../../../components/Inputs/PhoneInput'

import { colors, type } from '../../../../new_foundation'
import SetupWrapper from '../SetupWrapperComponent';

interface IProps {
  path: string
  currentRoute: number
  routes: string[]
  errorMessage?: string
  sms?: string
  smsValid: boolean
  incrementRoute: () => any
  change: (changes: any) => any
  push: (route: string) => any
  postSMS: (sms: string) => any
  clearSMS: () => any
}
interface IState {
  sms: string
  disabled: boolean
}
export default class PhoneNumberComponent extends React.PureComponent<IProps, IState> {
  public state: IState = {
    sms: this.props.sms || '',
    disabled: this.props.sms && this.props.smsValid ? false : true,
  }
  public componentDidMount() {
    this.props.change({ sms: undefined })
  }
  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if(JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      // Change in Props
      if(this.props.sms && prevProps.sms !== this.props.sms) {
        this.props.push('/setup/code')
      } else if(
        this.state.sms &&
        this.state.sms.length
      ) {
        this.setState({ disabled: false })
      }
    }
  }
  private validateSMS(sms: string) {
    this.setState({ sms, disabled: false })
  }
  private invalidateSMS() {
    this.props.clearSMS()
    this.setState({ disabled: true, sms: '' })
  }
  public render() {
    return (
      <SetupWrapper>
        <Text
          style={style.title}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          Enter your phone number to login
        </Text>
        <View style={style.contentWrapper}>
          <PhoneInput
            value={this.state.sms}
            onValid={(sms: string) => this.validateSMS(sms)}
            onInvalid={() => this.invalidateSMS()}
          />
        </View>
        <ActionButton
          onPress={() => this.props.postSMS(this.state.sms)}
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
    maxWidth: 300,
  },
  contentWrapper: {
    flex: 1,
  },
}
