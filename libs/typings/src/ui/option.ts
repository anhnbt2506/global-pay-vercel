import { CountryCode, CurrencyCode } from '@commons';

export interface Option<T = string | number> {
  id: T;
  label: string;
  [key: string]: unknown;
}

export interface CountryOption extends Option {
  code: CountryCode;
}

export interface CurrencyOption extends Option {
  code: CurrencyCode;
}
