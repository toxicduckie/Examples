import React from 'react';
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RotationDetail = props => {
  const {
    onElementClick,
    data,
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
      <button onClick={() => onElementClick(data)} type="button">
        <span>Flight: {id}</span>
        <div className="spanArrowContainer">
          <div className="spanContainer">
            <span>{origin}</span>
            <span>{readableDeparture}</span>
          </div>
          <FontAwesomeIcon icon={faArrowRight} />
          <div className="spanContainer">
            <span>{destination}</span>
            <span>{readableArrival}</span>
          </div>
        </div>
      </button>
    </li>
  );
};

export default RotationDetail;
