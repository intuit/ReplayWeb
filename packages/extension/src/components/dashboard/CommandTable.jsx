import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Input,
  Icon,
  Table,
  Tooltip,
  Popover,
  Spin
} from 'antd'
import { DragSource, DropTarget } from 'react-dnd'
import { commandsMap, newCommand } from '../../common/commands'
import * as C from '../../common/constant'
import CommandOptions from '../../containers/dashboard/CommandOptions'
import deepEqual from 'deep-equal'

import { updateSubstitutions } from '../../common/substitution_builder'

function dragDirection (
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2
  const hoverClientY = clientOffset.y - sourceClientOffset.y
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward'
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward'
  }
}

const rowSource = {
  beginDrag (props) {
    return {
      index: props.index
    }
  },
  canDrag (props) {
    return props.searchText === ''
  }
}

const rowTarget = {
  drop (props, monitor) {
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }
    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex)
  }
}

const CommandRow = props => {
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    dragRow,
    clientOffset,
    sourceClientOffset,
    initialClientOffset,
    index,
    player,
    editing,
    editor,
    selectCommand,
    searchText,
    multiSelect,
    groupSelect,
    removeSelected,
    ...restProps
  } = props

  const style = { ...restProps.style, cursor: searchText ? 'default' : 'move' }

  let className = restProps.className
  if (isOver && initialClientOffset) {
    const direction = dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset
    )
    if (direction === 'downward') {
      className += ' drop-over-downward'
    }
    if (direction === 'upward') {
      className += ' drop-over-upward'
    }
  }

  const { nextCommandIndex, errorCommandIndices, doneCommandIndices } = player
  const { selectedCmds } = editor

  if (index === editing.meta.selectedIndex) {
    className += ' selected-command'
  } else if (index === nextCommandIndex || selectedCmds.indexOf(index) !== -1) {
    className += ' running-command'
  } else if (errorCommandIndices.indexOf(index) !== -1) {
    className += ' error-command'
  } else if (doneCommandIndices.indexOf(index) !== -1) {
    className += ' done-command'
  }

  return connectDragSource(
    connectDropTarget(
      <tr
        {...restProps}
        className={className}
        style={style}
        onClick={(e) => {
          if (e.altKey || e.metaKey) {
            multiSelect(index)
          } else if (e.shiftKey) {
            groupSelect(index)
          } else if (!e.altKey || !e.shiftKey) {
            removeSelected()
          }
          selectCommand(index)
        }}
      />
    )
  )
}

const DragDropCommandRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset()
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset()
  }))(CommandRow)
)

const handleSubstitutionState = (self) => {
  let curId
  try {
    curId = self.props.editing.meta.src.id
  } catch (e) {
    // src not set yet, ignore this attempt
    return
  }
  updateSubstitutions(self.props.editing.commands, self.props.editor.blocks).then(cleanedReplacements => {
    if (curId === self.props.editing.meta.src.id) {
      self.setState({ replaced: cleanedReplacements })
    }
  })
}

class CommandTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = { replaced: [] }
  }

  onInputChange (e) {
    const text = e.target.value
    this.props.filterCommands(text)
    this.props.removeSelected()
  }

  componentWillMount () {
    this.setState({ replaced: [] })
  }

  componentDidMount () {
    handleSubstitutionState(this)
  }

  componentWillReceiveProps (props) {
    if (this.props.editing.meta.src && props.editing.meta.src && (props.editing.meta.src.id !== this.props.editing.meta.src.id)) {
      this.setState({ replaced: [] })
    }

    // We are making the claim that other blocks will not change while editing a given text/block
    if (this.state.replaced.length !== props.editing.commands.length || !deepEqual(props.editing.commands, this.props.editing.commands)) { handleSubstitutionState(this) }
  }

  render () {
    const searchBox = () => {
      return (
        <span className="custom-searchBox">
          <span>Parameters</span>
          <Input
            className="input-search"
            placeholder="Search..."
            value={searchText}
            onChange={this.onInputChange}
            disabled={!editable}
            style={{ width: 180, marginLeft: 30 }}
            addonAfter={<Icon type="close"
              style={{ cursor: 'pointer' }}
              onClick={e => {
                this.props.removeSearchText()
              }}
            />}
          />
        </span>
      )
    }

    const defaultDataSource = [newCommand]
    const { editing, editor, player, selectCommand, searchText, multiSelect, groupSelect, removeSelected } = this.props

    const { filterCommands } = editing
    const dataSource = (filterCommands && filterCommands.length
      ? filterCommands
      : defaultDataSource
    )
      .map((command, i) => ({
        ...command,
        key: i
      }))
    const editable = player.status === C.PLAYER_STATUS.STOPPED
    const inSearch = searchText !== ''
    const columns = [
      { title: 'Command', dataIndex: 'command', key: 'command', width: 130 },
      {
        title: searchBox(),
        dataIndex: 'parameters',
        key: 'parameters',
        render: (text, record, index) => {
          // See if parameters are defined in the command map
          // if they arent, use the keys from the parameters of the actual command object
          const params = commandsMap[record.command] && commandsMap[record.command].parameters
            ? commandsMap[record.command].parameters
            : (record.parameters && Object.keys(record.parameters).map(p => ({ name: p }))) || []
          return <div key={record.key}>
            {
              params.map(
                param => {
                  // The value to render is either the value of the parameter
                  // or if its an object, its the value of the specified key from that object
                  const value = (param.type === 'object' && param.key !== undefined)
                    ? record.parameters[param.name] && record.parameters[param.name][param.key]
                    : record.parameters[param.name]
                  const warning = <Tooltip title={`${param.name} is missing`}><Icon type='warning' style={{ color: 'red' }}/></Tooltip>
                  const optional = <Tooltip title={`${param.name} is optional`}><Icon type='question-circle' style={{ color: 'blue' }}/></Tooltip>
                  const maxLength = 30
                  const shorten = s => s.length > maxLength ? s.substring(0, maxLength - 3) + '...' : s
                  return <span key={param.name} style={{ marginRight: '20px' }}>
                    <strong>{param.name}:</strong> {value ? shorten(`${value}`) : (param.optional ? optional : warning)}
                  </span>
                }
              )
            }
          </div>
        }
      },
      {
        title: 'Substitutions',
        dataIndex: 'substitutions',
        key: 'substitutions',
        width: 250,
        render: (text, record, index) => {
          if (this.state.replaced.length === 0) { return <Spin /> }
          if (!this.state.replaced[index]) { return <span></span> }
          const content = this.state.replaced[index].map((replacement) => {
            return (
              <p>
                <strong>{replacement[0]}</strong>
                <span>  replaced with  </span>
                <strong>{replacement[1]}</strong>
              </p>
            )
          })

          if (content.length == 0) return <span></span>

          return <Popover content={content} title="Substitutions">
            <Button>Substitutions</Button>
          </Popover>
        }
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 85,
        render: (text, record, index) => {
          return (
            <div key={record.key}>
              <Tooltip title='Remove Command' mouseEnterDelay={0.5}>
                <Button
                  disabled={!editable || inSearch }
                  onClick={e => {
                    this.props.removeCommand(index)
                    e.stopPropagation()
                  }}
                  type='danger'
                  icon='minus'
                  shape='circle'
                  style={{ marginRight: '5px' }}
                />
              </Tooltip>
              <Tooltip title='Add Command' mouseEnterDelay={0.5}>
                <Button
                  disabled={!editable || inSearch }
                  onClick={e => {
                    this.props.insertCommand(newCommand, index + 1)
                    e.stopPropagation()
                  }}
                  icon='plus'
                  shape='circle'
                />
              </Tooltip>
            </div>
          )
        }
      }
    ]

    const components = {
      body: {
        row: DragDropCommandRow
      }
    }

    const moveRow = (dragIndex, hoverIndex) => {
      this.props.reorderCommand(dragIndex, hoverIndex)
    }

    const onContextMenu = (index, e) => {
      e.preventDefault()
      this.props.selectCommand(index)
      this.props.showContextMenu({
        x: e.clientX,
        y: e.clientY,
        isShown: true,
        commandIndex: index
      })
    }

    const tableConfig = {
      expandedRowKeys: [this.props.selectedCommand],
      rowKey: record => record.key,
      dataSource,
      columns,
      components,
      onRow: (record, index) => ({
        index,
        editing,
        editor,
        player,
        moveRow,
        searchText,
        selectCommand,
        multiSelect,
        groupSelect,
        removeSelected,
        onContextMenu: onContextMenu.bind(this, index)
      }),
      pagination: false
    }

    return <Table {...tableConfig}
      expandRowByClick= {true}
      expandIconAsCell={false}
      expandedRowRender={(record, index, indent, expanded) =>
        expanded ? <CommandOptions /> : null
      }
    />
  }
}

CommandTable.propTypes = {
  searchText: PropTypes.string.isRequired,
  moveRow: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  editor: PropTypes.object.isRequired,
  filterCommands: PropTypes.func.isRequired,
  removeSelected: PropTypes.func.isRequired,
  editing: PropTypes.object.isRequired,
  removeSearchText: PropTypes.func.isRequired,
  removeCommand: PropTypes.func.isRequired,
  insertCommand: PropTypes.func.isRequired,
  reorderCommand: PropTypes.func.isRequired,
  selectCommand: PropTypes.func.isRequired,
  showContextMenu: PropTypes.func.isRequired,
  selectedCommand: PropTypes.any.isRequired,
  player: PropTypes.object.isRequired,
  multiSelect: PropTypes.func.isRequired,
  groupSelect: PropTypes.func.isRequired
}

export default CommandTable
