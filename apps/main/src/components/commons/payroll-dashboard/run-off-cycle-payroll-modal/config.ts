import { yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';
import { CountryOption, Option } from '@ayp/typings/ui';
import { HireType } from '@ayp/typings/entities';
import { format } from 'date-fns';

import {
  INVALID_DATE_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';
import { GP_BACKEND_DATE_FORMAT } from '@configs/constants';
import { CreateRunOffPayrollCycle } from '@services/apis/fintech';

export interface FormValues {
  name: string;
  company: Nullable<Option<string>>;
  country: Nullable<CountryOption>;
  hireType: Nullable<HireType>;
  periodStartDate: Nullable<Date>;
  periodEndDate: Nullable<Date>;
  payDate: Nullable<Date>;
  workerEmployments: Option<string>[];
}

export const mapToRequestBody = (
  state: FormValues
): CreateRunOffPayrollCycle => ({
  name: state.name,
  companyId: state.company?.id ?? '',
  countryCode: state.country?.code,
  hireType: state.hireType,
  periodStartDate:
    (state.periodStartDate &&
      format(state.periodStartDate, GP_BACKEND_DATE_FORMAT)) ??
    '',
  periodEndDate:
    (state.periodEndDate &&
      format(state.periodEndDate, GP_BACKEND_DATE_FORMAT)) ??
    '',
  payDate:
    (state.payDate && format(state.payDate, GP_BACKEND_DATE_FORMAT)) ?? '',
  workerEmployments: state.workerEmployments.map((user) => user.id),
});

export const initialValues: FormValues = {
  name: '',
  company: null,
  country: null,
  hireType: null,
  periodStartDate: null,
  periodEndDate: null,
  payDate: null,
  workerEmployments: [],
};

const commonSchema = {
  name: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
  country: yup.object().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  hireType: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  periodStartDate: yup
    .date()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .typeError(INVALID_DATE_FIELD_ERROR_MESSAGE),
  periodEndDate: yup
    .date()
    .nullable()
    .typeError(INVALID_DATE_FIELD_ERROR_MESSAGE)
    .test({
      message:
        'payroll-run-off-cycle-payroll-modal:runOffCyclePayrolLModal.form.periodEndDate.error.periodEndDateMustBeLaterThanPeriodStartDate',
      test: function (value) {
        return yupCustomValidation.isDateAfter(
          value,
          this.parent.periodStartDate
        );
      },
    }),
  payDate: yup
    .date()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .typeError(INVALID_DATE_FIELD_ERROR_MESSAGE),
  workerEmployments: yup.array().min(1, REQUIRED_FIELD_ERROR_MESSAGE),
};

export const validationSchemaForStaff = yup.object({
  ...commonSchema,
  company: yup.object().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
});

export const validationSchemaForCompany = yup.object({
  ...commonSchema,
});
