import { ReduxStore } from 'app/types/models'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import FeedComponent from './FeedComponent'


import { acceptMatch, denyMatch, requestFeed } from '../../../actions/matches/feed'

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    currentRoute: state.router.location.pathname,
    prevFilters: state.matchedSearchPreferences,
    queue: state.feed,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  requestFeed: (searchSettings: ReduxStore.SearchSettings) => dispatch(requestFeed(searchSettings)),
  acceptMatch: (suitorId: ReduxStore.ObjectId) => dispatch(acceptMatch(suitorId)),
  denyMatch: (suitorId: ReduxStore.ObjectId) => dispatch(denyMatch(suitorId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FeedComponent)
