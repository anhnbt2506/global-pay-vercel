import { BANK_ACCOUNT_FIELDS } from '../commons/configs';

export const SERVICE_DETAILS_FIELDS = {
  commonFields: [
    {
      fieldName: 'payrollCycle',
      labelKey: 'payrollCycle',
    },
    {
      fieldName: 'payrollCutOffDate',
      labelKey: 'payrollCutOffDate',
    },
    {
      fieldName: 'payrollDate',
      labelKey: 'payrollDate',
    },
    {
      fieldName: 'prorateSalaryFormula',
      labelKey: 'prorateSalaryFormula',
    },
    {
      fieldName: 'mpfProvider',
      labelKey: 'mpfProvider',
    },
    {
      fieldName: 'mpfSubSchemeNumber',
      labelKey: 'mpfSubSchemeNumber',
    },
    {
      fieldName: 'isAypAssistESubmission',
      labelKey: 'isAypAssistESubmission',
    },
    {
      fieldName: 'mpfUsername',
      labelKey: 'mpfUsername',
    },
    {
      fieldName: 'mpfPassword',
      labelKey: 'mpfPassword',
    },
    {
      fieldName: 'isUsingDisbursementService',
      labelKey: 'isUsingDisbursementService',
    },
  ],
  bankAccount: BANK_ACCOUNT_FIELDS,
};
