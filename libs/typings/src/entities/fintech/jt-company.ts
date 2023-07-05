import { CountryCode } from '@commons';
import { HireType } from '@entities/people';

export interface JtCompany {
  id: number;
  companyId: string;
  company: string;
  hireType: HireType;
  countryCode: CountryCode;
  lastSyncedAt: Date;
  jtCompanyId: string;
}

export type JtCompanyFilter = keyof JtCompany;
export type JtCompanySortBy = keyof JtCompany;
