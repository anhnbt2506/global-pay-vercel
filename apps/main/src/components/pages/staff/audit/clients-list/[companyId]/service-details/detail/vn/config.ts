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
      fieldName: 'shuiCode',
      labelKey: 'shuiCode',
    },
    {
      fieldName: 'shuiProvider',
      labelKey: 'shuiProvider',
    },
    {
      fieldName: 'isAypAssistESubmission',
      labelKey: 'isAypAssistESubmission',
    },
    {
      fieldName: 'shuiUserId',
      labelKey: 'shuiUserId',
    },
    {
      fieldName: 'shuiPassword',
      labelKey: 'shuiPassword',
    },
    {
      fieldName: 'isUsingDisbursementService',
      labelKey: 'isUsingDisbursementService',
    },
  ],
  bankAccount: BANK_ACCOUNT_FIELDS,
};
