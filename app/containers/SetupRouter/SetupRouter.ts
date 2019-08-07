import { goBack, push } from 'connected-react-router'
import { connect } from 'react-redux'
import { changeStatusBarTheme } from '../../actions/navigation/index'

import { ThunkDispatch } from 'redux-thunk'

import { previousRoute } from '../../actions/user/signup'

import SetupRouter from './SetupRouterComponent'

const mapStateToProps = (state: any) => {
  return {
    path: state.router.location.pathname,
    currentRoute: state.signup.currentRoute,
    routes: state.signup.routes,
    showProgressBar: state.signup.showProgressBar,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  previousRoute: () => dispatch(previousRoute()),
  changeThemeLight: () => dispatch(changeStatusBarTheme('light-content')),
})

export default connect(mapStateToProps, mapDispatchToProps)(SetupRouter)
