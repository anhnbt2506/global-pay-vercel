import { PayrollCycle, ProrateSalaryFormula } from '@entities';

export interface CompanyThailand {
  id: number;
  payrollCycle: Nullable<PayrollCycle>;
  payrollCutOffDate: Nullable<number>;
  payrollDate: Nullable<number>;
  prorateSalaryFormula: Nullable<ProrateSalaryFormula>;
  socialSecurityId: Nullable<string>;
  isAypAssistESubmission: Nullable<boolean>;
  ssoEFilingUsername: Nullable<string>;
  ssoEFilingPassword: Nullable<string>;
  revenueEFilingUsername: Nullable<string>;
  revenueEFilingPassword: Nullable<string>;
  isUsingDisbursementService: Nullable<boolean>;
  companyAffidavitFile: Nullable<string>;
  payrollReportFile: Nullable<string>;
  ssoReportFile: Nullable<string>;
  pnd1ReportSinceJanuaryFile: Nullable<string>;
  pnd1ReportPreviousYearFile: Nullable<string>;
  createdAt: Date;
  updatedAt: Date;
}
