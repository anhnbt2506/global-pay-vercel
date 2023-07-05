import { CompanyVietnam } from '@ayp/typings/entities';
import { yupCustomValidation } from '@ayp/utils';
import { isEmpty } from 'lodash-es';
import * as yup from 'yup';

import {
  CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

import {
  bankAccountValidationSchema,
  initialBankAccount,
} from '../commons/config';
import { BankAccountFormType } from '../config';

export interface FormValues
  extends Omit<
    CompanyVietnam,
    'id' | 'createdAt' | 'updatedAt' | 'bankAccount'
  > {
  bankAccount: BankAccountFormType;
}

export const mapToRequestBody = (
  values: FormValues
): Record<string, unknown> => {
  const { bankAccount, isGenerateBankFile } = values;
  const bankAccountParam =
    isGenerateBankFile && bankAccount && !isEmpty(bankAccount)
      ? { ...bankAccount, bankId: bankAccount.bankId?.id }
      : null;

  return {
    ...values,
    bankAccount: bankAccountParam,
  };
};

export const validationSchema = yup.object({
  payrollCycle: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  payrollDate: yup.number().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  payrollCutOffDate: yup
    .number()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  prorateSalaryFormula: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),

  shuiCode: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .test({
      message: CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
      test: (value) => yupCustomValidation.isAlphaNumeric(value),
    }),
  shuiProvider: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  isAypAssistESubmission: yup
    .boolean()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  isUsingDisbursementService: yup
    .boolean()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  isGenerateBankFile: yup
    .boolean()
    .nullable()
    .when('isUsingDisbursementService', {
      is: false,
      then: yup.boolean().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  shuiUserId: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', (isAypAssistESubmission, schema) =>
      isAypAssistESubmission
        ? yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE)
        : schema
    ),
  shuiPassword: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', (isAypAssistESubmission, schema) =>
      isAypAssistESubmission
        ? yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE)
        : schema
    ),
  bankAccount: yup
    .object()
    .nullable()
    .when('isGenerateBankFile', (isGenerateBankFile, schema) =>
      !!isGenerateBankFile ? bankAccountValidationSchema : schema
    ),
  businessLicenceFile: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  payrollReportFile: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  pitReportSinceQ1File: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  pitReportLastYearFile: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  shuiReportFile: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  labourContractsFile: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
});

export const initialValues: FormValues = {
  payrollCycle: null,
  payrollCutOffDate: null,
  payrollDate: null,
  prorateSalaryFormula: null,
  shuiCode: null,
  shuiProvider: null,
  isAypAssistESubmission: null,
  isUsingDisbursementService: null,
  shuiUserId: null,
  shuiPassword: null,
  bankAccount: initialBankAccount,
  businessLicenceFile: null,
  payrollReportFile: null,
  pitReportSinceQ1File: null,
  pitReportLastYearFile: null,
  shuiReportFile: null,
  labourContractsFile: null,
  isGenerateBankFile: null,
};
