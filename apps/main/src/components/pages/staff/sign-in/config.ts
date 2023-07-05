import * as yup from 'yup';

import {
  EMAIL_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

export interface StaffSignInFormValues {
  email: string;
  password: string;
}

export const initialValues: StaffSignInFormValues = {
  email: '',
  password: '',
};

export const validationSchema = yup.object({
  email: yup
    .string()
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .email(EMAIL_FIELD_ERROR_MESSAGE),
  password: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
});
