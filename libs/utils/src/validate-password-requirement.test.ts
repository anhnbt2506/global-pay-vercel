import { validatePasswordRequirement } from './validate-password-requirement';

describe('validatePasswordRequirement', () => {
  it('should return false when password minimum requirement does not meet', () => {
    expect(validatePasswordRequirement('')).toEqual(
      expect.arrayContaining(['min', 'lowercase', 'uppercase', 'digits'])
    );
    expect(validatePasswordRequirement(undefined)).toEqual(
      expect.arrayContaining(['min', 'lowercase', 'uppercase', 'digits'])
    );
    expect(validatePasswordRequirement('1')).toEqual(
      expect.arrayContaining(['min', 'lowercase', 'uppercase'])
    );
    expect(validatePasswordRequirement('1234567890')).toEqual(
      expect.arrayContaining(['lowercase', 'uppercase'])
    );
    expect(validatePasswordRequirement('asdfghjkl')).toEqual(
      expect.arrayContaining(['uppercase', 'digits'])
    );
    expect(validatePasswordRequirement('!@#$%^&*(')).toEqual(
      expect.arrayContaining(['lowercase', 'uppercase', 'digits'])
    );
    expect(validatePasswordRequirement('ASDFGHJKL')).toEqual(
      expect.arrayContaining(['lowercase', 'digits'])
    );
    expect(validatePasswordRequirement('A123djd')).toEqual(
      expect.arrayContaining(['min'])
    );
  });

  it('should return true when password minimum requirement has met', () => {
    expect(validatePasswordRequirement('L666sssss')).toHaveLength(0);
    expect(validatePasswordRequirement('USERs123456')).toHaveLength(0);
  });
});
