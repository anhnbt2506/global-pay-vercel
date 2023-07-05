import { CompanyHongKong } from '@ayp/typings/entities';
import { yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';
import { isEmpty } from 'lodash-es';

import {
  CONTAIN_ONLY_ALPHA_AND_NUMERIC_AND_DASH_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

import {
  bankAccountValidationSchema,
  initialBankAccount,
} from '../commons/config';
import { BankAccountFormType } from '../config';

export interface FormValues
  extends Omit<
    CompanyHongKong,
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
  mpfProvider: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  mpfSubSchemeNumber: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .test({
      message: CONTAIN_ONLY_ALPHA_AND_NUMERIC_AND_DASH_ERROR_MESSAGE,
      test: (value) => yupCustomValidation.isAlphaNumericDash(value),
    }),
  isAypAssistESubmission: yup
    .boolean()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  mpfUsername: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  mpfPassword: yup
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
  mpfProvider: null,
  mpfSubSchemeNumber: null,
  isAypAssistESubmission: null,
  mpfUsername: null,
  mpfPassword: null,
  isUsingDisbursementService: null,
  bankAccount: initialBankAccount,
  isGenerateBankFile: null,
};
