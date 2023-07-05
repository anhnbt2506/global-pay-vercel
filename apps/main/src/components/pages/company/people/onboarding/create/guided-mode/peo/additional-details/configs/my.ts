import { CountryCode } from '@ayp/typings/commons';
import * as yup from 'yup';

import { HIRING_COUNTRY_RULES } from '@configs/constants';
import {
  INVALID_INTEGER_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

const hiringCountryRule = HIRING_COUNTRY_RULES[CountryCode.MALAYSIA];

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

export const validationSchema = yup.object({
  additionalDetails: yup.object({
    probationPeriod: yup
      .number()
      .nullable()
      .integer(INVALID_INTEGER_FIELD_ERROR_MESSAGE)
      .min(hiringCountryRule.probationPeriod.min ?? 0, '')
      .max(hiringCountryRule.probationPeriod.max ?? 0, '')
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_INTEGER_FIELD_ERROR_MESSAGE),
    paidTimeOff: yup
      .number()
      .nullable()
      .integer(INVALID_INTEGER_FIELD_ERROR_MESSAGE)
      .min(hiringCountryRule.paidTimeOff.min ?? 0, '')
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_INTEGER_FIELD_ERROR_MESSAGE),
    sickTimeOff: yup
      .number()
      .nullable()
      .integer(INVALID_INTEGER_FIELD_ERROR_MESSAGE)
      .min(hiringCountryRule.sickTimeOff.min ?? 0, '')
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_INTEGER_FIELD_ERROR_MESSAGE),
    terminationNotice: yup
      .number()
      .nullable()
      .integer(INVALID_INTEGER_FIELD_ERROR_MESSAGE)
      .min(hiringCountryRule.terminationNotice.min ?? 0, '')
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_INTEGER_FIELD_ERROR_MESSAGE),
    isEligibleForInsurance: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
});
