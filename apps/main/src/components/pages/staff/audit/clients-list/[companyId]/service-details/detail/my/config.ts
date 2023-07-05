import { BANK_ACCOUNT_FIELDS } from '../commons/configs';

export const SERVICE_DETAILS_FIELDS = {
  commonFields: [
    {
      fieldName: 'payrollCycle',
      labelKey: 'payrollCycle',
    },
    {
      fieldName: 'payrollDate',
      labelKey: 'payrollDate',
    },
    {
      fieldName: 'payrollCutOffDate',
      labelKey: 'payrollCutOffDate',
    },
    {
      fieldName: 'prorateSalaryFormula',
      labelKey: 'prorateSalaryFormula',
    },
    {
      fieldName: 'epfNumber',
      labelKey: 'epfNumber',
    },
    {
      fieldName: 'socsoNumber',
      labelKey: 'socsoNumber',
    },
    {
      fieldName: 'eisNumber',
      labelKey: 'eisNumber',
    },
    {
      fieldName: 'isAypAssistESubmission',
      labelKey: 'isAypAssistESubmission',
    },
    {
      fieldName: 'socsoEmail',
      labelKey: 'socsoEmail',
    },
    {
      fieldName: 'socsoPassword',
      labelKey: 'socsoPassword',
    },
    {
      fieldName: 'epfUserId',
      labelKey: 'epfUserId',
    },
    {
      fieldName: 'epfPassword',
      labelKey: 'epfPassword',
    },
    {
      fieldName: 'cp39UserId',
      labelKey: 'cp39UserId',
    },
    {
      fieldName: 'cp39Password',
      labelKey: 'cp39Password',
    },
    {
      fieldName: 'isUsingDisbursementService',
      labelKey: 'isUsingDisbursementService',
    },
  ],
  bankAccount: BANK_ACCOUNT_FIELDS,
};
