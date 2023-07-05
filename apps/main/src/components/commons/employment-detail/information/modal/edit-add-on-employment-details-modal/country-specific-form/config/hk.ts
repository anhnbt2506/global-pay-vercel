import * as yup from 'yup';
import { yupCustomValidation } from '@ayp/utils';
import { CountryCode } from '@ayp/typings/commons';

import {
  CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
  CONTAIN_SPACES_ERROR_MESSAGE,
  INVALID_INTEGER_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';
import { HIRING_COUNTRY_RULES } from '@configs/constants';

import { WorkerEmploymentFormValues } from '../../../../config';

const hiringCountryRule = HIRING_COUNTRY_RULES[CountryCode.HONGKONG];

export const mapToRequestBody = (
  state: WorkerEmploymentFormValues
): Record<string, unknown> =>
  Object.assign(
    {},
    {
      probationPeriod: state.probationPeriod,
      additionalInfo: {
        mpfId: state.additionalInfo.mpfId,
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
    mpfId: yup
      .string()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .test({
        message: CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
        test: (value) => yupCustomValidation.isAlphaNumeric(value),
      })
      .test({
        message: CONTAIN_SPACES_ERROR_MESSAGE,
        test: (value) => yupCustomValidation.isNotContainSpaces(value),
      }),
  }),
});
