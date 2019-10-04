import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu, Icon, Modal, Tooltip } from 'antd'
import '../../styles/sidebar.scss'
import { getPlayer } from '../../common/player'
import * as C from '../../common/constant'
import Testcase from './Testcase'
import Block from './Block'
import Suite from './Suite'

const SubMenu = Menu.SubMenu

class Sidebar extends React.Component {
  state = {
    collapsed: false,
    visible: false
  }

  onCollapse = collapsed => {
    this.setState({ collapsed })
  }

  changeTestCase = id => {
    return new Promise((resolve, reject) => {
      if (this.props.status !== C.APP_STATUS.NORMAL) {
        return resolve(false)
      }
      if (
        this.props.editing.meta.src &&
        this.props.editing.meta.src.id === id
      ) {
        return resolve(true)
      }
      if (this.props.editing.meta.hasUnsaved) {
        this.props.setNextTest(id)
        this.props.changeModalState('save', true)
        return resolve(false)
      } else {
        if (id) {
          this.props.editTestCase(id)
        } else {
          this.props.editNewTestCase()
        }
        return resolve(true)
      }
    })
  }

  changeBlock = id => {
    return new Promise((resolve, reject) => {
      if (this.props.status !== C.APP_STATUS.NORMAL) return resolve(false)
      if (
        this.props.editing.meta.src &&
        this.props.editing.meta.src.id === id
      ) {
        return resolve(true)
      }
      if (this.props.editing.meta.hasUnsaved) {
        this.props.setNextBlock(id)
        this.props.changeModalState('save', true)
        return resolve(false)
      } else {
        if (id) {
          this.props.editBlock(id)
        } else {
          this.props.changeModalState('newBlockModal', true)
        }
        return resolve(true)
      }
    })
  }

  changeSuite = id => {
    return new Promise((resolve, reject) => {
      if (this.props.status !== C.APP_STATUS.NORMAL) return resolve(false)
      if (
        this.props.editing.meta.src &&
        this.props.editing.meta.src.id === id
      ) {
        return resolve(true)
      }
      if (this.props.editing.meta.hasUnsaved) {
        this.props.setNextSuite(id)
        this.props.changeModalState('save', true)
        return resolve(false)
      } else {
        if (id) {
          this.props.editSuite(id)
        } else {
          this.props.editNewSuite()
        }
        return resolve(true)
      }
    })
  }

  onDoubleClick = id => {
    if (this.props.status !== C.APP_STATUS.NORMAL) {
      return
    }

    this.changeTestCase(id).then(shouldPlay => {
      if (!shouldPlay) {
        return
      }

      setTimeout(() => {
        const { commands } = this.props.editing
        const openTc = commands.find(tc => tc.command.toLowerCase() === 'open')
        const { src } = this.props.editing.meta
        const getTestCaseName = () => {
          return src && src.name && src.name.length ? src.name : 'Untitled'
        }

        this.props.playerPlay({
          title: getTestCaseName(),
          extra: {
            id: src && src.id
          },
          mode: getPlayer().C.MODE.STRAIGHT,
          startIndex: 0,
          startUrl: openTc && openTc.parameters ? openTc.parameters.url : null,
          resources: commands,
          postDelay: this.props.player.playInterval * 1000
        })
      }, 500)
    })
  }

  onClickNewProject() {
    this.props.changeModalState('projectSetup', true)
  }

  onClickEditProject(id) {
    this.props.editProject(id)
    this.props.changeModalState('projectSetup', true)
  }

  changeProject({ key }) {
    const project = this.props.projects.find(p => p.id === key)
    this.props.selectProject(project)
  }

  onClickDeleteProject(project) {
    const { projects } = this.props
    if (projects.length <= 1) {
      return Modal.warning({
        title: 'Cannot delete',
        content: "Can't delete the last project in Replay",
        okText: 'Ok'
      })
    } else {
      return Modal.confirm({
        title: 'Confirm Delete',
        content: 'Are you sure you want to delete this project?',
        okText: 'Delete',
        cancelText: 'Cancel',
        onOk: () => {
          this.props.removeProject(project)
        },
        onCancel: () => {}
      })
    }
  }

  render() {
    const {
      testCases,
      project,
      projects,
      player,
      status,
      blocks,
      suites
    } = this.props
    const src = this.props.editing.meta.src
    const projectName = project.name || 'Untitled'
    const isPlayerStopped = player.status === C.PLAYER_STATUS.STOPPED
    const currentTc = testCases.find(item => (src && src.id) === item.id)
    const currentBlock = blocks.find(item => (src && src.id) === item.id)
    const currentSuite = suites.find(item => (src && src.id) === item.id)

    testCases.sort((a, b) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      if (nameA < nameB) return -1
      if (nameA === nameB) return 0
      return 1
    })

    const getMenuKlass = p => {
      return project && project.id === p.id ? 'editing' : ''
    }

    const menu = (
      <Menu theme="dark" className="folder-sidebar" selectable={false}>
        <Menu.Item
          className="add-folder"
          onClick={this.onClickNewProject.bind(this)}
        >
          Add New Project
          <Icon type="plus" />
        </Menu.Item>
        {projects.map(p => (
          <Menu.Item
            key={p.id}
            disabled={!isPlayerStopped}
            className={getMenuKlass(p)}
          >
            <span
              onClick={this.props.selectProject.bind(null, p)}
              style={{ width: '100%' }}
            >
              {p.name}
            </span>
            <span>
              <Tooltip title="Edit Project">
                <Icon
                  type="edit"
                  style={{ marginRight: '15px' }}
                  onClick={this.onClickEditProject.bind(this, p.id)}
                />
              </Tooltip>
              <Tooltip title="Delete Project">
                <Icon
                  type="delete"
                  onClick={this.onClickDeleteProject.bind(this, p)}
                />
              </Tooltip>
            </span>
          </Menu.Item>
        ))}
      </Menu>
    )

    return (
      <div className="side-bar">
        <Layout.Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          style={{ overflow: 'scroll' }}
          width={this.props.config.sidebarWidth}
        >
          <Menu mode="vertical" theme="dark">
            <SubMenu
              key="folder-sub"
              className="folder-sidebar"
              title={
                <span>
                  <Icon type="folder" />
                  <span>{projectName}</span>
                </span>
              }
            >
              {menu}
            </SubMenu>
          </Menu>
          <Menu
            theme="dark"
            mode="inline"
            inlineCollapsed={this.state.collapsed}
            defaultOpenKeys={['TESTS', 'BLOCKS', 'SUITES']}
            selectedKeys={[
              currentTc && currentTc.id,
              currentBlock && currentBlock.id,
              currentSuite && currentSuite.id
            ]}
          >
            <SubMenu
              title={
                <span>
                  <Icon type="file" />
                  <span>Test Cases</span>
                </span>
              }
              key={C.EDITOR_STATUS.TESTS}
              className="test-sidebar"
            >
              <Menu.Item onClick={this.changeTestCase.bind(this, undefined)}>
                <Icon type="plus" />
                <span>New Test</span>
              </Menu.Item>
              {testCases.map(tc => (
                <Menu.Item
                  className="sidebar-test-cases"
                  onClick={this.changeTestCase.bind(this, tc.id)}
                  onDoubleClick={this.onDoubleClick}
                  disabled={status !== C.APP_STATUS.NORMAL}
                  key={tc.id}
                >
                  <Testcase key={tc.id} {...tc} />
                </Menu.Item>
              ))}
            </SubMenu>
            <SubMenu
              title={
                <span>
                  <Icon type="switcher" />
                  <span>Blocks</span>
                </span>
              }
              className="block-sidebar"
              key={C.EDITOR_STATUS.BLOCKS}
            >
              <Menu.Item onClick={this.changeBlock.bind(this, undefined)}>
                <Icon type="plus" />
                <span>New Block</span>
              </Menu.Item>
              {blocks.map(blockItem => (
                <Menu.Item
                  className="sidebar-blocks"
                  onClick={this.changeBlock.bind(this, blockItem.id)}
                  disabled={status !== C.APP_STATUS.NORMAL}
                  key={blockItem.id}
                >
                  <Block key={blockItem.id} {...blockItem} />
                </Menu.Item>
              ))}
            </SubMenu>
            <SubMenu
              title={
                <span>
                  <Icon type="database" />
                  <span>Suites</span>
                </span>
              }
              className="block-sidebar"
              key={C.EDITOR_STATUS.SUITES}
            >
              <Menu.Item onClick={this.changeSuite.bind(this, undefined)}>
                <Icon type="plus" />
                <span>New Suite</span>
              </Menu.Item>
              {suites.map(suite => (
                <Menu.Item
                  key={suite.id}
                  className="sidebar-blocks"
                  disabled={status !== C.APP_STATUS.NORMAL}
                  onClick={this.changeSuite.bind(this, suite.id)}
                >
                  <Suite key={suite.id} {...suite} />
                </Menu.Item>
              ))}
            </SubMenu>
          </Menu>
        </Layout.Sider>
      </div>
    )
  }
}

Sidebar.propTypes = {
  editing: PropTypes.object.isRequired,
  testCases: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  projects: PropTypes.array.isRequired,
  player: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  blocks: PropTypes.array.isRequired,
  suites: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
  setNextTest: PropTypes.func,
  changeModalState: PropTypes.func,
  editTestCase: PropTypes.func,
  editNewTestCase: PropTypes.func,
  selectProject: PropTypes.func
}

export default Sidebar
