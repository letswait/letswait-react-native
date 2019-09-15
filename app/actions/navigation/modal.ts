import { DISMISS_MODAL, PUSH_SPINNER, SHOW_MODAL } from './index'

import { ThunkDispatch } from 'redux-thunk';

export type ModalType = 'spinner' | 'profile' | 'datepreview'
export const showModal = (modalType: ModalType) => ({
  modalType,
  type: SHOW_MODAL,
})

export const pushSpinner = (spinner: any) => ({
  spinner,
  type: PUSH_SPINNER,
})

export const dismissModal = () => ({
  type: DISMISS_MODAL,
})

export function revealSpinner(spinner: any) {
  return (dispatch: ThunkDispatch<{},{}, any>) => {
    dispatch(showModal('spinner'))
    dispatch(pushSpinner(spinner))
  }
}
