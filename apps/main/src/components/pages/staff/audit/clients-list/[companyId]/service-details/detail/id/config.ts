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
      fieldName: 'prorateLeaveEncashmentFormula',
      labelKey: 'prorateLeaveEncashmentFormula',
    },
    {
      fieldName: 'prorateUnpaidLeaveEncashmentFormula',
      labelKey: 'prorateUnpaidLeaveEncashmentFormula',
    },
    {
      fieldName: 'contributionForBpjsOnSalary',
      labelKey: 'contributionForBpjsOnSalary',
    },
    {
      fieldName: 'isAypAssistESubmission',
      labelKey: 'isAypAssistESubmission',
    },
    {
      fieldName: 'djpTaxNumberId',
      labelKey: 'djpTaxNumberId',
    },
    {
      fieldName: 'djpPassword',
      labelKey: 'djpPassword',
    },
    {
      fieldName: 'eDabuId',
      labelKey: 'eDabuId',
    },
    {
      fieldName: 'eDabuPassword',
      labelKey: 'eDabuPassword',
    },
    {
      fieldName: 'sippId',
      labelKey: 'sippId',
    },
    {
      fieldName: 'sippPassword',
      labelKey: 'sippPassword',
    },
    {
      fieldName: 'isUsingDisbursementService',
      labelKey: 'isUsingDisbursementService',
    },
  ],
  bankAccount: BANK_ACCOUNT_FIELDS,
};
