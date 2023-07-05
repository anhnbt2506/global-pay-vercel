import { convertTimeToDateTime } from '.';

describe('convertTimeToDateTime', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2022-08-02T00:00:00'));
  });

  it('should return correct value when hours, minutes, seconds and milliseconds are given', () => {
    expect(convertTimeToDateTime('12:30:00.001')).toEqual(
      new Date('2022-08-02T12:30:00.001')
    );
  });

  it('should return correct value when only hours, minutes and seconds are given', () => {
    expect(convertTimeToDateTime('12:30:00')).toEqual(
      new Date('2022-08-02T12:30:00')
    );
  });

  it('should return correct value when only hours and minutes are given', () => {
    expect(convertTimeToDateTime('13:30')).toEqual(
      new Date('2022-08-02T13:30:00')
    );
  });

  it('should return correct value when only hours is given', () => {
    expect(convertTimeToDateTime('14')).toEqual(
      new Date('2022-08-02T14:00:00')
    );
  });
});
