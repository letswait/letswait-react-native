import { push } from 'connected-react-router'
import { connect } from 'react-redux'

import { ThunkDispatch } from 'redux-thunk'

import PhotosComponent from './PhotosComponent'

import {
  incrementRoute,
  postChangeProfile,
  signupChange,
} from '../../../actions/user/signup'

const mapStateToProps = (state: any) => {
  return {
    currentRoute: state.signup.currentRoute,
    routes: state.signup.routes,
    errorMessage: state.errorMessage,
    photos: state.signup.photos,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  incrementRoute: () => dispatch(incrementRoute()),
  change: (changes: any) => dispatch(signupChange(changes)),
  push: (route: string) => dispatch(push(route)),
  updateProfile: () => dispatch(postChangeProfile()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PhotosComponent)
