import React from 'react';

const Testcase = props => {
  return (
    <span
      className={`testcase ${props.disabled ? 'disabled' : ''}
      ${props.status ? props.status.toLowerCase() : 'normal'}`}
    >
      {props.name}
    </span>
  );
};

export default Testcase;
