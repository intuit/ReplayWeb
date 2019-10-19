import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Table, Input, Icon } from 'antd'
import builtInCommands from '../../common/commands'

const CommandDoc = props => {
  const [searchText, setSearchText] = useState('')
  const allCommands = builtInCommands.slice()
  Object.values(props.commandPlugins).forEach((plugin) => {
    allCommands.push(plugin.meta)
  })
  const availableCommands = allCommands.sort((a, b) => {
    if (a.name.toLowerCase() === b.name.toLowerCase()) {
      return 0
    } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1
    } else {
      return -1
    }
  })

  const columns = [
    { title: 'Cmd', dataIndex: 'name', key: 'name', width: 140 },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Comment', dataIndex: 'comment', key: 'comment', width: 140 }
  ]

  const addOn = (
    <Icon
      type="close"
      style={{ cursor: 'pointer' }}
      onClick={() => setSearchText('')}
    />
  )

  return (
    <div>
      <div className="custom-searchBox">
        <Input
          className="input-search"
          placeholder="Search Command"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 180 }}
          addonAfter={addOn}
        />
      </div>
      <Table
        dataSource={availableCommands.filter(e =>
          e.name.toLowerCase().includes(searchText)
        )}
        pagination={false}
        columns={columns}
        bordered
        size="small"
      />
    </div>
  )
}

CommandDoc.propTypes = {
  commandPlugins: PropTypes.object.isRequired
}

export default CommandDoc
