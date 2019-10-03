import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Icon, Table, Input } from 'antd'

class AddFolder extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      path: '~',
      loading: false
    }
  }

  componentDidMount () {
    this.props.listDirectory(this.state.path)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      loading: false
    })
  }

  changeFolder (folder) {
    this.setState({
      loading: true
    })
    this.props.listDirectory(folder)
  }

  render () {
    const columns = [
      {
        title: this.props.folder,
        dataIndex: 'name',
        render: (text, record) => {
          if (record.isDirectory) {
            const directoryStyle = {
              cursor: 'pointer',
              color: '#1890ff',
              display: 'flex',
              justifyContent: 'space-between',
              'align-items': 'center'
            }
            return <span style={directoryStyle} key={record.name}><div>{record.name}</div><Icon type='right'/></span>
          } else {
            return <span key={record.name}>{record.name}</span>
          }
        }
      }
    ]

    // if we're in a subdirectory, add an up button so they can go up a folder
    const datasource = this.props.top ? this.props.contents
      : [
        {
          name: <span><Icon type='arrow-up'/>Up</span>,
          fullpath: this.props.folder.split('/').slice(0, this.props.folder.split('/').length - 1).join('/') || '~',
          isDirectory: true
        }
      ].concat(this.props.contents)

    return (
      <Modal
        title='Choose Folder'
        visible={this.props.visible}
        onCancel={this.props.closeModal}
        onOk={this.props.selectFolder}
        okText='Select'>
        <Input.Group compact style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <Input
            addonBefore='Jump To'
            onChange={(e) => this.setState({ path: e.target.value })}
            onKeyDown={e => e.key === 'Enter' ? this.changeFolder(this.state.path) : undefined}
            value={this.state.path}
          />
          <Button onClick={() => this.changeFolder(this.state.path)}><Icon type="arrow-right"/></Button>
        </Input.Group>
        <Table
          loading={this.state.loading}
          dataSource={datasource}
          columns={columns}
          pagination={false}
          size='small'
          onRow={record => ({
            onClick: () => record.isDirectory ? this.changeFolder(record.fullpath) : () => {}
          })}
        />
      </Modal>
    )
  }
}

AddFolder.propTypes = {
  listDirectory: PropTypes.func.isRequired,
  top: PropTypes.bool,
  folder: PropTypes.string.isRequired,
  contents: PropTypes.array.isRequired,
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  selectFolder: PropTypes.func.isRequired
}

export default AddFolder
