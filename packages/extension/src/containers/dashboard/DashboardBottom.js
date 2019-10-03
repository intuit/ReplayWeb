import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators }  from 'redux'
import * as actions from '../../actions'
import DashboardBottom from '../../components/dashboard/DashboardBottom'

const mapStateToProps = (state) => {
  return {
    status: state.app.status,
    logs: state.app.logs,
    screenshots: state.app.screenshots
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}
export default connect(
  mapStateToProps,
  dispatch => bindActionCreators({...actions}, dispatch)
)(DashboardBottom)
