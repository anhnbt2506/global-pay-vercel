import { BANK_ACCOUNT_FIELDS } from '../commons/configs';

export const SERVICE_DETAILS_FIELDS = {
  commonFields: [
    {
      fieldName: 'payrollCycle',
      labelKey: 'payrollCycle',
    },
    { fieldName: 'statutoryDeductions', labelKey: 'statutoryDeductions' },
    {
      fieldName: 'payrollDate',
      labelKey: 'payrollDate',
      semiLabelKey: 'semiPayrollDate',
    },
    {
      fieldName: 'payrollCutOffDate',
      labelKey: 'payrollCutOffDate',
      semiLabelKey: 'semiPayrollCutOffDate',
    },
    {
      fieldName: 'secondPayrollCutOffDate',
      labelKey: 'secondPayrollCutOffDate',
    },
    { fieldName: 'secondPayrollDate', labelKey: 'secondPayrollDate' },
    {
      fieldName: 'prorateSalaryFormula',
      labelKey: 'prorateSalaryFormula',
    },
    {
      fieldName: 'isAypAssistESubmission',
      labelKey: 'isAypAssistESubmission',
    },
    { fieldName: 'sssUserId', labelKey: 'sssUserId' },
    { fieldName: 'sssPassword', labelKey: 'sssPassword' },
    { fieldName: 'penId', labelKey: 'penId' },
    { fieldName: 'penPassword', labelKey: 'penPassword' },
    { fieldName: 'birTinId', labelKey: 'birTinId' },
    { fieldName: 'birUsername', labelKey: 'birUsername' },
    { fieldName: 'birPassword', labelKey: 'birPassword' },
    {
      fieldName: 'birSecurityQuestionAnswer',
      labelKey: 'birSecurityQuestionAnswer',
    },
    {
      fieldName: 'isUsingDisbursementService',
      labelKey: 'isUsingDisbursementService',
    },
  ],
  bankAccount: BANK_ACCOUNT_FIELDS,
};
