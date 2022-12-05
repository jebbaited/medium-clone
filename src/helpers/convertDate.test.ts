import { convertDate, timeFromNow } from './convertDate';

describe('convertDate', () => {
  test('Right date', () => {
    expect(convertDate('2021-09-01T15:20:51.859Z')).toBe('September 1, 2021');
    expect(convertDate('2021-09-01T15:20:51.859Z')).not.toBe(
      'Invalid DateTime'
    );
    expect(convertDate('2021-09-01')).toBe('September 1, 2021');
  });
  test('Empty date or wrong one', () => {
    expect(convertDate('')).toBe('Invalid DateTime');
    expect(convertDate('dsfgrhrtyjytj')).toBe('Invalid DateTime');
  });
});

describe('timeFromNow', () => {
  test('Right date', () => {
    expect(timeFromNow('2021-09-01T15:20:51.859Z')).toBe('1 year ago');
    expect(timeFromNow('2021-09-01T15:20:51.859Z')).not.toBe(
      'Invalid DateTime'
    );
    expect(timeFromNow('2010-09-01')).toBe('12 years ago');
  });
  test('Empty date or wrong one', () => {
    expect(timeFromNow('')).toBeNull();
    expect(timeFromNow('dsfgrhrtyjytj')).toBeNull();
    expect(timeFromNow('2020-22')).toBeFalsy();
  });
});
