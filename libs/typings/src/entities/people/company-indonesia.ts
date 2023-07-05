import {
  PayrollCycle,
  ProrateSalaryFormula,
  CompannyPomIdContributionForBpjsOnSalary,
  BankAccount,
} from '@entities';

export interface CompanyIndonesia {
  id: number;
  payrollCycle: Nullable<PayrollCycle>;
  payrollCutOffDate: Nullable<number>;
  payrollDate: Nullable<number>;
  prorateSalaryFormula: Nullable<ProrateSalaryFormula>;
  prorateLeaveEncashmentFormula: Nullable<ProrateSalaryFormula>;
  prorateUnpaidLeaveEncashmentFormula: Nullable<ProrateSalaryFormula>;
  contributionForBpjsOnSalary: Nullable<CompannyPomIdContributionForBpjsOnSalary>;
  isAypAssistESubmission: Nullable<boolean>;
  djpTaxNumberId: Nullable<string>;
  djpPassword: Nullable<string>;
  eDabuId: Nullable<string>;
  eDabuPassword: Nullable<string>;
  sippId: Nullable<string>;
  sippPassword: Nullable<string>;
  isUsingDisbursementService: Nullable<boolean>;
  isGenerateBankFile: Nullable<boolean>;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  bankAccount: Nullable<BankAccount>;
}
