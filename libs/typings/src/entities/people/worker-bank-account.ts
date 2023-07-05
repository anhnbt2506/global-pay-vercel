export interface WorkerBankAccount {
  id: number;
  workerEmploymentId: number;
  beneficiaryName: Nullable<string>;
  accountNumber: Nullable<string>;
  bankId: Nullable<string>;
  bankName: Nullable<string>;
  bankCode: Nullable<string>;
  branchCode: Nullable<string>;
  swiftCode: Nullable<string>;
  ibanCode: Nullable<string>;
  createdAt: Date;
  updatedAt: Date;
}
