import { CompanyMalaysia } from '@ayp/typings/entities';
import { yupCustomValidation } from '@ayp/utils';
import { isEmpty } from 'lodash-es';
import * as yup from 'yup';

import {
  CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
  CONTAIN_ONLY_NUMERIC_ERROR_MESSAGE,
  EMAIL_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

import {
  bankAccountValidationSchema,
  initialBankAccount,
} from '../commons/config';
import { BankAccountFormType } from '../config';

export interface FormValues
  extends Omit<
    CompanyMalaysia,
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
  epfNumber: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .test({
      message: CONTAIN_ONLY_NUMERIC_ERROR_MESSAGE,
      test: (value) => yupCustomValidation.isNumeric(value),
    }),
  socsoNumber: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .test({
      message: CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
      test: (value) => yupCustomValidation.isAlphaNumeric(value),
    }),
  eisNumber: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .test({
      message: CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
      test: (value) => yupCustomValidation.isAlphaNumeric(value),
    }),
  isAypAssistESubmission: yup
    .boolean()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  socsoEmail: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', (isAypAssistESubmission, schema) =>
      isAypAssistESubmission
        ? yup
            .string()
            .nullable()
            .required(REQUIRED_FIELD_ERROR_MESSAGE)
            .email(EMAIL_FIELD_ERROR_MESSAGE)
        : schema
    ),
  socsoPassword: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  epfUserId: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  epfPassword: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  cp39UserId: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  cp39Password: yup
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
  payrollDate: null,
  payrollCutOffDate: null,
  prorateSalaryFormula: null,
  epfNumber: null,
  socsoNumber: null,
  eisNumber: null,
  isAypAssistESubmission: null,
  socsoEmail: null,
  socsoPassword: null,
  epfUserId: null,
  epfPassword: null,
  cp39UserId: null,
  cp39Password: null,
  isUsingDisbursementService: null,
  bankAccount: initialBankAccount,
  isGenerateBankFile: null,
};
