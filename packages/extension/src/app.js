import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dashboard from './containers/dashboard'
import Header from './containers/Header'
import Sidebar from './containers/Sidebar'
import 'antd/dist/antd.css'
import './styles/app.scss'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Layout } from 'antd'
import { readBlockShareConfig } from './actions/app'
import { connect } from 'react-redux'

export class App extends Component {
  render() {
    return (
      <Layout className="app">
        <Sidebar />
        <Layout.Content className="content">
          <Header />
          <Dashboard />
        </Layout.Content>
      </Layout>
    )
  }

  componentDidMount() {
    console.log('READING Block Share config from file system')
    this.props.readBlockShareConfig()
  }
}

App.propTypes = {
  readBlockShareConfig: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    readBlockShareConfig: () => dispatch(readBlockShareConfig())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DragDropContext(HTML5Backend)(App))
