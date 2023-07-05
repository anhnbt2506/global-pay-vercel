import { CountryCode } from '@ayp/typings/commons';
import * as yup from 'yup';

import { HIRING_COUNTRY_RULES } from '@configs/constants';
import {
  INVALID_INTEGER_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

const hiringCountryRule = HIRING_COUNTRY_RULES[CountryCode.THAILAND];

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
      .integer(INVALID_INTEGER_FIELD_ERROR_MESSAGE)
      .min(hiringCountryRule.probationPeriod.min ?? 0, '')
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
    isEligibleForVariablePay: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    variablePayDescription: yup
      .string()
      .nullable()
      .when('isEligibleForVariablePay', {
        is: true,
        then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
      }),
    isEligibleForAnnualBonus: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    annualBonusDescription: yup
      .string()
      .nullable()
      .when('isEligibleForAnnualBonus', {
        is: true,
        then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
      }),
    isEligibleForCommission: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    commissionDescription: yup
      .string()
      .nullable()
      .when('isEligibleForCommission', {
        is: true,
        then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
      }),
  }),
});
