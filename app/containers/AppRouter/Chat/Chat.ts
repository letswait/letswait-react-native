import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import ChatComponent from './ChatComponent'

import { push } from 'connected-react-router'
import { getMatches } from '../../../actions/matches'
import { openChat, pushChat } from '../../../actions/matches/chat'
import { ReduxStore } from '../../../types/models'

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    match: state.activeChat,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  pushChat: (matchId: string, message: ReduxStore.IChat) => dispatch(pushChat(matchId, message)),
  push: (route: string) =>  dispatch(push(route)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatComponent)
