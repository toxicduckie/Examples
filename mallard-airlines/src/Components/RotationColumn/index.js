import React from 'react';
import RotationList from '../RotationList';
import RotationBar from '../RotationBar';

const RotationColumn = props => {
  const { rotation, onElementClick, selectedAircraft } = props;
  return (
    <div className="ScheduledFlights">
      <span
        className={`ScheduledFlightsSpan ${!selectedAircraft &&
          'ScheduledFlightsSpan--hidden'}`}
      >
        {`Rotation ${selectedAircraft}`}
      </span>
      <RotationList rotation={rotation} onElementClick={onElementClick} />
      <RotationBar rotation={rotation} />
    </div>
  );
};

export default RotationColumn;
