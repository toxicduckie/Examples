import React from 'react';
import { timeSort } from '../utils';

const makeOrderedDiv = rotation => {
  const { freeTime, scheduledTime } = rotation;
  if (!freeTime) {
    return [];
  }
  return [...freeTime, ...scheduledTime].sort(timeSort);
};

const RotationBar = ({ rotation }) => {
  const rotationList = makeOrderedDiv(rotation);
  return (
    <>
      <div className="RotationBarText">
        <span>00:00</span>
        <span>12:00</span>
      </div>
      <div className="RotationBar">
        {rotationList &&
          rotationList.map((elem, i) => (
            <div
              key={i}
              className={elem.type}
              style={{ width: `${elem.percentage}%` }}
            />
          ))}
      </div>
    </>
  );
};

export default RotationBar;
