import * as yup from 'yup';
import { yupCustomValidation } from '@ayp/utils';
import { CountryCode } from '@ayp/typings/commons';

import {
  CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
  CONTAIN_ONLY_NUMERIC_ERROR_MESSAGE,
  CONTAIN_SPACES_ERROR_MESSAGE,
  INVALID_INTEGER_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';
import { HIRING_COUNTRY_RULES } from '@configs/constants';

import { WorkerEmploymentFormValues } from '../../../../config';

const hiringCountryRule = HIRING_COUNTRY_RULES[CountryCode.PHILIPPINES];

export const mapToRequestBody = (
  state: WorkerEmploymentFormValues
): Record<string, unknown> =>
  Object.assign(
    {},
    {
      probationPeriod: state.probationPeriod,
      workerRemuneration: {
        monthlyAllowance: state.workerRemuneration.monthlyAllowance,
      },
      additionalInfo: {
        fieldManagerialType: state.additionalInfo.fieldManagerialType,
        isEntitledToOvertimeDifferential:
          state.additionalInfo.isEntitledToOvertimeDifferential,
        hdmfId: state.additionalInfo.hdmfId,
        healthId: state.additionalInfo.healthId,
        tinId: state.additionalInfo.tinId,
        sssId: state.additionalInfo.sssId,
      },
    }
  );

export const validationSchema = yup.object({
  probationPeriod: yup
    .number()
    .nullable()
    .integer(INVALID_INTEGER_FIELD_ERROR_MESSAGE)
    .equals([hiringCountryRule.probationPeriod.value], '')
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .typeError(INVALID_INTEGER_FIELD_ERROR_MESSAGE),
  workerRemuneration: yup.object({
    monthlyAllowance: yup
      .number()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
  additionalInfo: yup.object({
    fieldManagerialType: yup
      .string()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    isEntitledToOvertimeDifferential: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    hdmfId: yup
      .string()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .test({
        message: CONTAIN_ONLY_NUMERIC_ERROR_MESSAGE,
        test: (value) => yupCustomValidation.isNumeric(value),
      })
      .test({
        message: CONTAIN_SPACES_ERROR_MESSAGE,
        test: (value) => yupCustomValidation.isNotContainSpaces(value),
      }),
    healthId: yup
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
    tinId: yup
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
    sssId: yup
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
