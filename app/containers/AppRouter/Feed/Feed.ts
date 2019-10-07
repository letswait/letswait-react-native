import { ReduxStore } from 'app/types/models'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import FeedComponent from './FeedComponent'

import { revealSpinner } from '../../../actions/navigation/modal'

import { acceptMatch, denyMatch } from '../../../actions/matches/feed'

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    currentRoute: state.router.location.pathname,
    // prevFilters: state.matchedSearchPreferences,
    // nextFilters: state.searchPreferences,
    queue: state.feed,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  revealSpinner: (spinner: any) => dispatch(revealSpinner(spinner)),
  acceptMatch: (suitorId: ReduxStore.ObjectId) => dispatch(acceptMatch(suitorId)),
  denyMatch: (suitorId: ReduxStore.ObjectId) => dispatch(denyMatch(suitorId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FeedComponent)
