import { goBack, push } from 'connected-react-router'
import { connect } from 'react-redux'
import { changeStatusBarTheme, showToast } from '../../actions/navigation'

import { ThunkDispatch } from 'redux-thunk'

import { previousRoute } from '../../actions/user/signup'

import AppRouter from './AppRouterComponent'

import { getMatches, pushEnqueuedMatch } from '../../actions/matches'
import { dismissModal, ModalType, showModal } from '../../actions/navigation/modal'
import { pushChange } from '../../actions/user/settings'
import { ReduxStore } from '../../types/models';

const mapStateToProps = (state: any) => {
  return {
    currentRoute: state.router.location.pathname,
    // routeLocation: state.router.location,
    params: state.router.location.params,
    toast: state.toast,
    user: state.user,
    modal: state.modal,
    spinner: state.spinner,
    activeChat: state.activeChat,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  changeThemeLight: () => dispatch(changeStatusBarTheme('light-content')),
  push: (route: string) => dispatch(push(route)),
  dismissModal: () => dispatch(dismissModal()),
  pushChange: (change: ReduxStore.User) => dispatch(pushChange(change)),
  getMatches: () => dispatch(getMatches()),
  pushChatMatch: (match: any) => dispatch(pushEnqueuedMatch(match)),
  showToast: (message: string, action: Function, duration = 3000) =>
    dispatch(showToast(message, action, duration)),
  showModal: (modal: ModalType) => dispatch(showModal(modal)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter)
