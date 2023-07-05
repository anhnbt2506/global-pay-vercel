import * as yup from 'yup';

import {
  EMAIL_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

export enum CompanySignInPage {
  EMAIL_VALIDATION,
  EMAIL_VERIFICATION,
  LOGIN,
}
export interface CompanySignInFormValues {
  email: string;
  password: string;
}

export const initialValues: CompanySignInFormValues = {
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
  yup.object({
    email: yup
      .string()
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .email(EMAIL_FIELD_ERROR_MESSAGE),
    password: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
];
