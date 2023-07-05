import { yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';

import {
  CONTAIN_ONLY_ALPHA_AND_NUMERIC_AND_DASH_ERROR_MESSAGE,
  CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
  CONTAIN_SPACES_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

export const mapIdentification = (
  workerIdentity: Record<string, unknown>
): Record<string, unknown> => Object.assign({}, workerIdentity);

export const validationSchema = yup.object({
  workerIdentity: yup.object().shape({
    passportNumber: yup
      .string()
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
  additionalInfo: yup.object({
    cpfNumber: yup
      .string()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .test({
        message: CONTAIN_ONLY_ALPHA_AND_NUMERIC_AND_DASH_ERROR_MESSAGE,
        test: (value) => yupCustomValidation.isAlphaNumericDash(value),
      }),
  }),
});
