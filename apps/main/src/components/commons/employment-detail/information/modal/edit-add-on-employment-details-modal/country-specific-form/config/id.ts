import * as yup from 'yup';
import { CountryCode } from '@ayp/typings/commons';

import {
  INVALID_INTEGER_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';
import { HIRING_COUNTRY_RULES } from '@configs/constants';

import { WorkerEmploymentFormValues } from '../../../../config';

const hiringCountryRule = HIRING_COUNTRY_RULES[CountryCode.INDONESIA];

export const mapToRequestBody = (
  state: WorkerEmploymentFormValues
): Record<string, unknown> =>
  Object.assign(
    {},
    {
      probationPeriod: state.probationPeriod,
      additionalInfo: {
        religiousFestivityAllowance:
          state.additionalInfo.religiousFestivityAllowance,
      },
    }
  );

export const validationSchema = yup.object({
  probationPeriod: yup
    .number()
    .nullable()
    .integer(INVALID_INTEGER_FIELD_ERROR_MESSAGE)
    .min(hiringCountryRule.probationPeriod.min ?? 0, '')
    .max(hiringCountryRule.probationPeriod.max ?? 0, '')
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .typeError(INVALID_INTEGER_FIELD_ERROR_MESSAGE),
  additionalInfo: yup.object({
    religiousFestivityAllowance: yup
      .number()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
});
