import { yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';

import {
  CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
  CONTAIN_SPACES_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

export const mapAdditionalInformation = (
  additionalInfo: Record<string, unknown>
): Record<string, unknown> => Object.assign({}, { additionalInfo });

export const validationSchema = yup.object({
  workerIdentity: yup.object({
    passportFile: yup.mixed().required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
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
