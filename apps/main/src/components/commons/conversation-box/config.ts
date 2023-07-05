import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

export interface ConversationFormValues {
  content: string;
}

export const initialValues = {
  content: '',
};

export const validationSchema = yup.object({
  content: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
});
