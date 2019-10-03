import React from 'react'
import PropTypes from 'prop-types'
import EnvironmentField from './EnvironmentField'
import OneField from './OneField'

const CommandField = props => {
  switch (props.selectedCmd && props.selectedCmd.command) {
    case 'setEnvironment':
      return <EnvironmentField {...props}/>
    default:
      return <OneField {...props} />
  }
}

CommandField.propTypes = {
  selectedCmd: PropTypes.object.isRequired
}

export default CommandField
