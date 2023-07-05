import PasswordValidator from 'password-validator';

const MINIMUM_PASSWORD_REQUIREMENT = new PasswordValidator()
  .is()
  .min(8)
  .has()
  .lowercase()
  .has()
  .uppercase()
  .has()
  .digits();

export const validatePasswordRequirement = (password = ''): string[] =>
  MINIMUM_PASSWORD_REQUIREMENT.validate(password, {
    list: true,
  }) as string[];
