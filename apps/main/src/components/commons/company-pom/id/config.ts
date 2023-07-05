import { CompanyIndonesia } from '@ayp/typings/entities';
import { isEmpty } from 'lodash-es';
import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

import {
  bankAccountValidationSchema,
  initialBankAccount,
} from '../commons/config';
import { BankAccountFormType } from '../config';

export interface FormValues
  extends Omit<
    CompanyIndonesia,
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
  payrollCutOffDate: yup
    .number()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
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
  contributionForBpjsOnSalary: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  isAypAssistESubmission: yup
    .boolean()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  djpTaxNumberId: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  djpPassword: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  eDabuId: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  eDabuPassword: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  sippId: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  sippPassword: yup
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
  isGenerateBankFile: yup
    .boolean()
    .nullable()
    .when('isUsingDisbursementService', {
      is: false,
      then: yup.boolean().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  bankAccount: yup
    .object()
    .nullable()
    .when('isGenerateBankFile', (isGenerateBankFile, schema) =>
      !!isGenerateBankFile ? bankAccountValidationSchema : schema
    ),
});

export const initialValues: FormValues = {
  payrollCycle: null,
  payrollCutOffDate: null,
  payrollDate: null,
  prorateSalaryFormula: null,
  prorateLeaveEncashmentFormula: null,
  prorateUnpaidLeaveEncashmentFormula: null,
  contributionForBpjsOnSalary: null,
  isAypAssistESubmission: null,
  djpTaxNumberId: null,
  djpPassword: null,
  eDabuId: null,
  eDabuPassword: null,
  sippId: null,
  sippPassword: null,
  isUsingDisbursementService: null,
  bankAccount: initialBankAccount,
  isGenerateBankFile: null,
};
