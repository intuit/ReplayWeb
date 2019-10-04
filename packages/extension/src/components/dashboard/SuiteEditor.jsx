import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button } from 'antd'

const { Column } = Table

class SuiteEditor extends React.Component {
  render() {
    const unusedTests =
      this.props.tests &&
      this.props.tests.filter(t => !this.props.selectedTests.includes(t.name))
    const selectedTests =
      this.props.selectedTests &&
      this.props.selectedTests.map((t, i) => ({ name: t, key: i }))
    return (
      <div className="suiteContainer">
        <Table bordered dataSource={unusedTests} pagination={false}>
          <Column
            title="All Tests"
            dataIndex="name"
            render={(text, record, index) => {
              return (
                <div className="suiteRow">
                  <span>{record.name}</span>
                  <span>{record.data.commands.length} commands</span>
                  <Button
                    onClick={this.props.addTestToSuite.bind(null, record.name)}
                    icon="right"
                  />
                </div>
              )
            }}
          />
        </Table>
        <Table bordered dataSource={selectedTests} pagination={false}>
          <Column
            title={`Tests in suite: ${this.props.name}` || 'New Suite'}
            dataIndex="name"
            render={(text, record, index) => {
              return (
                <div className="suiteRow">
                  <span>{record.name}</span>
                  <Button
                    onClick={this.props.removeTestFromSuite.bind(
                      null,
                      record.name
                    )}
                    type="danger"
                    icon="delete"
                  />
                </div>
              )
            }}
          />
        </Table>
      </div>
    )
  }
}

SuiteEditor.propTypes = {
  tests: PropTypes.array.isRequired,
  selectedTests: PropTypes.array.isRequired,
  addTestToSuite: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  removeTestFromSuite: PropTypes.func.isRequired
}

export default SuiteEditor
