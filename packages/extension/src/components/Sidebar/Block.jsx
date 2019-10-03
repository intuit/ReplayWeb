import React from 'react'
import PropTypes from 'prop-types'

const Block = props => {
  const disabled = props.disabled ? 'disabled' : ''
  const status = props.status ? props.status.toLowerCase() : 'normal'
  return (
    <span className={`block ${disabled} ${status}`}>
      {props.name}
    </span>
  )
}

Block.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  status: PropTypes.string
}

export default Block
