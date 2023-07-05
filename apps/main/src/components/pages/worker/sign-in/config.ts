import { yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';

import {
  EMAIL_FIELD_ERROR_MESSAGE,
  INVALID_PASSWORD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

export enum WorkerSignInPage {
  EMAIL_VALIDATION,
  EMAIL_VERIFICATION,
  SET_PASSWORD,
  LOGIN,
  EMAIL_VERIFICATION_TOKEN_EXPIRED,
}

export interface WorkerSignInFormValues {
  email: string;
  password: string;
}

export const initialValues = {
  email: '',
  password: '',
};

export const validationSchema = [
  yup.object({
    email: yup
      .string()
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .email(EMAIL_FIELD_ERROR_MESSAGE),
  }),
  undefined,
  yup.object({
    password: yup
      .string()
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .test({
        message: INVALID_PASSWORD_ERROR_MESSAGE,
        test: (value) =>
          yupCustomValidation.isMinPasswordRequirementMeet(value),
      }),
  }),
  yup.object({
    email: yup
      .string()
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .email(EMAIL_FIELD_ERROR_MESSAGE),
    password: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
];
