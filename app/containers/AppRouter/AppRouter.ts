import { goBack, push } from 'connected-react-router'
import { connect } from 'react-redux'
import { changeStatusBarTheme, showToast } from '../../actions/navigation'

import { ThunkDispatch } from 'redux-thunk'

import { previousRoute } from '../../actions/user/signup'

import AppRouter from './AppRouterComponent'

const mapStateToProps = (state: any) => {
  return {
    currentRoute: state.router.location.pathname,
    params: state.router.location.params,
    toast: state.toast,
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  changeThemeLight: () => dispatch(changeStatusBarTheme('light-content')),
  push: (route: string) => dispatch(push(route)),
  showToast: (message: string, action: Function, duration = 3000) =>
    dispatch(showToast(message, action, duration)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter)
