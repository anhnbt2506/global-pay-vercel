import { yupCustomValidation } from './yup-custom-validation';

const EMAIL_DOMAIN_ADDRESS_BLACKLIST = [
  '@hotmail.',
  '@gmail.',
  '@yahoo.',
  '@outlook.',
  '@live.',
];

describe('yupCustomValidation', () => {
  describe('isDateAfter', () => {
    const value = new Date(
      'Tue Apr 19 2022 09:24:37 GMT+0700 (Western Indonesia Time)'
    );
    const valueToCompare = new Date(
      'Tue Apr 19 2022 09:23:37 GMT+0700 (Western Indonesia Time)'
    );

    it('should return false when value and/or valueToCompare is nullish', () => {
      expect(yupCustomValidation.isDateAfter(null, null)).toBe(false);
      expect(yupCustomValidation.isDateAfter(undefined, undefined)).toBe(false);
      expect(yupCustomValidation.isDateAfter(value, null)).toBe(false);
      expect(yupCustomValidation.isDateAfter(null, valueToCompare)).toBe(false);
    });

    it('should return false when value and/or valueToCompare is invalid date', () => {
      expect(
        yupCustomValidation.isDateAfter(
          new Date('Invalid'),
          new Date('Invalid')
        )
      ).toBe(false);
      expect(
        yupCustomValidation.isDateAfter(new Date('Invalid'), valueToCompare)
      ).toBe(false);
      expect(yupCustomValidation.isDateAfter(value, new Date('Invalid'))).toBe(
        false
      );
    });

    it('should return false when value is before valueToCompare', () => {
      expect(yupCustomValidation.isDateAfter(valueToCompare, value)).toBe(
        false
      );
    });

    it('should return true when value is after valueToCompare', () => {
      expect(yupCustomValidation.isDateAfter(value, valueToCompare)).toBe(true);
    });
  });

  describe('isValidNumber', () => {
    it('should return false when postal code contains any characters other than numbers', () => {
      expect(yupCustomValidation.isValidNumber('')).toBe(false);
      expect(yupCustomValidation.isValidNumber(null)).toBe(false);
      expect(yupCustomValidation.isValidNumber(undefined)).toBe(false);
      expect(yupCustomValidation.isValidNumber('Invalid')).toBe(false);
      expect(yupCustomValidation.isValidNumber('Invalid123')).toBe(false);
      expect(yupCustomValidation.isValidNumber('@12345')).toBe(false);
    });

    it('should return true when postal code only contains numbers', () => {
      expect(yupCustomValidation.isValidNumber('12345')).toBe(true);
    });
  });

  describe('isNotContainSpaces', () => {
    it('should return false when value contains spaces', () => {
      expect(yupCustomValidation.isNotContainSpaces(' ')).toBe(false);
      expect(yupCustomValidation.isNotContainSpaces(' 123 ')).toBe(false);
      expect(yupCustomValidation.isNotContainSpaces('12 34')).toBe(false);
    });

    it('should return true when value NOT contains spaces', () => {
      expect(yupCustomValidation.isNotContainSpaces('12345')).toBe(true);
      expect(yupCustomValidation.isNotContainSpaces(null)).toBe(true);
    });
  });

  describe('isAlpha', () => {
    it('should return false when string contain number or special characters', () => {
      expect(yupCustomValidation.isAlpha('username231')).toBe(false);
      expect(yupCustomValidation.isAlpha('Eden-Hazard')).toBe(false);
    });

    it('should return true when string contain alpha and space only', () => {
      expect(yupCustomValidation.isAlpha('Eden Hazard')).toBe(true);
      expect(yupCustomValidation.isAlpha('Eden  Hazard  ')).toBe(true);
      expect(yupCustomValidation.isAlpha('EdenHazard')).toBe(true);
      expect(yupCustomValidation.isAlpha(null)).toBe(true);
    });
  });

  describe('isNumeric', () => {
    it('should return false when string contain alpha or special characters', () => {
      expect(yupCustomValidation.isNumeric('132a23')).toBe(false);
      expect(yupCustomValidation.isNumeric('1_000_000')).toBe(false);
      expect(yupCustomValidation.isNumeric('321321.33')).toBe(false);
    });

    it('should return true when string number and space character', () => {
      expect(yupCustomValidation.isNumeric('0979324212')).toBe(true);
      expect(yupCustomValidation.isNumeric('12345456555 4432423423')).toBe(
        true
      );
      expect(yupCustomValidation.isNumeric(null)).toBe(true);
    });
  });

  describe('isAlphaNumeric', () => {
    it('should return false when string contain special characters', () => {
      expect(yupCustomValidation.isAlphaNumeric('harrypotter@123')).toBe(false);
      expect(yupCustomValidation.isAlphaNumeric('medium2.com')).toBe(false);
      expect(yupCustomValidation.isAlphaNumeric('medium_-2')).toBe(false);
    });

    it('should return true when string contains alpha, number and space character', () => {
      expect(yupCustomValidation.isAlphaNumeric('harrypotter128')).toBe(true);
      expect(yupCustomValidation.isAlphaNumeric('012357854')).toBe(true);
      expect(yupCustomValidation.isAlphaNumeric('Harry Potter 3')).toBe(true);
      expect(yupCustomValidation.isAlphaNumeric('HarryPotter')).toBe(true);
      expect(yupCustomValidation.isAlphaNumeric(null)).toBe(true);
    });
  });

  describe('isAlphaNumericDash', () => {
    it('should return false when string contain special characters', () => {
      expect(yupCustomValidation.isAlphaNumericDash('abc@123')).toBe(false);
      expect(yupCustomValidation.isAlphaNumericDash('abc com')).toBe(false);
    });

    it('should return true when string contains alpha, number and dash character', () => {
      expect(yupCustomValidation.isAlphaNumericDash('abc123-')).toBe(true);
      expect(yupCustomValidation.isAlphaNumericDash('abc')).toBe(true);
      expect(yupCustomValidation.isAlphaNumericDash('123')).toBe(true);
      expect(yupCustomValidation.isAlphaNumericDash(null)).toBe(true);
    });
  });

  describe('isValidBusinessEmail', () => {
    it('should return false when email domain is included on the blacklist', () => {
      expect(
        yupCustomValidation.isValidBusinessEmail(
          '',
          EMAIL_DOMAIN_ADDRESS_BLACKLIST
        )
      ).toBe(false);
      expect(
        yupCustomValidation.isValidBusinessEmail(
          null,
          EMAIL_DOMAIN_ADDRESS_BLACKLIST
        )
      ).toBe(false);
      expect(
        yupCustomValidation.isValidBusinessEmail(
          undefined,
          EMAIL_DOMAIN_ADDRESS_BLACKLIST
        )
      ).toBe(false);
      expect(
        yupCustomValidation.isValidBusinessEmail(
          'user@hotmail.com',
          EMAIL_DOMAIN_ADDRESS_BLACKLIST
        )
      ).toBe(false);
      expect(
        yupCustomValidation.isValidBusinessEmail(
          'user@hotmail.co.id',
          EMAIL_DOMAIN_ADDRESS_BLACKLIST
        )
      ).toBe(false);
      expect(
        yupCustomValidation.isValidBusinessEmail(
          'user@gmail.com',
          EMAIL_DOMAIN_ADDRESS_BLACKLIST
        )
      ).toBe(false);
      expect(
        yupCustomValidation.isValidBusinessEmail(
          'user@yahoo.com',
          EMAIL_DOMAIN_ADDRESS_BLACKLIST
        )
      ).toBe(false);
      expect(
        yupCustomValidation.isValidBusinessEmail(
          'user@yahoo.co.id',
          EMAIL_DOMAIN_ADDRESS_BLACKLIST
        )
      ).toBe(false);
      expect(
        yupCustomValidation.isValidBusinessEmail(
          'user@live.com',
          EMAIL_DOMAIN_ADDRESS_BLACKLIST
        )
      ).toBe(false);
    });

    it('should return true when email domain is excluded from the blacklist', () => {
      expect(
        yupCustomValidation.isValidBusinessEmail(
          'user@domain.com',
          EMAIL_DOMAIN_ADDRESS_BLACKLIST
        )
      ).toBe(true);
      expect(
        yupCustomValidation.isValidBusinessEmail(
          'user@ayp-group.com',
          EMAIL_DOMAIN_ADDRESS_BLACKLIST
        )
      ).toBe(true);
    });
  });

  describe('isMinPasswordRequirementMeet', () => {
    it('should return false when password minimum requirement does not meet', () => {
      expect(yupCustomValidation.isMinPasswordRequirementMeet('')).toBe(false);
      expect(yupCustomValidation.isMinPasswordRequirementMeet(null)).toBe(
        false
      );
      expect(yupCustomValidation.isMinPasswordRequirementMeet(undefined)).toBe(
        false
      );
      expect(yupCustomValidation.isMinPasswordRequirementMeet('1')).toBe(false);
      expect(
        yupCustomValidation.isMinPasswordRequirementMeet('1234567890')
      ).toBe(false);
      expect(
        yupCustomValidation.isMinPasswordRequirementMeet('asdfghjkl')
      ).toBe(false);
      expect(
        yupCustomValidation.isMinPasswordRequirementMeet('!@#$%^&*(')
      ).toBe(false);
      expect(
        yupCustomValidation.isMinPasswordRequirementMeet('ASDFGHJKL')
      ).toBe(false);
      expect(yupCustomValidation.isMinPasswordRequirementMeet('A123djd')).toBe(
        false
      );
    });

    it('should return true when password minimum requirement has met', () => {
      expect(
        yupCustomValidation.isMinPasswordRequirementMeet('L666sssss')
      ).toBe(true);
      expect(
        yupCustomValidation.isMinPasswordRequirementMeet('USERs123456')
      ).toBe(true);
    });
  });

  describe('isArrayIncludeTruthyObject', () => {
    it('should return false when array so not contains any truthy objects', () => {
      expect(yupCustomValidation.isArrayIncludeTruthyObject(undefined)).toBe(
        false
      );
      expect(yupCustomValidation.isArrayIncludeTruthyObject(null)).toBe(false);
      expect(yupCustomValidation.isArrayIncludeTruthyObject([])).toBe(false);
      expect(yupCustomValidation.isArrayIncludeTruthyObject([{}])).toBe(false);
      expect(
        yupCustomValidation.isArrayIncludeTruthyObject([
          { foo: false },
          { bar: false },
        ])
      ).toBe(false);
    });

    it('should return true when password minimum requirement has met', () => {
      expect(
        yupCustomValidation.isArrayIncludeTruthyObject([{ foo: true }])
      ).toBe(true);

      expect(
        yupCustomValidation.isArrayIncludeTruthyObject([
          { foo: true },
          { bar: false },
        ])
      ).toBe(true);
    });
  });

  describe('isNotEmptyArray', () => {
    it('should return false when array does not contain any property', () => {
      expect(yupCustomValidation.isNotEmptyArray(undefined)).toBe(false);
      expect(yupCustomValidation.isNotEmptyArray(null)).toBe(false);
      expect(yupCustomValidation.isNotEmptyArray([])).toBe(false);
    });

    it('should return true when array has any property', () => {
      expect(yupCustomValidation.isNotEmptyArray([{ foo: true }])).toBe(true);
      expect(
        yupCustomValidation.isNotEmptyArray([{ id: 'abc' }, { id: 'cdf' }])
      ).toBe(true);
    });
  });
});
