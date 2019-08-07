import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import SettingsComponent from './SettingsComponent'

import { clearUser } from '../../../actions/user/auth'

import { push } from 'connected-react-router'

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    currentRoute: state.router.location.pathname,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  clearUser: () => dispatch(clearUser()),
  push: (route: string) => dispatch(push(route)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsComponent)
