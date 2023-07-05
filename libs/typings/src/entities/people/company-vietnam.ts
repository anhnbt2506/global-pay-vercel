import {
  BankAccount,
  CompanyPomVnShuiProvider,
  PayrollCycle,
  ProrateSalaryFormula,
} from '@entities';

export interface CompanyVietnam {
  id: number;
  payrollCycle: Nullable<PayrollCycle>;
  payrollCutOffDate: Nullable<number>;
  payrollDate: Nullable<number>;
  prorateSalaryFormula: Nullable<ProrateSalaryFormula>;
  shuiCode: Nullable<string>;
  shuiProvider: Nullable<CompanyPomVnShuiProvider>;
  isAypAssistESubmission: Nullable<boolean>;
  isUsingDisbursementService: Nullable<boolean>;
  isGenerateBankFile: Nullable<boolean>;
  shuiUserId?: Nullable<string>;
  shuiPassword?: Nullable<string>;
  businessLicenceFile: Nullable<string>;
  payrollReportFile: Nullable<string>;
  pitReportSinceQ1File: Nullable<string>;
  pitReportLastYearFile: Nullable<string>;
  shuiReportFile: Nullable<string>;
  labourContractsFile: Nullable<string>;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  bankAccount: Nullable<BankAccount>;
}
