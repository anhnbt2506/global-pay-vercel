import {
  BankAccount,
  CompanyPomSgESubmissionServices,
  PayrollCycle,
  ProrateSalaryFormula,
  CompanyPomSgCpfPaymentMode,
  CompanyPomSgCpfSubmissionPlatform,
} from '@entities';

export interface CompanySingapore {
  id: number;
  payrollCycle: Nullable<PayrollCycle>;
  payrollDate: Nullable<number>;
  payrollCutOffDate: Nullable<number>;
  prorateSalaryFormula: Nullable<ProrateSalaryFormula>;
  cpfFilingNumber: Nullable<string>;
  cpfSubmissionPlatform: Nullable<CompanyPomSgCpfSubmissionPlatform>;
  crimsonLogicUsername: Nullable<string>;
  crimsonLogicPassword: Nullable<string>;
  cpfPaymentMode: Nullable<CompanyPomSgCpfPaymentMode>;
  isAypAssistESubmission: Nullable<boolean>;
  eSubmissionServices: Nullable<CompanyPomSgESubmissionServices[]>;
  isUsingDisbursementService: Nullable<boolean>;
  isGenerateBankFile: Nullable<boolean>;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  bankAccount: Nullable<BankAccount>;
}
