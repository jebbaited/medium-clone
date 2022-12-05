import { countPostsSkip } from './countPostsToSkip';

describe('countPostsSkip', () => {
  test('Input strings instead of number', () => {
    expect(countPostsSkip(40, 49, '482', 10)).toBe('382');
    expect(countPostsSkip(40, '49', '482', 10)).toBe('382');
    expect(countPostsSkip(40, '49', '482', '10')).toBe('382');
  });
  test('One of the input params is wrong', () => {
    expect(countPostsSkip(40, 'fghfhgfh', '482', '10')).toBe('NaN');
    expect(countPostsSkip(40, 'fghfhgfh', 'fghfhgfh', '10')).toBe('NaN');
    expect(countPostsSkip(40, 'fghfhgfh', 'fghfhgfh', 'fghfhgfh')).toBe('NaN');
    expect(Number(countPostsSkip(40, 'fghfhgfh', 'fghfhgfh', 'fghfhgfh')))
      .toBeNaN;
    expect(countPostsSkip(-10, 49, 482, '10')).toBe('0');
    expect(countPostsSkip(40, '49', '482', '6000')).toBe('0');
    expect(countPostsSkip(40, '6000', 6000, '6000')).toBe('0');
  });
  test('Function returns number of posts to skip', () => {
    expect(countPostsSkip).toBeDefined();
    expect(countPostsSkip(40, 49, 482, 10)).toBe('382');
    expect(Number(countPostsSkip(40, 49, 482, 10))).toBe(382);
    expect(Number(countPostsSkip(40, 49, 482, 10))).toBeLessThan(383);
    expect(Number(countPostsSkip(40, 49, 482, 10))).not.toBeGreaterThan(382);
  });
});
