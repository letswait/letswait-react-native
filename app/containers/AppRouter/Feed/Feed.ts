import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import FeedComponent from './FeedComponent'

const mapStateToProps = (state: any) => {
  return {
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(FeedComponent)
