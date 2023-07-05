import { CountryCode } from '@commons';
import { HireType } from './worker-employment';
import { Address } from './address';
import { Country } from './country';
import { Industry } from './industry';
import { UserContext } from './user-context';

export enum CompanyStatus {
  ONBOARDING = 'ONBOARDING',
  IN_REVIEW = 'IN_REVIEW',
  ACTIVE = 'ACTIVE',
}

export enum CompanyInterest {
  HIRE_STAFF_IN_COUNTRY_WITHOUT_LOCAL_ENTITY = 'HIRE_STAFF_IN_COUNTRY_WITHOUT_LOCAL_ENTITY',
  MANAGE_MULTICOUNTRY_PAYROLL = 'MANAGE_MULTICOUNTRY_PAYROLL',
  PAY_FREELANCERS_OR_CONTRACTORS = 'PAY_FREELANCERS_OR_CONTRACTORS',
  PARTNERSHIP = 'PARTNERSHIP',
}

export enum CompanyCategory {
  DEMO = 'DEMO',
  DIRECT = 'DIRECT',
  INDIRECT = 'INDIRECT',
  INTERNAL = 'INTERNAL',
}

export enum CompanyBillingAddressType {
  COMPANY_REGISTERED_ADDRESS = 'COMPANY_REGISTERED_ADDRESS',
  ALTERNATE_ADDRESS = 'ALTERNATE_ADDRESS',
}

export enum CompanyIndustry {
  BANKING_AND_FINANCE = 'BANKING_AND_FINANCE',
  DISTRIBUTION = 'DISTRIBUTION',
  EDUCATION = 'EDUCATION',
  ENERGY = 'ENERGY',
  ENGINEERING = 'ENGINEERING',
  FNB = 'FNB',
  GLOBAL_ENVIRONMENT_ORGANIZATION = 'GLOBAL_ENVIRONMENT_ORGANIZATION',
  HEALTHCARE = 'HEALTHCARE',
  LOGISTICS = 'LOGISTICS',
  MANUFACTURING = 'MANUFACTURING',
  NGO = 'NGO',
  ONG_AND_CHEMICAL = 'ONG_AND_CHEMICAL',
  REAL_ESTATE = 'REAL_ESTATE',
  RETAIL = 'RETAIL',
  SERVICES = 'SERVICES',
  TECHNOLOGY = 'TECHNOLOGY',
  WORKFORCE_MANAGEMENT = 'WORKFORCE_MANAGEMENT',
  NA = 'NA',
}

export enum EntityLinkStatus {
  STANDALONE = 'STANDALONE',
  PARENT = 'PARENT',
  SUBSIDIARY = 'SUBSIDIARY',
}

export enum EntityLinkOptionsType {
  NEW_ENTITY = 'NEW_ENTITY',
  EXISTING_ENTITY = 'EXISTING_ENTITY',
}

export interface CompanyCountries {
  companyId: string;
  countryCode: CountryCode;
  hireType: HireType;
  name: string;
  country: Country;
}

export interface Company {
  id: number;
  companyId: string;
  status: CompanyStatus;
  name?: string;
  addressId: Nullable<number>;
  registrationId?: string;
  taxId?: string;
  currency?: string;
  interest?: CompanyInterest;
  createdById: number;
  registeredById: number;
  createdAt?: Date;
  signedAgreements?: unknown[];
  hasSgEntity: Nullable<boolean>;
  sgEntityUen: Nullable<string>;
  sgEntityName: Nullable<string>;
  category: CompanyCategory;
  industryId: Nullable<string>;
  entityLinkStatus: EntityLinkStatus;
  parentId: Nullable<string>;
  billingAddressType: Nullable<CompanyBillingAddressType>;
  billingAddressId: Nullable<number>;
  billingAddress: Nullable<Address>;

  // Relations
  address: Nullable<Address>;
  industry: Nullable<Industry>;
  registeredBy: UserContext;
  createdBy: UserContext;
  companyCountries?: CompanyCountries[];
}

export interface CompanyLinking {
  companyId: string;
  name: string;
  address: {
    id: number;
    country: Omit<Country, 'dialingCode'>;
  };
}

export interface EntityLinking {
  entityLinkStatus: EntityLinkStatus;
  parentCompany?: CompanyLinking;
  subsidiaryCompanies?: CompanyLinking[];
}

export type CompanyFilter = keyof Company;

export type CompanySortBy = keyof Company;
