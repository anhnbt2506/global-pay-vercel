import {
  CompanyPomSgCpfSubmissionPlatform,
  CompanyPomSgESubmissionServices,
  CompanySingapore,
} from '@ayp/typings/entities';
import { yupCustomValidation } from '@ayp/utils';
import { isEmpty } from 'lodash-es';
import * as yup from 'yup';

import {
  CONTAIN_ONLY_ALPHA_AND_NUMERIC_AND_DASH_ERROR_MESSAGE,
  REQUIRED_AT_LEAST_SINGLE_SELECTION_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

import {
  bankAccountValidationSchema,
  initialBankAccount,
} from '../commons/config';
import { BankAccountFormType } from '../config';

export interface FormValues<ESubmissionServicesType>
  extends Omit<
    CompanySingapore,
    'id' | 'createdAt' | 'updatedAt' | 'eSubmissionServices' | 'bankAccount'
  > {
  eSubmissionServices: Nullable<ESubmissionServicesType>;
  bankAccount: BankAccountFormType;
}

export type FormFieldValues = FormValues<Record<string, boolean>[]>;
export type FormValueFromApi = FormValues<CompanyPomSgESubmissionServices[]>;

export const eSubmissionServicesList = [
  CompanyPomSgESubmissionServices.CPF_SERVICES,
  CompanyPomSgESubmissionServices.CPF_EZPAY,
  CompanyPomSgESubmissionServices.EMPLOYMENT_INCOME_RECORDS,
  CompanyPomSgESubmissionServices.TAX_CLEARANCE,
  CompanyPomSgESubmissionServices.GPL_PORTAL,
  CompanyPomSgESubmissionServices.MINDEF_PORTAL,
];

export const mapInitialESubmissionServices = (
  data: FormValueFromApi['eSubmissionServices']
): Nullable<Record<string, boolean>[]> => {
  if (!data) return null;

  return eSubmissionServicesList.map((item) => ({
    [item]: data.includes(item),
  }));
};

export const mapToRequestBody = (
  values: FormFieldValues
): Record<string, unknown> => {
  const {
    eSubmissionServices,
    bankAccount,
    isAypAssistESubmission,
    isGenerateBankFile,
  } = values;
  const eSubmissionServicesParam =
    eSubmissionServices && isAypAssistESubmission
      ? eSubmissionServices
          .filter((item) => Object.values(item).some((i) => i))
          .flatMap((item) => Object.keys(item))
      : null;

  const bankAccountParam =
    isGenerateBankFile && bankAccount && !isEmpty(bankAccount)
      ? { ...bankAccount, bankId: bankAccount.bankId?.id }
      : null;

  return {
    ...values,
    eSubmissionServices: eSubmissionServicesParam,
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
  cpfFilingNumber: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .test({
      message: CONTAIN_ONLY_ALPHA_AND_NUMERIC_AND_DASH_ERROR_MESSAGE,
      test: (value) => yupCustomValidation.isAlphaNumericDash(value),
    }),
  cpfSubmissionPlatform: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  crimsonLogicUsername: yup
    .string()
    .nullable()
    .when('cpfSubmissionPlatform', (cpfSubmissionPlatform, schema) =>
      cpfSubmissionPlatform !== CompanyPomSgCpfSubmissionPlatform.CRIMSON_LOGIC
        ? schema
        : yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE)
    ),
  crimsonLogicPassword: yup
    .string()
    .nullable()
    .when('cpfSubmissionPlatform', (cpfSubmissionPlatform, schema) =>
      cpfSubmissionPlatform !== CompanyPomSgCpfSubmissionPlatform.CRIMSON_LOGIC
        ? schema
        : yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE)
    ),
  cpfPaymentMode: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  isAypAssistESubmission: yup
    .boolean()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  eSubmissionServices: yup
    .array()
    .nullable()
    .when('isAypAssistESubmission', (isAypAssistESubmission, schema) =>
      !isAypAssistESubmission
        ? schema
        : yup
            .array()
            .nullable()
            .test({
              message: REQUIRED_AT_LEAST_SINGLE_SELECTION_FIELD_ERROR_MESSAGE,
              test: (arr) =>
                yupCustomValidation.isArrayIncludeTruthyObject(arr),
            })
    ),
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

export const initialValues = {
  payrollCycle: null,
  payrollDate: null,
  payrollCutOffDate: null,
  prorateSalaryFormula: null,
  cpfFilingNumber: null,
  cpfSubmissionPlatform: null,
  crimsonLogicUsername: null,
  crimsonLogicPassword: null,
  cpfPaymentMode: null,
  isAypAssistESubmission: null,
  eSubmissionServices: null,
  isUsingDisbursementService: null,
  bankAccount: initialBankAccount,
  isGenerateBankFile: null,
};
