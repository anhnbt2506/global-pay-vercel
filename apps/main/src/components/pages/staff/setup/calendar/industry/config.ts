import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

export interface IndustryModalFormValues {
  name: string;
}

export const validationSchema = yup.object({
  name: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
});
