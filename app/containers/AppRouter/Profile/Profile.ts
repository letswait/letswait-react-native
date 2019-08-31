import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import ProfileComponent from './ProfileComponent'

import { changeSearchSettings } from '../../../actions/profile/searchSettings'

import { showToast } from '../../../actions/navigation';

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    currentRoute: state.router.location.pathname,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  changeSearchSettings: (changes: any) => dispatch(changeSearchSettings(changes)),
  showToast: (text: string) => dispatch(showToast(text, () => console.log(text))),
})

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(ProfileComponent)
