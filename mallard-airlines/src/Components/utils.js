export const typeFlight = 'Flight';
export const typeTurnaround = 'Turnaround';
export const turnaroundTime = 2400;
export const totalDayTime = 86400;

export const timeSort = (a, b) => a.start - b.start;
export const flightsSort = (a, b) => {
  const value = a.departuretime - b.departuretime;
  return value === 0 ? a.arrivaltime - b.arrivaltime : value;
};

export const calcPercentage = (current, total) => (100 * current) / total;

export const turnaroundPercentage = calcPercentage(
  turnaroundTime,
  totalDayTime,
);

export const usagePercentage = scheduledTime =>
  Math.floor(scheduledTime.reduce((acc, val) => acc + val.percentage, 0));

const getTodaysDate = () => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayEndObj = {
    1: 'st',
    21: 'st',
    31: 'st',
    2: 'nd',
    22: 'nd',
    3: 'rd',
    23: 'rd',
  };
  const dayEndArray = [1, 2, 3, 21, 22, 23, 31];

  const today = new Date();

  const todayDay = today.getDate();
  const dd = `${todayDay}${
    dayEndArray.includes(todayDay) ? dayEndObj[todayDay] : 'th'
  }`;
  const mm = months[today.getMonth()];
  const yyyy = today.getFullYear();
  return `${dd} ${mm} ${yyyy}`;
};

export const todaysDate = getTodaysDate();
