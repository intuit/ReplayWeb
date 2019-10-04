import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Checkbox } from 'antd'

import '../../styles/dashboard.scss'
import * as actions from '../../actions'

import DashboardEditor from './DashboardEditor'
import DashboardBottom from './DashboardBottom'
import C from '../../config'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isChecked: true
    }
    this.toggleChange = this.toggleChange.bind(this)
  }

  toggleChange() {
    this.setState({
      isChecked: !this.state.isChecked
    })
  }

  render() {
    const viewLog = this.state.isChecked ? <DashboardBottom /> : null
    return (
      <div className="dashboard">
        <DashboardEditor />
        <div>
          <Checkbox checked={this.state.isChecked} onChange={this.toggleChange}>
            Show Log
          </Checkbox>
          {viewLog}
        </div>
        <div className="online-help">
          <a href={C.urlHomePage} target="_blank">
            Documentation
          </a>
          <span> - </span>
          <a href={C.urlReleases} target="_blank">
            Release Notes
          </a>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({}),
  dispatch => bindActionCreators({ ...actions }, dispatch)
)(Dashboard)
