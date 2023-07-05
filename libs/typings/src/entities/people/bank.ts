import { CountryCode } from '@commons';

export interface BankFileDetail<T = string> {
  fieldName: string;
  dataType: string;
  options: Nullable<T[]>;
}

export interface Bank<T = string> {
  bankId: string;
  jtId: number;
  countryCode: CountryCode;
  bankName: string;
  bankCode: string;
  swiftCode: string;
  isBankFileSupported: boolean;
  bankFileDetails: BankFileDetail<T>[];
  lastSyncedAt: Date;
}

export type BankFilter = keyof Bank;
export type BankSortBy = keyof Bank;
