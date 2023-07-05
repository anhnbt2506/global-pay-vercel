import { CompanyPhilippines, PayrollCycle } from '@ayp/typings/entities';
import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

export type FormValues = Pick<
  CompanyPhilippines,
  'payrollCycle' | 'payrollDate' | 'prorateSalaryFormula' | 'secondPayrollDate'
>;

export const initialValues: FormValues = {
  payrollCycle: null,
  payrollDate: null,
  secondPayrollDate: null,
  prorateSalaryFormula: null,
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
  secondPayrollDate: yup
    .string()
    .nullable()
    .when('payrollCycle', (payrollCycle, schema) =>
      payrollCycle === PayrollCycle.SEMI_MONTHLY
        ? yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE)
        : schema
    ),
});
