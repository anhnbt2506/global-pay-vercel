import { yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';

import {
  CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
  CONTAIN_SPACES_ERROR_MESSAGE,
  INVALID_DATE_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

export const mapIdentification = (
  workerIdentity: Record<string, unknown>
): Record<string, unknown> => Object.assign({}, workerIdentity);

export const validationSchema = yup.object({
  workerIdentity: yup.object().shape({
    nationalId: yup
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
    nationalIdIssuedDate: yup
      .date()
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_DATE_FIELD_ERROR_MESSAGE),
  }),
});
