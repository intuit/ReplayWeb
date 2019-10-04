import React from 'react'
import PropTypes from 'prop-types'
import { Button, Select, Tabs } from 'antd'

class DashboardBottom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      logFilter: 'All',
      activeTabForLogScreenshot: 'Logs'
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.logs.length !== this.props.logs.length) {
      const $logContent = document.querySelector(
        '.logs-screenshots .ant-tabs-content'
      )
      const itemHeight = 50

      if (!$logContent) return

      // Note: set scroll top to a number large enough so that it will scroll to bottom
      // setTimeout 100ms to ensure content has been rendered before scroll
      setTimeout(() => {
        $logContent.scrollTop = itemHeight * nextProps.logs.length * 2
      }, 100)
    }
  }

  render() {
    const { logFilter, activeTabForLogScreenshot } = this.state
    const filters = {
      All: () => true,
      Info: item => item.type === 'info',
      Error: item => item.type === 'error'
    }
    const logs = this.props.logs.filter(filters[logFilter])

    return (
      <div className="logs-screenshots">
        <Tabs
          type="card"
          onChange={key => this.setState({ activeTabForLogScreenshot: key })}
        >
          <Tabs.TabPane tab="Logs" key="Logs">
            <ul className="log-content">
              {logs.map((log, i) => (
                <li className={log.type} key={i}>
                  <span className="log-type">[{log.type}]</span>
                  <pre className="log-detail">{log.text}</pre>
                </li>
              ))}
            </ul>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Screenshots" key="Screenshots">
            <ul className="screenshot-content">
              {this.props.screenshots.map((ss, i) => (
                <li key={ss.url}>
                  <span className="timestamp">
                    {ss.createTime.toLocaleString()} -{' '}
                    <span className="filename">
                      {decodeURIComponent(ss.name)}
                    </span>
                  </span>
                  <a download={decodeURIComponent(ss.name)} href={ss.url}>
                    <img src={ss.url} />
                  </a>
                </li>
              ))}
            </ul>
          </Tabs.TabPane>
        </Tabs>

        <div className="ls-toolbox">
          {activeTabForLogScreenshot === 'Logs' ? (
            <div>
              <Select
                value={logFilter}
                onChange={value => this.setState({ logFilter: value })}
                style={{ width: '70px', marginRight: '10px' }}
                size="small"
              >
                <Select.Option value="All">All</Select.Option>
                <Select.Option value="Info">Info</Select.Option>
                <Select.Option value="Error">Error</Select.Option>
              </Select>

              <Button size="small" onClick={this.props.clearLogs}>
                Clear
              </Button>
            </div>
          ) : (
            <Button size="small" onClick={this.props.clearScreenshots}>
              Clear
            </Button>
          )}
        </div>
      </div>
    )
  }
}

DashboardBottom.propTypes = {
  logs: PropTypes.array.isRequired,
  screenshots: PropTypes.array.isRequired,
  clearLogs: PropTypes.func.isRequired,
  clearScreenshots: PropTypes.func.isRequired
}

export default DashboardBottom
