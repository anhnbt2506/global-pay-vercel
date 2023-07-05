import { CompanyPhilippines, PayrollCycle } from '@ayp/typings/entities';
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
    CompanyPhilippines,
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
  statutoryDeductions: yup
    .string()
    .nullable()
    .when('payrollCycle', (payrollCycle, schema) =>
      payrollCycle === PayrollCycle.SEMI_MONTHLY
        ? yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE)
        : schema
    ),
  payrollCutOffDate: yup
    .number()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  payrollDate: yup.number().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  secondPayrollCutOffDate: yup
    .string()
    .nullable()
    .when('payrollCycle', (payrollCycle, schema) =>
      payrollCycle === PayrollCycle.SEMI_MONTHLY
        ? yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE)
        : schema
    ),
  secondPayrollDate: yup
    .string()
    .nullable()
    .when('payrollCycle', (payrollCycle, schema) =>
      payrollCycle === PayrollCycle.SEMI_MONTHLY
        ? yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE)
        : schema
    ),
  prorateSalaryFormula: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
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
  sssUserId: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', (isAypAssistESubmission, schema) =>
      isAypAssistESubmission
        ? yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE)
        : schema
    ),
  sssPassword: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', (isAypAssistESubmission, schema) =>
      isAypAssistESubmission
        ? yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE)
        : schema
    ),
  penId: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', (isAypAssistESubmission, schema) =>
      isAypAssistESubmission
        ? yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE)
        : schema
    ),
  penPassword: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', (isAypAssistESubmission, schema) =>
      isAypAssistESubmission
        ? yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE)
        : schema
    ),
  birTinId: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', (isAypAssistESubmission, schema) =>
      isAypAssistESubmission
        ? yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE)
        : schema
    ),
  birUsername: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', (isAypAssistESubmission, schema) =>
      isAypAssistESubmission
        ? yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE)
        : schema
    ),
  birPassword: yup
    .string()
    .nullable()
    .when('isAypAssistESubmission', (isAypAssistESubmission, schema) =>
      isAypAssistESubmission
        ? yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE)
        : schema
    ),
  birSecurityQuestionAnswer: yup
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
  secRegistrationFile: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  bir2303File: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  sssFile: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  penFile: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  pagFile: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
});

export const initialValues: FormValues = {
  payrollCycle: null,
  statutoryDeductions: null,
  payrollCutOffDate: null,
  payrollDate: null,
  secondPayrollCutOffDate: null,
  secondPayrollDate: null,
  prorateSalaryFormula: null,
  isAypAssistESubmission: null,
  sssUserId: null,
  sssPassword: null,
  penId: null,
  penPassword: null,
  birTinId: null,
  birUsername: null,
  birPassword: null,
  birSecurityQuestionAnswer: null,
  isUsingDisbursementService: null,
  isGenerateBankFile: null,
  bankAccount: initialBankAccount,
  secRegistrationFile: null,
  bir2303File: null,
  sssFile: null,
  penFile: null,
  pagFile: null,
};
