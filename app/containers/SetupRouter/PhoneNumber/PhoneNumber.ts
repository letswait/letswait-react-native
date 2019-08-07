import { push } from 'connected-react-router'
import { connect } from 'react-redux'

import { ThunkDispatch } from 'redux-thunk'

import PhoneNumberComponent from './PhoneNumberComponent'

import {
  incrementRoute,
  postSMS,
  signupChange,
} from '../../../actions/user/signup'

import {
  clearSMSValidation, fetchSMS,
} from '../../../actions/user'

const mapStateToProps = (state: any) => {
  return {
    currentRoute: state.signup.currentRoute,
    routes: state.signup.routes,
    errorMessage: state.errorMessage,
    sms: state.signup.sms,
    smsValid: state.smsValid,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  incrementRoute: () => dispatch(incrementRoute()),
  change: (changes: any) => dispatch(signupChange(changes)),
  push: (route: string) => dispatch(push(route)),
  postSMS: (sms: string) => dispatch(postSMS(sms)),
  clearSMS: () => dispatch(clearSMSValidation()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PhoneNumberComponent)
