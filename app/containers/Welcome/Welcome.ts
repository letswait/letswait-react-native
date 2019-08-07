import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { changeStatusBarTheme } from '../../actions/navigation/index'

import { authDevice, populateSignupRoutes, populateUser } from '../../actions/user/auth'

import WelcomeScreen from './WelcomeComponent'

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  push: (route: string, state?: any) => dispatch(push(route, state)),
  changeThemeDark: () => dispatch(changeStatusBarTheme('dark-content')),
  populateUser: (user: any) => dispatch(populateUser(user)),
  auth: () => dispatch(authDevice(true)),
  populateSignupRoutes: (routes: string[]) => dispatch(populateSignupRoutes(routes)),
})

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen)
