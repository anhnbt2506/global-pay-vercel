import { Conversation, CountryCode } from '@commons';
import { HireType, CalendarPeriod, Company, Country } from '@entities/people';

import { PayrollRecordFile } from './payroll-record-file';

export enum CompanyPayrollType {
  REGULAR_CYCLE = 'REGULAR_CYCLE',
}

export interface CompanyPayroll {
  companyPayrollId: string;
  companyId: string;
  hireType: HireType;
  countryCode: CountryCode;
  cycle: CalendarPeriod;
  type: CompanyPayrollType;
  name: string;
  workerPayrollCount: number;
  status: CompanyPayrollStatus;
  periodStartDate: Date;
  periodEndDate: Date;
  payDate: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  country: Country;
  company: Company;
  companyPayrollFiles: PayrollRecordFile[];
  conversation: Nullable<Conversation>;
}

export enum CompanyPayrollStatus {
  COMPLETED = 'COMPLETED',
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PENDING_REVIEW = 'PENDING_REVIEW',
  REJECTED = 'REJECTED',
}

export interface CompanyPayrollStatistics {
  count: number;
  status: CompanyPayrollStatus;
}

export type CompanyPayrollFilter = keyof CompanyPayroll;
export type CompanyPayrollSortBy = keyof CompanyPayroll;
