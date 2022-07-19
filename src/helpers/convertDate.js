const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');

export const convertDate = (date) => {
  const convertedDate = dayjs(date).format('MMMM D, YYYY');
  return convertedDate;
};

export const timeFromNow = (date) => {
  dayjs.extend(relativeTime);
  const currentDate = dayjs(date).format();
  const timeToDisplay = dayjs(currentDate).toNow(true);
  return timeToDisplay;
};
