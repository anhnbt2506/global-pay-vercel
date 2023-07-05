import { Bank } from '@entities';

export interface BankAccount {
  id: number;
  beneficiaryName: Nullable<string>;
  accountNumber: Nullable<string>;
  bankId: Nullable<string>;
  branchCode: Nullable<string>;
  createdAt: Date;
  updatedAt: Date;

  // Relations fields
  bank: Nullable<Bank>;
}
