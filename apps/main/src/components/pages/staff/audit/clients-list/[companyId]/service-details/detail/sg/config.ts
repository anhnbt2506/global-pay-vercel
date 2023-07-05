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
      fieldName: 'cpfFilingNumber',
      labelKey: 'cpfFilingNumber',
    },
    {
      fieldName: 'cpfSubmissionPlatform',
      labelKey: 'cpfSubmissionPlatform',
    },
    {
      fieldName: 'crimsonLogicUsername',
      labelKey: 'crimsonLogicUsername',
    },
    {
      fieldName: 'crimsonLogicPassword',
      labelKey: 'crimsonLogicPassword',
    },
    {
      fieldName: 'cpfPaymentMode',
      labelKey: 'cpfPaymentMode',
    },
    {
      fieldName: 'isAypAssistESubmission',
      labelKey: 'isAypAssistESubmission',
    },
    {
      fieldName: 'eSubmissionServices',
      labelKey: 'eSubmissionServices',
    },
    {
      fieldName: 'isUsingDisbursementService',
      labelKey: 'isUsingDisbursementService',
    },
  ],
  bankAccount: BANK_ACCOUNT_FIELDS,
};
