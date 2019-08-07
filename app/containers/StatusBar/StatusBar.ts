import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import StatusBar from './StatusBarComponent'

const mapStateToProps = (state: any) => {
  const bar = state.statusBar
  return {
    theme: bar.theme || 'default',
    color: bar.color || '',
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{},{},any>) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar)
