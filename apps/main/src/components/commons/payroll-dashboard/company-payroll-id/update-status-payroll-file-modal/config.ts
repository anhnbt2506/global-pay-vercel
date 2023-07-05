import { CompanyPayrollStatus } from '@ayp/typings/entities';
import * as yup from 'yup';

export interface UpdateStatusFormValues {
  status: CompanyPayrollStatus;
}

export const validationSchema = yup.object({
  status: yup.string(),
});
