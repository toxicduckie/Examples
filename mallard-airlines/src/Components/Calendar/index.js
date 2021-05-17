import React from 'react';

const Calendar = ({ date }) => {
  return (
    <div className="Calendar">
      <span style={{ cursor: 'pointer' }}>&lt;</span>
      <span className="Calendar__date">{date}</span>
      <span style={{ cursor: 'pointer' }}>&gt;</span>
    </div>
  );
};

export default Calendar;
