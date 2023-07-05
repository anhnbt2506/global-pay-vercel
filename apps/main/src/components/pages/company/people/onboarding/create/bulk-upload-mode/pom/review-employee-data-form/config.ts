import { CountryCode, CurrencyCode } from '@ayp/typings/commons';
import { PermitType } from '@ayp/typings/entities';
import { CountryOption, CurrencyOption, Option } from '@ayp/typings/ui';
import type { TFunction } from 'next-i18next';

export const getColumnOptionLabel = (
  columnName: string,
  optionId: string,
  t: TFunction
) => {
  switch (columnName) {
    case 'WGEN':
      return t(`gender:${optionId}`);
    case 'WMAR':
      return t(`marital-status:${optionId}`);
    case 'WRG':
      return t(`religion:${optionId}`);
    case 'WRC':
      return t(`race:${optionId}`);
    case 'WES':
      return t(`hire-status:${optionId}`);
    case 'WSS':
      return t(`citizenship-status:${optionId}`);
    case 'WCT':
      return t(`worker-contract-type:${optionId}`);
    case 'WET':
      return t(`employment-type:${optionId}`);
    case 'WPA':
      return t(`workplace-address-type:${optionId}`);
    case 'WPPU':
      return t(`calendar-unit:${optionId}`);
    case 'WSCT':
      return t(`worker-has-signed-agreement:${optionId}`);
    case 'WTNU':
      return t(`calendar-unit:${optionId}`);
    case 'WPYM':
      return t(`worker-payment-option:${optionId}`);
    case 'WSPP':
      return t(`worker-payment-schedule:${optionId}`);
    case 'WCXT':
      return t(`worker-contract-term:${optionId}`);
    case 'WER':
      return t(`emergency-contact-relationship:${optionId}`);
    case 'WPT':
      return t(`permit-type:${optionId}`);
    case 'WXS':
      return t(`worker-tax-status:${optionId}`);
    case 'WCFC':
      return t(`worker-cpf-contribution-type:${optionId}`);
    case 'WPFM':
      return t(`worker-managerial-type:${optionId}`);
    case 'WSDMO':
    case 'WSDTU':
    case 'WSDWE':
    case 'WSDTH':
    case 'WSDFR':
    case 'WSDSA':
    case 'WSDSU':
      return t(`worker-schedule:${optionId}`);
    default:
      return optionId;
  }
};

export const getCurrencyOptions = (
  country: Nullable<CountryOption>,
  currencies: CurrencyOption[]
) => {
  switch (country?.code) {
    case CountryCode.HONGKONG:
      return currencies.filter(
        (currency) => currency.code === CurrencyCode.HONGKONG
      );
    case CountryCode.INDONESIA:
      return currencies.filter(
        (currency) => currency.code === CurrencyCode.INDONESIA
      );
    case CountryCode.MALAYSIA:
      return currencies.filter(
        (currency) => currency.code === CurrencyCode.MALAYSIA
      );
    case CountryCode.PHILIPPINES:
      return currencies.filter(
        (currency) => currency.code === CurrencyCode.PHILIPPINES
      );
    case CountryCode.SINGAPORE:
      return currencies.filter(
        (currency) => currency.code === CurrencyCode.SINGAPORE
      );
    case CountryCode.THAILAND:
      return currencies.filter(
        (currency) => currency.code === CurrencyCode.THAILAND
      );
    case CountryCode.VIETNAM:
      return currencies.filter(
        (currency) => currency.code === CurrencyCode.VIETNAM
      );
    default:
      return currencies;
  }
};

export const getEnumOptionsPermitType = (
  country: Nullable<CountryOption>,
  options: Option[]
) => {
  switch (country?.code) {
    case CountryCode.HONGKONG:
      return options.filter(
        ({ id }) =>
          id === PermitType.GENERAL_EMPLOYMENT_POLICY || id === PermitType.NA
      );
    case CountryCode.INDONESIA:
      return options.filter(
        ({ id }) => id === PermitType.C_312 || id === PermitType.NA
      );
    case CountryCode.MALAYSIA:
      return options.filter(
        ({ id }) => id === PermitType.EMPLOYMENT_PASS || id === PermitType.NA
      );
    case CountryCode.PHILIPPINES:
      return options.filter(
        ({ id }) =>
          id === PermitType['9G_VISA'] ||
          id === PermitType.ALIEN_EMPLOYMENT_PERMIT ||
          id === PermitType.NA
      );
    case CountryCode.SINGAPORE:
      return options.filter(
        ({ id }) => id === PermitType.EMPLOYMENT_PASS || id === PermitType.NA
      );
    case CountryCode.THAILAND:
      return options.filter(
        ({ id }) =>
          id === PermitType.NON_IMMIGRANT_VISA_B || id === PermitType.NA
      );
    case CountryCode.VIETNAM:
      return options.filter(
        ({ id }) => id === PermitType.DN_VISA || id === PermitType.NA
      );
    default:
      return options;
  }
};
