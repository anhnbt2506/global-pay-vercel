import { isTimeValid } from '.';

describe('isTimeValid', () => {
  it('should return false with wrong format', () => {
    expect(isTimeValid('abc')).toEqual(false);
  });

  it('should return true with correct format', () => {
    expect(isTimeValid('09:12:59')).toEqual(true);
  });
});
