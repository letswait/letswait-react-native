import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import SettingsComponent from './SettingsComponent'

import { clearUser } from '../../../actions/user/auth'

import { push } from 'connected-react-router'

import { showToast } from '../../../actions/navigation';

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    currentRoute: state.router.location.pathname,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  clearUser: () => dispatch(clearUser()),
  push: (route: string) => dispatch(push(route)),
  showToast: (text: string) => dispatch(showToast(text, () => console.log(text))),
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsComponent)
