import { DateTime } from 'luxon';

export const convertDate = (date) =>
  DateTime.fromISO(date).toFormat('MMMM d, yyyy');

export const timeFromNow = (date) =>
  DateTime.fromISO(date).setLocale('en').toRelative();
