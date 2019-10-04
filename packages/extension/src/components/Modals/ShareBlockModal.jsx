import React from 'react'
import { Modal, Input, Button, Alert } from 'antd'

export default class ShareBlockModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      willShare: false,
      shareLink: undefined
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ editing: nextProps.editing || {} })
  }

  onShare = () => {
    this.setState({ willShare: true })
    const resp = this.props.shareEditingBlock()
    resp.then(link => {
      this.setState({ willShare: false })
    })
  }

  onDuplicate = () => {
    this.props.closeModal()
    this.props.openDuplicate()
  }

  getImportedBlockParts = () => {
    const title = this.state.editing.meta.src
      ? "' " + this.state.editing.meta.src.name + " ' is an imported block"
      : 'Cannot share imported block'
    const aboveLinkText = (
      <span>
        This block was imported from this link
        <br />
        <br />
      </span>
    )
    const linkBox = (
      <Input addonBefore={'Link: '} value={this.state.editing.shareLink} />
    )
    const reshareText = (
      <span>
        <br />
        <br />
        You cannot reshare imported blocks. If you would like to publish the
        changes you&apos;ve made, duplicate this block and then share it
        <br />
        <br />
      </span>
    )
    const reshareButton = (
      <Button
        type="primary"
        size="large"
        onClick={this.onDuplicate}
        loading={this.state.willShare}
        data-testid={'shareBlockModal_duplicateButton'}
      >
        {'Duplicate Block'}
      </Button>
    )
    const footer = [
      <Button
        key="back"
        onClick={this.props.closeModal}
        data-testid={'shareBlockModal_shareBlockModal_okCancelButton'}
      >
        {this.state.editing.shareLink ? 'Ok' : 'Cancel'}
      </Button>
    ]
    return {
      title,
      aboveLinkText,
      linkBox,
      reshareText,
      reshareButton,
      footer
    }
  }

  getShareBlockParts = () => {
    const title = this.state.editing.meta.src
      ? "Share ' " + this.state.editing.meta.src.name + " '"
      : 'Share Block'
    const aboveLinkText = (
      <span>
        Sharing your blocks will make them publically available
        <br />
        <br />
      </span>
    )
    const linkBox = (
      <Button
        type="primary"
        size="large"
        onClick={this.onShare}
        loading={this.state.willShare}
        data-testid={'shareBlockModal_shareButton'}
      >
        {this.state.willShare ? 'Sharing...' : 'Share Block'}
      </Button>
    )
    const blockShareConfigError = (
      <Alert
        message={'Unable to share block'}
        description={
          this.props.blockShareConfigErrorMessage +
          '- Please correct the error and reload extension'
        }
        type={'error'}
        closable={false}
      />
    )
    const footer = [
      <Button
        key="back"
        onClick={this.props.closeModal}
        data-testid={'shareBlockModal_okCancelButton'}
      >
        {this.state.editing.shareLink ? 'Ok' : 'Cancel'}
      </Button>
    ]
    return {
      title,
      aboveLinkText,
      footer,
      ...(this.props.blockShareConfigError
        ? { linkBox: blockShareConfigError }
        : { linkBox: linkBox })
    }
  }

  getReShareBlockParts = () => {
    const title = this.state.editing.meta.src
      ? "Shared ' " + this.state.editing.meta.src.name + " '"
      : 'Reshare Block'
    const aboveLinkText = (
      <span>
        Sharing your blocks will make them publically available
        <br />
        <br />
      </span>
    )
    const linkBox = (
      <Input addonBefore={'Link: '} value={this.state.editing.shareLink} />
    )
    const reshareText = (
      <span>
        <br />
        <br />
        Reshare this block? Resharing will publish a new version of this block.
        You will still be able to download older versions.
        <br />
        <br />
      </span>
    )
    const reshareButton = (
      <Button
        type="primary"
        size="large"
        onClick={this.onShare}
        loading={this.state.willShare}
        data-testid={'shareBlockModal_reshareButton'}
      >
        {this.state.willShare ? 'Sharing...' : 'Reshare Block'}
      </Button>
    )
    const footer = [
      <Button
        key="back"
        onClick={this.props.closeModal}
        data-testid={'shareBlockModal_okCancelButton'}
      >
        {this.state.editing.shareLink ? 'Ok' : 'Cancel'}
      </Button>
    ]
    const blockShareConfigError = (
      <Alert
        message={'Unable to re-share block'}
        description={
          this.props.blockShareConfigErrorMessage +
          '- Please correct the error and reload extension'
        }
        type={'error'}
        closable={false}
      />
    )
    return {
      title,
      aboveLinkText,
      footer,
      ...(this.props.blockShareConfigError ? {} : { reshareText: reshareText }),
      ...(this.props.blockShareConfigError
        ? {}
        : { reshareButton: reshareButton }),
      ...(this.props.blockShareConfigError
        ? { linkBox: blockShareConfigError }
        : { linkBox: linkBox })
    }
  }

  render() {
    if (!this.state || !this.state.editing) return <span></span>

    let parts
    const isImported = this.state.editing.isImported
    if (this.state.editing.shareLink && isImported) {
      parts = this.getImportedBlockParts()
    } else if (this.state.editing.shareLink) {
      parts = this.getReShareBlockParts()
    } else {
      parts = this.getShareBlockParts()
    }
    return (
      <Modal
        title={parts.title || 'Share'}
        visible={this.props.visible}
        className="share-block-modal"
        onCancel={this.props.closeModal}
        footer={parts.footer || []}
      >
        {parts.aboveLinkText || <span></span>}
        {parts.linkBox || <span></span>}
        {parts.reshareText || <span></span>}
        {parts.reshareButton || <span></span>}
      </Modal>
    )
  }
}
