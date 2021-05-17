import React from 'react';
import Flight from '../Flight';

const FlightsList = props => {
  const { onElementClick, flightList, flightsLoading } = props;
  return (
    <div className="FlightsList">
      <span>Flights</span>
      <ul>
        {flightsLoading ? (
          <li className="Loading">Loading...</li>
        ) : (
          flightList.map(child => (
            <Flight
              data={child}
              onElementClick={() => onElementClick(child)}
              key={child.id}
            />
          ))
        )}
        {!flightsLoading && !flightList.length && (
          <li className="Unavailable">No flights available!</li>
        )}
      </ul>
    </div>
  );
};

export default FlightsList;
