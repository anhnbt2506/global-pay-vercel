import { getNameInitials } from './get-name-initials';

describe('getNameInitials', () => {
  it('should return 1 initial letter when passed in 1 word', () => {
    expect(getNameInitials('David')).toBe('D');
  });

  it('should return 2 initial letters when passed in 2 words', () => {
    expect(getNameInitials('David Lee')).toBe('DL');
  });

  it('should return 2 initial letter  when passed in more than 2 words', () => {
    expect(getNameInitials('David Norton Isaac Lee')).toBe('DL');
  });
});
