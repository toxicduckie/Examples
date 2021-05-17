import React from 'react';

const Flight = props => {
  const {
    onElementClick,
    data: {
      id,
      destination,
      origin,
      readable_arrival: readableArrival,
      readable_departure: readableDeparture,
    },
  } = props;

  return (
    <li>
      <button onClick={onElementClick} type="button">
        <span>Flight: {id}</span>
        <div className="spanContainer">
          <span>{origin}</span>
          <span>{destination}</span>
        </div>
        <div className="spanContainer">
          <span>{readableDeparture}</span>
          <span>{readableArrival}</span>
        </div>
      </button>
    </li>
  );
};

export default Flight;
