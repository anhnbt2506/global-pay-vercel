import { isDateValid } from '.';

describe('isDateValid', () => {
  it('It should return false with wrong correct format', () => {
    expect(isDateValid('abc')).toEqual(false);
  });

  it('should return true with right correct format', () => {
    expect(isDateValid('2023-04-06')).toEqual(true);
  });
});
