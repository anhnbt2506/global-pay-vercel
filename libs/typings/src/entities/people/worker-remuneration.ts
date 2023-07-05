export interface WorkerRemuneration {
  id: number;
  salaryPayableDate: Nullable<number>;
  salaryPerMonth: Nullable<string>;
  monthlyAllowance: Nullable<string>;
  isEligibleForInsurance: boolean;
  isEligibleForAdditionalIncome: boolean;
  isEligibleForPaidExpenses: boolean;
  isEntitledToOvertime: boolean;
  isEligibleForVariablePay: boolean;
  isEligibleForAnnualBonus: boolean;
  isEligibleForCommission: boolean;
  paidExpensesDescription: Nullable<string>;
  overtimeDescription: Nullable<string>;
  additionalIncomeDescription: Nullable<string>;
  variablePayDescription: Nullable<string>;
  annualBonusDescription: Nullable<string>;
  commissionDescription: Nullable<string>;
  createdAt: Date;
  updatedAt: Date;
}
