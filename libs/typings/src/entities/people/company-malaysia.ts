import { BankAccount, PayrollCycle, ProrateSalaryFormula } from '@entities';

export interface CompanyMalaysia {
  id: number;
  payrollCycle: Nullable<PayrollCycle>;
  payrollDate: Nullable<number>;
  payrollCutOffDate: Nullable<number>;
  prorateSalaryFormula: Nullable<ProrateSalaryFormula>;
  epfNumber: Nullable<string>;
  socsoNumber: Nullable<string>;
  eisNumber: Nullable<string>;
  isAypAssistESubmission: Nullable<boolean>;
  socsoEmail: Nullable<string>;
  socsoPassword: Nullable<string>;
  epfUserId: Nullable<string>;
  epfPassword: Nullable<string>;
  cp39UserId: Nullable<string>;
  cp39Password: Nullable<string>;
  isUsingDisbursementService: Nullable<boolean>;
  isGenerateBankFile: Nullable<boolean>;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  bankAccount: Nullable<BankAccount>;
}
