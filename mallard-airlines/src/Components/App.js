import React, { useState, useEffect } from 'react';
import './App.scss';
import AircraftsList from './AircraftsList';
import FlightsList from './FlightsList';
import RotationColumn from './RotationColumn';
import Calendar from './Calendar';
import {
  typeFlight,
  typeTurnaround,
  turnaroundTime,
  totalDayTime,
  timeSort,
  flightsSort,
  calcPercentage,
  turnaroundPercentage,
  usagePercentage,
  todaysDate,
} from './utils';


const App = () => {
  // State
  const [aircrafts, setAircrafts] = useState([]);
  const [flights, setFlights] = useState([]);
  const [flightsLoading, setFlightsLoading] = useState(false);
  const [rotations, setRotations] = useState({});
  const [selectedAircraft, setSelectedAircraft] = useState('');
  const [usageList, setUsageList] = useState({});

  const fetchData = async (value, callback, sorter) => {
    const res = await fetch(value);
    const body = await res.json();
    const { data } = body;
    const response = data || body;
    if (sorter) {
      response.sort(sorter);
    }
    callback(response);
  };

  useEffect(() => {
    fetchData(
      'https://infinite-dawn-93085.herokuapp.com/aircrafts',
      setAircrafts,
    );
  }, []);

  // Initialize the rotation object ()
  const makeNewRotation = aircraft => {
    const newRotations = {
      ...rotations,
      [aircraft]: {
        flights: [],
        freeTime: [
          {
            start: 0,
            end: 86400,
            percentage: 100,
            type: 'Free',
          },
        ],
        scheduledTime: [],
      },
    };
    setRotations(newRotations);
  };

  // Calculates the "free time" an aircraft has
  const makeFreeTime = scheduledTime => {
    const freeTimeObj = scheduledTime.reduce(
      (acc, val) => {
        if (val.start - acc.lastTime <= 0) {
          return acc;
        }
        if (val.type === typeFlight) {
          const obj = {
            start: acc.lastTime,
            end: val.start,
            type: 'Free',
          };
          obj.percentage = calcPercentage(obj.end - obj.start, totalDayTime);
          acc.freeTime.push(obj);
        } else if (val.type === typeTurnaround) {
          acc.lastTime = val.end;
        }
        return acc;
      },
      {
        lastTime: 0,
        freeTime: [],
      },
    );
    const { lastTime, freeTime } = freeTimeObj;
    if (lastTime <= totalDayTime) {
      freeTime.push({
        start: lastTime,
        end: totalDayTime,
        percentage: calcPercentage(totalDayTime - lastTime, totalDayTime),
        type: 'Free',
      });
    }
    return freeTime;
  };

  const makeAirCraftRotation = aircraftRotation => {
    const { scheduledTime } = aircraftRotation;
    const freeTime = makeFreeTime(scheduledTime);
    const newAircraftRotation = {
      ...aircraftRotation,
      freeTime,
    };
    return {
      ...rotations,
      [selectedAircraft]: newAircraftRotation,
    };
  };

  const onAircraftClick = async aircraft => {
    setFlightsLoading(true);
    await fetchData(
      'https://infinite-dawn-93085.herokuapp.com/flights',
      setFlights,
      flightsSort,
    );
    setSelectedAircraft(aircraft);
    if (!rotations[aircraft]) {
      makeNewRotation(aircraft);
    }
    setFlightsLoading(false);
  };

  const onFlightClick = target => {
    const {
      flights: aircraftFlights,
      scheduledTime: aircraftScheduledTime,
    } = rotations[selectedAircraft];
    const newRotationFlights = aircraftFlights
      ? [...aircraftFlights, target].sort(flightsSort)
      : [target];
    const { id, departuretime, arrivaltime, destination } = target;
    const formattedSchedule = {
      id: id,
      type: typeFlight,
      start: departuretime,
      end: arrivaltime,
      percentage: calcPercentage(arrivaltime - departuretime, totalDayTime),
    };
    const newScheduleBlock = [formattedSchedule];
    const startTurnaroundTime = formattedSchedule.end;
    const endTurnaroundTime = formattedSchedule.end + turnaroundTime;
    if (endTurnaroundTime - startTurnaroundTime) {
      const turnaroundObj = {
        id: id,
        type: typeTurnaround,
        start:
          startTurnaroundTime <= totalDayTime
            ? startTurnaroundTime
            : totalDayTime,
        end:
          endTurnaroundTime <= totalDayTime ? endTurnaroundTime : totalDayTime,
        origin: destination,
        percentage: turnaroundPercentage,
      };
      newScheduleBlock.push(turnaroundObj);
    }
    const newScheduledTime = [
      ...aircraftScheduledTime,
      ...newScheduleBlock,
    ].sort(timeSort);
    const currentPercentage = usagePercentage(newScheduledTime);
    const newUsageList = {
      ...usageList,
      [selectedAircraft]: currentPercentage,
    };
    setUsageList(newUsageList);
    const newAircraftRotation = {
      ...rotations[selectedAircraft],
      flights: newRotationFlights,
      scheduledTime: newScheduledTime,
    };
    const newRotation = makeAirCraftRotation(newAircraftRotation);
    setRotations(newRotation);
  };

  const onRotationClick = target => {
    const {
      flights: aircraftFlights,
      scheduledTime: aircraftScheduledTime,
    } = rotations[selectedAircraft];
    const aircraftFlightIndex = aircraftFlights.findIndex(el => el === target);
    const newAircraftFlights = aircraftFlights.splice(0, aircraftFlightIndex);
    const scheduledTimeIndex = aircraftScheduledTime.findIndex(
      el => el.id === target.id,
    );
    const newScheduledTime = aircraftScheduledTime.splice(
      0,
      scheduledTimeIndex,
    );
    const currentPercentage = usagePercentage(newScheduledTime);
    const newUsageList = {
      ...usageList,
      [selectedAircraft]: currentPercentage,
    };
    setUsageList(newUsageList);
    const newAircraftRotation = {
      ...rotations[selectedAircraft],
      flights: newAircraftFlights,
      scheduledTime: newScheduledTime,
    };
    const newRotation = makeAirCraftRotation(newAircraftRotation);
    setRotations(newRotation);
  };

  const filterFlights = () => {
    const curRot = rotations[selectedAircraft];
    if (!curRot || !curRot.flights.length) {
      return flights;
    }
    const canBeScheduled = flight => {
      const lastIndex = curRot.scheduledTime.length - 1;
      const { origin, end } = curRot.scheduledTime[lastIndex];
      return (
        (!origin || origin === flight.origin) && flight.departuretime >= end
      );
    };
    return flights.filter(flight => {
      return !curRot.flights.includes(flight) && canBeScheduled(flight);
    });
  };

  return (
    <div className="App">
      <Calendar date={todaysDate} />
      <AircraftsList
        aircraftList={aircrafts}
        onElementClick={onAircraftClick}
        usageList={usageList}
      />
      <RotationColumn
        rotation={rotations[selectedAircraft] || []}
        onElementClick={onRotationClick}
        selectedAircraft={selectedAircraft}
      />
      <FlightsList
        flightsLoading={flightsLoading}
        flightList={filterFlights()}
        onElementClick={onFlightClick}
      />
    </div>
  );
};

export default App;
