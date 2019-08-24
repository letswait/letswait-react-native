import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import FeedComponent from './FeedComponent'

import { revealSpinner } from '../../../actions/navigation/modal'

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    currentRoute: state.router.location.pathname,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  revealSpinner: (spinner: any) => dispatch(revealSpinner(spinner)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FeedComponent)
