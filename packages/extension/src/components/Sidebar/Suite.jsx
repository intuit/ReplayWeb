import React from 'react';

const Suite = props => {
  return (
    <span
      className={`block ${props.disabled ? 'disabled' : ''} normal`}
    >
      {props.name}
    </span>
  );
};

export default Suite;
