import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import ProfileComponent from './ProfileComponent'

import { changeSearchSettings } from '../../../actions/profile/searchSettings'

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    currentRoute: state.router.location.pathname,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  changeSearchSettings: (changes: any) => dispatch(changeSearchSettings(changes)),
})

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(ProfileComponent)
