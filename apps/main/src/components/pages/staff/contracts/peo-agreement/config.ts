import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

export interface StaffContractsPeoAgreementFormValues {
  content: string;
}

export const validationSchema = yup.object({
  content: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
});
