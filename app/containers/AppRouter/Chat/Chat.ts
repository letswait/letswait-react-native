import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import ChatComponent from './ChatComponent'

import { getMatches, openChat } from '../../../actions/matches';

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    match: state.activeChat,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatComponent)
