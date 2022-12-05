import { DateTime } from 'luxon';

export const convertDate = (date: string): string =>
  DateTime.fromISO(date).toFormat('MMMM d, yyyy');

export const timeFromNow = (date: string): string =>
  DateTime.fromISO(date).setLocale('en').toRelative();
