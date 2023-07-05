import type { YupArray, YupDate, YupString } from '@ayp/typings/commons';
import { isAfter, isValid } from 'date-fns';

import { validatePasswordRequirement } from './validate-password-requirement';

const isDateAfter = (value: YupDate, valueToCompare: YupDate): boolean => {
  if (!value || !valueToCompare) return false;

  const date = new Date(value);
  const dateToCompare = new Date(valueToCompare);

  if (!isValid(dateToCompare) || !isValid(date)) return false;

  return isAfter(date, dateToCompare);
};

const isValidNumber = (value: YupString) => !isNaN(parseInt(value ?? ''));
const isNotContainSpaces = (value: YupString) => !value?.includes(' ');
const isAlpha = (value: YupString) =>
  value ? /^[aA-zZ ]+$/i.test(value) : true;
const isNumeric = (value: YupString) =>
  value ? /^[0-9 ]+$/i.test(value) : true;
const isAlphaNumeric = (value: YupString) =>
  value ? /^[aA-zZ0-9 ]+$/i.test(value) : true;
const isAlphaNumericDash = (value: YupString) =>
  value ? /^[aA-zZ0-9\-]+$/i.test(value) : true;

const isValidBusinessEmail = (
  email: YupString,
  emailDomainAddressBlacklist: string[]
): boolean =>
  !!email &&
  !emailDomainAddressBlacklist.find((domain) => email.includes(domain));

export const isMinPasswordRequirementMeet = (password: YupString): boolean =>
  !validatePasswordRequirement(password ?? '').length;

const isArrayIncludeTruthyObject = (
  arr: YupArray<Record<string, unknown>>
): boolean =>
  !!arr?.some(
    (item: { [s: string]: unknown } | ArrayLike<unknown>) =>
      item && Object.values(item).some((i) => i)
  );

const isNotEmptyArray = (arr: YupArray<Record<string, unknown>>): boolean =>
  !!arr?.length;

export const yupCustomValidation = {
  isDateAfter,
  isValidNumber,
  isValidBusinessEmail,
  isMinPasswordRequirementMeet,
  isNotContainSpaces,
  isAlpha,
  isNumeric,
  isAlphaNumeric,
  isAlphaNumericDash,
  isArrayIncludeTruthyObject,
  isNotEmptyArray,
};
