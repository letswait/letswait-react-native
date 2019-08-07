import { push } from 'connected-react-router'
import { connect } from 'react-redux'

import { ThunkDispatch } from 'redux-thunk'

import {
  incrementRoute,
  postChangeProfile,
  signupChange,
} from '../../../actions/user/signup'

import NameComponent from './NameComponent'

const mapStateToProps = (state: any) => {
  return {
    currentRoute: state.signup.currentRoute,
    routes: state.signup.routes,
    errorMessage: state.errorMessage,
    name: state.signup.name,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  incrementRoute: () => dispatch(incrementRoute()),
  change: (changes: any) => dispatch(signupChange(changes)),
  push: (route: string) => dispatch(push(route)),
  updateProfile: () => dispatch(postChangeProfile()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NameComponent)
