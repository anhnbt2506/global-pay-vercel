import { CalendarUnit } from './common';

export enum CountryCode {
  HONGKONG = 'HK',
  INDONESIA = 'ID',
  MALAYSIA = 'MY',
  PHILIPPINES = 'PH',
  SINGAPORE = 'SG',
  THAILAND = 'TH',
  VIETNAM = 'VN',
}

export enum CurrencyCode {
  HONGKONG = 'HKD',
  INDONESIA = 'IDR',
  MALAYSIA = 'MYR',
  PHILIPPINES = 'PHP',
  SINGAPORE = 'SGD',
  THAILAND = 'THB',
  VIETNAM = 'VND',
}

export interface HiringCountryRule {
  [key: string]: {
    min?: number;
    max?: number;
    value?: number;
    unit?: CalendarUnit;
  };
}
