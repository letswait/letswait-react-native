import { DISMISS_MODAL, PUSH_SPINNER, RESET_SPINNER, SHOW_MODAL } from './index'

import { ReduxStore, SocketReturnTypes } from 'app/types/models';
import { ThunkDispatch } from 'redux-thunk';

export type ModalType = 'spinner' | 'profile' | 'datepreview' | 'cheatsheet' | 'report'
export const showModal = (modalType: ModalType) => ({
  modalType,
  type: SHOW_MODAL,
})

export const resetSpinner = (user: any, candidate: ReduxStore.IMatchUser) => ({
  user,
  candidate,
  type: RESET_SPINNER,
})

export const pushSpinner = (spinner: SocketReturnTypes.SpinnerInfo) => ({
  spinner,
  type: PUSH_SPINNER,
})

export const dismissModal = () => ({
  type: DISMISS_MODAL,
})

// export function revealSpinner(spinner: any) {
//   return (dispatch: ThunkDispatch<{},{}, any>) => {
//     dispatch(showModal('spinner'))
//     dispatch(pushSpinner(spinner))
//   }
// }
