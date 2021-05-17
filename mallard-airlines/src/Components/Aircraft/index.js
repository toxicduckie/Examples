import React from 'react';

const Aircraft = props => {
  const { onElementClick, data, usage } = props;

  return (
    <li>
      <button type="button" onClick={onElementClick}>
        <span>{data.ident}</span>
        {/* Create an object that includes the usability by */}
        <span>{`(${usage || 0}%)`}</span>
      </button>
    </li>
  );
};

export default Aircraft;
