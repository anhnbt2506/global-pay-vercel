import { yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';

import {
  CONTAIN_ONLY_ALPHA_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

export interface FormValues {
  name: string;
}

export const validationSchema = yup.object({
  name: yup
    .string()
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .test({
      message: CONTAIN_ONLY_ALPHA_ERROR_MESSAGE,
      test: (value) => yupCustomValidation.isAlpha(value),
    }),
});
