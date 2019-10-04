import React from 'react'
import { Modal, Button, Input, Menu, Alert } from 'antd'
import MenuItem from 'antd/lib/menu/MenuItem'
import { getGithubRepoFromBlockShareConfig } from '../../actions/utilities'

export default class NewBlockModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      importing: false,
      foundLinks: [],
      searchText: '',
      allLinks: {},
      repoContentsReadPending: true
    }
  }

  onCancel = i => {
    // TODO: where is this code?
    // changeModalState('newBlockModal', false)
  }

  readGithubReposIfNecessary = () => {
    if (
      !this.state.repoContentsReadPending ||
      this.props.blockShareConfigError
    ) {
      return
    }
    console.log('Sending request for block share repo')
    // const repo = getRepo(R.BLOCK_STORE)
    const repo = getGithubRepoFromBlockShareConfig(this.props.blockShareConfig)
    const index = {}
    repo.getContents('master', './index.json', true).then(resp => {
      const files = resp.data
      files.forEach(file => {
        if (file.indexOf('index.json') >= 0) return null
        const linkParts = file.split('/')
        const version = linkParts.pop().split('.')[0]
        const titleParts = linkParts.pop().split('.')
        index[file] = {
          path: file,
          isBlock: true,
          isBeta: file.indexOf('BETA') >= 0,
          version: version,
          name: titleParts[1],
          language: titleParts[2],
          id: titleParts[3] + '.' + titleParts[4]
        }
      })
      this.setState({ allLinks: index, repoContentsReadPending: false })
    })
  }

  importBlock = () => {
    const link = this.state.searchText
    this.setState({ importing: true })
    this.props
      .importBlock(this.state.allLinks[link])
      .then(this.props.closeModal)
      .then(() => this.setState({ importing: false }))
      .then(() => this._updateSearch(''))
  }

  selectedBlock = block => {
    this.setState({ searchText: block.key })
    this._updateSearch(block.key)
  }

  _updateSearch = text => {
    this.setState({ searchText: text })
    this.setState({
      foundLinks: Object.keys(this.state.allLinks)
        .map(function(link) {
          if (
            text.length > 0 &&
            link.toLowerCase().indexOf(text.toLowerCase()) >= 0
          )
            return <MenuItem key={link}>{link}</MenuItem>
        })
        .filter(el => Boolean(el))
    })
  }

  updateSearch = b => {
    this._updateSearch(b.target.value)
  }

  render() {
    this.readGithubReposIfNecessary()
    const footer = (
      <span>
        <Button onClick={this.props.closeModal}>Cancel</Button>
      </span>
    )

    const blockShareConfigError = () => {
      return (
        <Alert
          message={'Importing blocks from registry is disabled'}
          description={
            this.props.blockShareConfigErrorMessage +
            '- Please correct the error and reload extension'
          }
          type={'info'}
          closable={true}
        />
      )
    }

    return (
      <Modal
        title="Add Block"
        className="new-block-modal"
        visible={this.props.visible}
        onCancel={this.props.closeModal}
        footer={footer}
      >
        <div>
          <Button onClick={this.props.editNewBlock} block>
            Create a new block
          </Button>
          <br />
          <br />
          <div style={{ textAlign: 'center' }}>- OR -</div>
          <br />
          Import a block from the registry
          <Input.Search
            data-testid={'newBlockModal_importInputSearch'}
            disabled={
              this.state &&
              (this.state.importing || this.props.blockShareConfigError)
            }
            placeholder={'Link'}
            value={this.state.searchText}
            size="large"
            enterButton="Import"
            onSearch={this.importBlock}
            onChange={this.updateSearch}
          />
          <Menu onClick={this.selectedBlock}>{this.state.foundLinks}</Menu>
          {this.props.blockShareConfigError ? (
            blockShareConfigError()
          ) : (
            <span></span>
          )}
        </div>
      </Modal>
    )
  }
}
