import { CompanyIndonesia } from '@ayp/typings/entities';
import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

export type FormValues = Pick<
  CompanyIndonesia,
  | 'payrollCycle'
  | 'payrollDate'
  | 'prorateSalaryFormula'
  | 'prorateLeaveEncashmentFormula'
  | 'prorateUnpaidLeaveEncashmentFormula'
>;

export const initialValues: FormValues = {
  payrollCycle: null,
  payrollDate: null,
  prorateSalaryFormula: null,
  prorateLeaveEncashmentFormula: null,
  prorateUnpaidLeaveEncashmentFormula: null,
};

export const mapToRequestBody = (values: FormValues): Record<string, unknown> =>
  Object.assign({}, values);

export const validationSchema = yup.object({
  payrollCycle: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  payrollDate: yup.number().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  prorateSalaryFormula: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  prorateLeaveEncashmentFormula: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  prorateUnpaidLeaveEncashmentFormula: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
});
