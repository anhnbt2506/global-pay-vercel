import { CompanyThailand } from '@ayp/typings/entities';
import { yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';

import {
  CONTAIN_ONLY_NUMERIC_ERROR_MESSAGE,
  CONTAIN_SPACES_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

export type FormValues = Omit<
  CompanyThailand,
  'id' | 'createdAt' | 'updatedAt'
>;

export const mapToRequestBody = (values: FormValues): Record<string, unknown> =>
  Object.assign({}, values);

export const validationSchema = yup.object({
  payrollCycle: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  payrollCutOffDate: yup
    .number()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  payrollDate: yup.number().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  prorateSalaryFormula: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  socialSecurityId: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .test({
      message: CONTAIN_ONLY_NUMERIC_ERROR_MESSAGE,
      test: (value) => yupCustomValidation.isNumeric(value),
    })
    .test({
      message: CONTAIN_SPACES_ERROR_MESSAGE,
      test: (value) => yupCustomValidation.isNotContainSpaces(value),
    }),
  isAypAssistESubmission: yup
    .boolean()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  ssoEFilingUsername: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  ssoEFilingPassword: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  revenueEFilingUsername: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  revenueEFilingPassword: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  isUsingDisbursementService: yup
    .boolean()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  companyAffidavitFile: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  payrollReportFile: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  ssoReportFile: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  pnd1ReportSinceJanuaryFile: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  pnd1ReportPreviousYearFile: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
});

export const initialValues: FormValues = {
  payrollCycle: null,
  payrollCutOffDate: null,
  payrollDate: null,
  prorateSalaryFormula: null,
  socialSecurityId: null,
  isAypAssistESubmission: null,
  ssoEFilingUsername: null,
  ssoEFilingPassword: null,
  revenueEFilingUsername: null,
  revenueEFilingPassword: null,
  isUsingDisbursementService: null,
  companyAffidavitFile: null,
  payrollReportFile: null,
  ssoReportFile: null,
  pnd1ReportSinceJanuaryFile: null,
  pnd1ReportPreviousYearFile: null,
};
