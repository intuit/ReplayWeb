import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Popover, Tooltip, message } from 'antd'
import moment from 'moment'
import { availableReplacements } from '@replayweb/utils'
import csIpc from '../../../common/ipc/ipc_cs'

const CommandButtons = props => {
  const onClickFind = locator => {
    csIpc
      .ask('PANEL_HIGHLIGHT_DOM', {
        lastOperation: null,
        locator: locator
      })
      .catch(e => {
        message.error(e.message, 1.5)
      })
  }

  const onToggleInspect = target => {
    if (props.isInspecting) {
      props.setInspectTarget(null)
      props.stopInspecting()
    } else {
      props.setInspectTarget(target)
      props.startInspecting()
    }
  }
  const content = (
    <div>
      {Object.keys(availableReplacements).map(key => {
        const replacement = availableReplacements[key]
        return <p key={key}>{`{${key}} - ${replacement.description}`}</p>
      })}
    </div>
  )
  return (
    <span>
      <Button.Group>
        {props.canTarget ? (
          <Tooltip
            title={
              props.isInspecting && props.inspectTarget === props.name
                ? 'Cancel'
                : 'Select from page'
            }
          >
            <Button
              disabled={!props.isCmdEditable}
              onClick={onToggleInspect.bind(null, props.name)}
              icon={
                props.isInspecting && props.inspectTarget === props.name
                  ? 'close'
                  : 'search'
              }
            />
          </Tooltip>
        ) : (
          undefined
        )}
        {props.canTarget ? (
          <Tooltip title="Highlight on page">
            <Button
              disabled={!props.isCmdEditable}
              onClick={onClickFind.bind(null, props.value)}
              icon="eye-o"
            />
          </Tooltip>
        ) : (
          undefined
        )}
        {props.command === 'type' &&
        props.value &&
        moment(props.value)._isValid ? (
          <Tooltip title="Use substitution for todays date">
            <Button
              icon="calendar"
              onClick={() => props.updateParameter('{todaysDate}')}
            />
          </Tooltip>
        ) : (
          undefined
        )}
        {props.command === 'type' &&
        props.value &&
        /\d{3}-\d{2}-\d{4}/g.test(props.value) ? (
          <Tooltip title="Use substitution for unused SSN">
            <Button
              icon="lock"
              onClick={() => props.updateParameter('{ssn}')}
            />
          </Tooltip>
        ) : (
          undefined
        )}
      </Button.Group>
      <Popover content={content} title="Replacement shortcuts">
        <Icon type="question-circle-o" style={{ paddingLeft: 10 }} />
      </Popover>
    </span>
  )
}

CommandButtons.propTypes = {
  stopInspecting: PropTypes.func.isRequired,
  setInspectTarget: PropTypes.func.isRequired,
  startInspecting: PropTypes.func.isRequired,
  isInspecting: PropTypes.bool.isRequired,
  inspectTarget: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  canTarget: PropTypes.bool.isRequired,
  isCmdEditable: PropTypes.bool.isRequired,
  command: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  updateParameter: PropTypes.func.isRequired
}

export default CommandButtons
