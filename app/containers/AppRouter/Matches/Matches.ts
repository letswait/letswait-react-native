import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import MatchesComponent from './MatchesComponent'

import { getMatches, previewDate } from '../../../actions/matches'
import { openChat } from '../../../actions/matches/chat'
import { ReduxStore } from '../../../types/models'

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    currentRoute: state.router.location.pathname,
    enqueuedMatches: state.enqueuedMatches,
    uninitializedMatches: state.uninitializedMatches,
    chatMatches: state.chatMatches,
    message: state.matchMessage,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  getMatches: () => dispatch(getMatches()),
  openChat: (matchId: string) => dispatch(openChat(matchId)),
  previewDate: (match: ReduxStore.Match) => dispatch(previewDate(match)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MatchesComponent)
