import { CountryCode } from '@ayp/typings/commons';
import * as yup from 'yup';

import { HIRING_COUNTRY_RULES } from '@configs/constants';
import {
  INVALID_INTEGER_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

export const mapAdditionalDetails = (
  additionalDetails: Record<string, unknown>
): Record<string, unknown> =>
  Object.assign(
    {},
    {
      probationPeriodUnit: hiringCountryRule.probationPeriod.unit,
      terminationNoticeUnit: hiringCountryRule.terminationNotice.unit,
    },
    { additionalDetails }
  );

const hiringCountryRule = HIRING_COUNTRY_RULES[CountryCode.PHILIPPINES];

export const validationSchema = yup.object({
  additionalDetails: yup.object({
    probationPeriod: yup
      .number()
      .integer(INVALID_INTEGER_FIELD_ERROR_MESSAGE)
      .equals([hiringCountryRule.probationPeriod.value], '')
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_INTEGER_FIELD_ERROR_MESSAGE),
    paidTimeOff: yup
      .number()
      .integer(INVALID_INTEGER_FIELD_ERROR_MESSAGE)
      .min(hiringCountryRule.paidTimeOff.min ?? 0, '')
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_INTEGER_FIELD_ERROR_MESSAGE),
    sickTimeOff: yup
      .number()
      .integer(INVALID_INTEGER_FIELD_ERROR_MESSAGE)
      .min(hiringCountryRule.sickTimeOff.min ?? 0, '')
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_INTEGER_FIELD_ERROR_MESSAGE),
    terminationNotice: yup
      .number()
      .integer(INVALID_INTEGER_FIELD_ERROR_MESSAGE)
      .min(hiringCountryRule.terminationNotice.min ?? 0, '')
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_INTEGER_FIELD_ERROR_MESSAGE),
    isEligibleForInsurance: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    fieldManagerialType: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
    isEntitledToOvertimeDifferential: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    compassionateTimeOff: yup
      .number()
      .integer(INVALID_INTEGER_FIELD_ERROR_MESSAGE)
      .min(hiringCountryRule.compassionateTimeOff.min ?? 0, '')
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_INTEGER_FIELD_ERROR_MESSAGE),
    monthlyAllowance: yup.number().required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
});
