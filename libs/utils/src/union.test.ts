import { union } from './union';

describe('union', () => {
  it('should return empty array', () => {
    expect(union([])).toEqual([]);
  });

  it('should return original array', () => {
    expect(union(["'self'"])).toEqual(["'self'"]);
  });

  it('should return combined unique items in an array', () => {
    expect(union(["'self'"], ["'self'", '*.ayp-group.com'])).toEqual([
      "'self'",
      '*.ayp-group.com',
    ]);
  });
});
