export const convertDate = (date) => {
  const dayjs = require('dayjs');
  const convertedDate = dayjs(date).format('MMMM D, YYYY');
  return convertedDate;
};
