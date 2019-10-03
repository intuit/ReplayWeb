import React from 'react'
import PropTypes from 'prop-types'
import { Menu, message, Tabs } from 'antd'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'

import { getPlayer } from '../../common/player'
import * as C from '../../common/constant'
import { newCommand } from '../../common/commands'

import CommandTable from '../../containers/dashboard/CommandTable'
import SuiteEditor from '../../containers/dashboard/SuiteEditor'

class DashboardEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeTabForCommands: 'table_view',
      sourceText: '',
      sourceTextModified: null,
      sourceErrMsg: null,
      contextMenu: {
        x: null,
        y: null,
        isShown: false
      }
    }
  }

  getTestCaseName () {
    const { src } = this.props.editing.meta
    return src && src.name && src.name.length ? src.name : 'Untitled'
  }

  editingToSourceText (editing) {
    const { commands, meta } = editing
    const { src } = meta
    const toConvert = {
      commands: commands.filter(c => !!c),
      name: src ? src.name : 'Untitled' }

    const text = JSON.stringify(toConvert, null, 2)

    return {
      sourceText: text,
      sourceTextModified: text,
      sourceErrMsg: null
    }
  }

  onDetailChange (key, value) {
    this.props.updateSelectedCommand({[key]: value})
  }

  onChangeCommandsView (type) {
    switch (type) {
      case 'table_view':
      case 'source_view': {
        const forceType = this.state.sourceErrMsg ? 'source_view' : type

        this.setState({
          activeTabForCommands: forceType
        })

        break
      }
    }
  }

  onSourceBlur () {
    try {
      const { sourceTextModified } = this.state
      const {name, commands} = JSON.parse(sourceTextModified)
      const obj = {name, data: {commands}}

      this.setState({
        sourceErrMsg: null
      })

      this.props.setEditing({
        ...obj.data,
        meta: this.props.editing.meta
      })
    } catch (e) {
      this.setState({
        sourceErrMsg: e.message
      })

      message.error('There are errors in the source')
      return false
    }
  }

  onChangeEditSource (editor, data, text) {
    this.setState({
      sourceTextModified: text
    })
  }

  componentDidMount () {
    this.bindContextMenuEvent()
  }

  componentWillReceiveProps (nextProps) {
    // Note: update sourceText whenever editing changed
    if (nextProps.editorStatus !== C.EDITOR_STATUS.SUITES && nextProps.editing !== this.props.editing) {
      this.setState(
        this.editingToSourceText(nextProps.editing)
      )
    }

    if (nextProps.status === C.APP_STATUS.PLAYER &&
        nextProps.player.nextCommandIndex !== this.props.player.nextCommandIndex) {
      const $tableBody = document.querySelector('.table-wrapper')
      const itemHeight = 45

      if (!$tableBody) return

      $tableBody.scrollTop = itemHeight * nextProps.player.nextCommandIndex
    }

    if (nextProps.status === C.APP_STATUS.RECORDER &&
        nextProps.editing.filterCommands.length > this.props.editing.filterCommands.length) {
      const $tableBody = document.querySelector('.table-wrapper')
      const itemHeight = 45

      if (!$tableBody) return

      setTimeout(
        () => { $tableBody.scrollTop = itemHeight * nextProps.editing.filterCommands.length * 2 },
        100
      )
    }
  }

  bindContextMenuEvent () {
    document.addEventListener('click', this.props.hideContextMenu)
  }

  renderContextMenu () {
    const { clipboard, searchText, selectedCmds } = this.props
    const { contextMenu } = this.props
    const dw = document.documentElement.clientWidth
    const mw = 240
    let x = contextMenu.x + window.scrollX
    let y = contextMenu.y + window.scrollY
    const inSearch = searchText !== ''
    const inSelection = selectedCmds.length !== 0

    if (x + mw > dw) x -= mw

    const style = {
      position: 'absolute',
      top: y,
      left: x,
      display: contextMenu.isShown ? 'block' : 'none'
    }

    const menuStyle = {
      width: mw + 'px'
    }

    const { commandIndex } = contextMenu
    const handleClick = (e) => {
      switch (e.key) {
        case 'cut':
          return this.props.cutCommand(commandIndex)
        case 'copy':
          return this.props.copyCommand(commandIndex)
        case 'paste':
          return this.props.pasteCommand(commandIndex)
        case 'insert':
          return this.props.insertCommand(newCommand, commandIndex + 1)
        case 'run_line': {
          const { filterCommands } = this.props.editing
          const { src } = this.props.editing.meta

          this.setState({ lastOperation: 'play' })

          return this.props.playerPlay({
            title: this.getTestCaseName(),
            extra: {
              id: src && src.id
            },
            mode: getPlayer().C.MODE.SINGLE,
            startIndex: commandIndex,
            startUrl: null,
            resources: filterCommands,
            postDelay: this.props.config.playCommandInterval * 1000,
            partial: true
          })
        }
        case 'run_from_here': {
          const { filterCommands } = this.props.editing
          const { src } = this.props.editing.meta

          this.setState({ lastOperation: 'play' })

          return this.props.playerPlay({
            title: this.getTestCaseName(),
            extra: {
              id: src && src.id
            },
            mode: getPlayer().C.MODE.STRAIGHT,
            startIndex: commandIndex,
            startUrl: null,
            resources: filterCommands,
            postDelay: this.props.config.playCommandInterval * 1000,
            partial: true
          })
        }
        case 'save_as_new_block' : {
          return this.props.changeModalState('multiselect', true)
        }
      }
    }

    return (
      <div style={style} id="context_menu">
        <Menu onClick={handleClick} style={menuStyle} mode="vertical" selectable={false}>
          <Menu.Item key="cut" disabled={inSearch || inSelection}>Cut</Menu.Item>
          <Menu.Item key="copy" disabled={inSearch || inSelection}>Copy</Menu.Item>
          <Menu.Item key="paste" disabled={clipboard.commands.length === 0}>Paste</Menu.Item>
          <Menu.Divider />
          <Menu.Item key="insert" disabled={inSearch || inSelection}>Insert new line</Menu.Item>
          <Menu.Divider />
          <Menu.Item key="run_line" disabled={inSelection}>Execute this command</Menu.Item>
          <Menu.Item key="run_from_here" disabled={inSearch || inSelection}>Run from here</Menu.Item>
          <Menu.Item key="save_as_new_block" disabled={!inSelection}>Save As New Block</Menu.Item>
        </Menu>
      </div>
    )
  }

  render () {
    return (
      <div className="editor-wrapper">
        {
          this.props.editorStatus === C.EDITOR_STATUS.SUITES
            ? <SuiteEditor/>
            : <Tabs
              type="card"
              className="commands-view"
              activeKey={this.state.activeTabForCommands}
              onChange={this.onChangeCommandsView}
            >
              <Tabs.TabPane tab="Table View" key="table_view" className="editor-tab-container">
                <div className="form-group table-wrapper">
                  <CommandTable/>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Source View (JSON)"
                className= "source-tab"
                key="source_view"
              >
                <pre className="source-error">{this.state.sourceErrMsg}</pre>
                {/*
                Note: have to use UnControlled CodeMirror, and thus have to use two state :
                      sourceText and sourceTextModified
              */}
                <CodeMirror
                  className={this.state.sourceErrMsg ? 'has-error' : 'no-error'}
                  value={this.state.sourceText}
                  onChange={this.onChangeEditSource}
                  onBlur={this.onSourceBlur}
                  options={{
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    lineNumbers: true,
                    matchBrackets: true,
                    autoCloseBrackets: true
                  }}
                />
              </Tabs.TabPane>
            </Tabs>
        }
        {this.renderContextMenu()}
      </div>
    )
  }
}

DashboardEditor.propTypes = {
  updateSelectedCommand: PropTypes.func.isRequired,
  setEditing: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  hideContextMenu: PropTypes.func.isRequired,
  cutCommand: PropTypes.func.isRequired,
  copyCommand: PropTypes.func.isRequired,
  pasteCommand: PropTypes.func.isRequired,
  insertCommand: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  editing: PropTypes.object.isRequired,
  playerPlay: PropTypes.func.isRequired,
  changeModalState: PropTypes.func.isRequired,
  player: PropTypes.object.isRequired,
  editorStatus: PropTypes.string.isRequired,
  clipboard: PropTypes.object.isRequired,
  searchText: PropTypes.string.isRequired,
  selectedCmds: PropTypes.array.isRequired,
  contextMenu: PropTypes.object.isRequired
}

export default DashboardEditor
