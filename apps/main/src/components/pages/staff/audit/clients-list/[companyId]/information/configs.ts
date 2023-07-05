import {
  Address,
  Company,
  CompanyBillingAddressType,
  CompanyCategory,
  Industry,
} from '@ayp/typings/entities';
import { CountryOption, CurrencyOption } from '@ayp/typings/ui';

export enum ListEditedSection {
  COMPANY_INFORMATION = 'COMPANY_INFORMATION',
  COMPANY_INVOICING = 'COMPANY_INVOICING',
  COMPANY_BILLING = 'COMPANY_BILLING',
}

interface FormAddress extends Omit<Address, 'country'> {
  country: Nullable<CountryOption>;
}

export interface CompanyOnboardingEditFormValues
  extends Omit<
    Company,
    | 'id'
    | 'status'
    | 'name'
    | 'category'
    | 'industry'
    | 'industryId'
    | 'address'
    | 'addressId'
    | 'currency'
    | 'signedAgreements'
    | 'registeredById'
    | 'registeredBy'
    | 'createdById'
    | 'createdBy'
    | 'billingAddressId'
    | 'billingAddress'
  > {
  currency: Nullable<CurrencyOption>;
  address: Nullable<FormAddress>;
  category: CompanyCategory;
  industry: Nullable<Industry>;
  billingAddressType: Nullable<CompanyBillingAddressType>;
  billingAddress: Nullable<FormAddress>;
}

export const mapToCompanyOnboardingEditFormValues = (
  company: Omit<
    Company,
    | 'id'
    | 'status'
    | 'registeredById'
    | 'registeredBy'
    | 'createdById'
    | 'createdBy'
    | 'industryId'
  >,
  countries: CountryOption[],
  currencies: CurrencyOption[]
): CompanyOnboardingEditFormValues => ({
  companyId: company.companyId,
  address: company?.address
    ? {
        ...company.address,
        country: company?.address?.countryCode
          ? countries.find(
              (country) => country.code === company?.address?.countryCode
            ) ?? null
          : null,
      }
    : null,
  registrationId: company.registrationId ?? '',
  taxId: company.taxId ?? '',
  hasSgEntity: company.hasSgEntity,
  sgEntityUen: company.sgEntityUen,
  sgEntityName: company.sgEntityName,
  currency: company.currency
    ? (currencies.find(
        (currency) => currency.code === company.currency
      ) as CurrencyOption)
    : null,
  industry: company.industry ?? null,
  category: company.category,
  entityLinkStatus: company.entityLinkStatus,
  parentId: company.parentId,
  billingAddressType: company.billingAddressType,
  billingAddress: company?.billingAddress
    ? {
        ...company.billingAddress,
        country: company?.billingAddress?.countryCode
          ? countries.find(
              (country) => country.code === company?.billingAddress?.countryCode
            ) ?? null
          : null,
      }
    : null,
});
