import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

// import { fetchAuth } from 'Actions/user/auth'

import SplashScreen from './SplashComponent'

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({
  // authenticate: () => dispatch(fetchAuth())
})

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen)
