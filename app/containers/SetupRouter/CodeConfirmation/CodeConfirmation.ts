import { push } from 'connected-react-router'
import { connect } from 'react-redux'

import { ThunkDispatch } from 'redux-thunk'

import CodeConfirmationComponent from './CodeConfirmationComponent'

import {
  incrementRoute,
  postCode,
  signupChange,
} from '../../../actions/user/signup'

const mapStateToProps = (state: any) => {
  return {
    currentRoute: state.signup.currentRoute,
    routes: state.signup.routes,
    errorMessage: state.errorMessage,
    code: state.signup.code,
    sms: state.signup.sms,
    postingCode: state.loading,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  incrementRoute: () => dispatch(incrementRoute()),
  change: (changes: any) => dispatch(signupChange(changes)),
  push: (route: string) => dispatch(push(route)),
  postCode: (sms: string, code: string) => dispatch(postCode(sms, code)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CodeConfirmationComponent)
