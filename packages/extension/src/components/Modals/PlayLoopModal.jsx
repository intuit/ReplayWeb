import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Form, Input, message } from 'antd'
import { getPlayer } from '../../common/player'

class PlayLoopModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loopsStart: 1,
      loopsEnd: 3
    }
  }

  onChange (e) {
    this.setState({
      [e.target.name]: parseInt(e.target.value, 10)
    })
  }

  onPlay () {
    const { loopsStart, loopsEnd } = this.state

    if (loopsStart <= 0) {
      return message.error('Start value must be no less than one', 1.5)
    }

    if (loopsEnd < loopsStart) {
      return message.error('Max value must be greater than start value', 1.5)
    }

    const player = getPlayer()
    const { commands } = this.props.editing
    const { src } = this.props.editing.meta
    const openTc = commands.find(tc => tc.command.toLowerCase() === 'open')
    this.props.playerPlay({
      loopsEnd,
      loopsStart,
      title: src && src.name && src.name.length ? src.name : 'Untitled',
      extra: {
        id: src && src.id
      },
      mode: player.C.MODE.LOOP,
      startIndex: 0,
      startUrl: (openTc && openTc.parameters) ? openTc.parameters.url : null,
      resources: this.props.editing.commands,
      postDelay: this.props.config.playCommandInterval * 1000
    })
    this.props.togglePlayLoopsModal(false)
  }

  onCancel () {
    this.props.togglePlayLoopsModal(false)
    this.setState({
      duplicateName: ''
    })
  }

  render () {
    return (
      <Modal
        title="How many loops to play?"
        okText="Play"
        cancelText="Cancel"
        className="play-loop-modal"
        visible={this.props.visible}
        onOk={this.onPlay}
        onCancel={this.onCancel}
      >
        <Row>
          <Col span={10}>
            <Form.Item label="Start value">
              <Input
                name='loopsStart'
                type="number"
                min="0"
                value={this.state.loopsStart}
                onKeyDown={e => { if (e.keyCode === 13) this.onClickPlayLoops() }}
                onChange={this.onChange}
              />
            </Form.Item>
          </Col>
          <Col span={10} offset={2}>
            <Form.Item label="Max">
              <Input
                name='loopsEnd'
                type="number"
                min="0"
                value={this.state.loopsEnd}
                onKeyDown={e => { if (e.keyCode === 13) this.onClickPlayLoops() }}
                onChange={this.onChange}
              />
            </Form.Item>
          </Col>
        </Row>

        <p>
          The value of the loop counter is available in ${'{'}!LOOP{'}'} variable
        </p>
      </Modal>
    )
  }
}

PlayLoopModal.propTypes = {
  playerPlay: PropTypes.func.isRequired,
  editing: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  togglePlayLoopsModal: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired
}

export default PlayLoopModal
