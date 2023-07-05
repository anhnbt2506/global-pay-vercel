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
      fieldName: 'socialSecurityId',
      labelKey: 'socialSecurityId',
    },
    {
      fieldName: 'isAypAssistESubmission',
      labelKey: 'isAypAssistESubmission',
    },
    {
      fieldName: 'ssoEFilingUsername',
      labelKey: 'ssoEFilingUsername',
    },
    {
      fieldName: 'ssoEFilingPassword',
      labelKey: 'ssoEFilingPassword',
    },
    {
      fieldName: 'revenueEFilingUsername',
      labelKey: 'revenueEFilingUsername',
    },
    {
      fieldName: 'revenueEFilingPassword',
      labelKey: 'revenueEFilingPassword',
    },
    {
      fieldName: 'isUsingDisbursementService',
      labelKey: 'isUsingDisbursementService',
    },
  ],
  bankAccount: BANK_ACCOUNT_FIELDS,
};
