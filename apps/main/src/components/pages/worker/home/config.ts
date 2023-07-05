import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

export const validationSchema = yup.object({
  companyId: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
});
