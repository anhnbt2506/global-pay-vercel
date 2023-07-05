import { isObject } from '.';

describe('isObject', () => {
  it('should return true when object given', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ name: 'alpha' })).toBe(true);
  });

  it('should return false when array given', () => {
    expect(isObject([])).toBe(false);
  });

  it('should return false when null given', () => {
    expect(isObject(null)).toBe(false);
  });
});
