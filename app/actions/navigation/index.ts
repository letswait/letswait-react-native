export const CHANGE_STATUS_BAR_COLOR = 'CHANGE_STATUS_BAR_COLOR'
export const CHANGE_STATUS_BAR_THEME = 'CHANGE_STATUS_BAR_THEME'
export const CHANGE_STATUS_BAR = 'CHANGE_STATUS_BAR'

export const CHANGE_TOAST = 'CHANGE_TOAST'

export type IStatusBarTheme = 'dark-content' | 'light-content' | 'default'

export const SHOW_MODAL = 'SHOW_MODAL'
export const DISMISS_MODAL = 'DISMISS_MODAL'
export const PUSH_SPINNER = 'PUSH_SPINNER'

export const IS_LOADING = 'IS_LOADING'
export const TOGGLE_LOADING = 'TOGGLE_LOADING'
export const NOT_LOADING = 'NOT_LOADING'

export const changeStatusBarColor = (color: string = '') => ({
  color,
  type: CHANGE_STATUS_BAR_COLOR,
})
export const changeStatusBarTheme = (theme: IStatusBarTheme = 'default') => ({
  theme,
  type: CHANGE_STATUS_BAR_THEME,
})
export const changeStatusBar = (color: string = '', theme: IStatusBarTheme = 'default') => ({
  color,
  theme,
  type: CHANGE_STATUS_BAR,
})

export const showToast = (message: string, action: Function, duration = 1600) => ({
  message,
  action,
  duration,
  type: CHANGE_TOAST,
})

export const toggleLoading = () => ({
  type: TOGGLE_LOADING,
})

export const startLoading = () => ({
  type: IS_LOADING,
})

export const stopLoading = () => ({
  type: NOT_LOADING,
})
