import {
  BankAccount,
  CompanyPomPhStatutoryDeductions,
  PayrollCycle,
  ProrateSalaryFormula,
} from '@entities';

export interface CompanyPhilippines {
  id: number;
  payrollCycle: Nullable<PayrollCycle>;
  statutoryDeductions: Nullable<CompanyPomPhStatutoryDeductions>;
  payrollCutOffDate: Nullable<number>;
  payrollDate: Nullable<number>;
  secondPayrollCutOffDate: Nullable<number>;
  secondPayrollDate: Nullable<number>;
  prorateSalaryFormula: Nullable<ProrateSalaryFormula>;
  isAypAssistESubmission: Nullable<boolean>;
  sssUserId: Nullable<string>;
  sssPassword: Nullable<string>;
  penId: Nullable<string>;
  penPassword: Nullable<string>;
  birTinId: Nullable<string>;
  birUsername: Nullable<string>;
  birPassword: Nullable<string>;
  birSecurityQuestionAnswer: Nullable<string>;
  isUsingDisbursementService: Nullable<boolean>;
  isGenerateBankFile: Nullable<boolean>;
  secRegistrationFile: Nullable<string>;
  bir2303File: Nullable<string>;
  sssFile: Nullable<string>;
  penFile: Nullable<string>;
  pagFile: Nullable<string>;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  bankAccount: Nullable<BankAccount>;
}
