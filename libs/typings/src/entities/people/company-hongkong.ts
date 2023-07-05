import {
  PayrollCycle,
  ProrateSalaryFormula,
  CompanyPomHkMpfProvider,
  BankAccount,
} from '@entities';

export interface CompanyHongKong {
  id: number;
  payrollCycle: Nullable<PayrollCycle>;
  payrollCutOffDate: Nullable<number>;
  payrollDate: Nullable<number>;
  prorateSalaryFormula: Nullable<ProrateSalaryFormula>;
  mpfProvider: Nullable<CompanyPomHkMpfProvider>;
  mpfSubSchemeNumber: Nullable<string>;
  isAypAssistESubmission: Nullable<boolean>;
  mpfUsername: Nullable<string>;
  mpfPassword: Nullable<string>;
  isUsingDisbursementService: Nullable<boolean>;
  isGenerateBankFile: Nullable<boolean>;
  createdAt: Date;
  updatedAt: Date;

  //Relation
  bankAccount: Nullable<BankAccount>;
}
