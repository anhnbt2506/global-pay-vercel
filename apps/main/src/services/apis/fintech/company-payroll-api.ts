import { Query, QueryMeta, UserSession } from '@ayp/typings/commons';
import {
  CompanyPayroll,
  CompanyPayrollFilter,
  CompanyPayrollSortBy,
  CompanyPayrollStatistics,
  CompanyPayrollStatus,
} from '@ayp/typings/entities';
import { FileKey } from '@ayp/typings/ui';
import { constructQuery } from '@ayp/utils';

import { BaseApi } from '@utils';

const resourceModel = 'fintech/v1/company-payroll';

export interface CreateCompanyPayrollFilesRequest {
  fileKeys: FileKey[];
  comment?: string;
}

export interface CreateRunOffPayrollCycle
  extends Omit<
    CompanyPayroll,
    | 'companyPayrollId'
    | 'conversation'
    | 'cycle'
    | 'type'
    | 'workerPayrollCount'
    | 'status'
    | 'createdAt'
    | 'updatedAt'
    | 'country'
    | 'company'
    | 'companyPayrollFiles'
    | 'periodStartDate'
    | 'periodEndDate'
    | 'payDate'
  > {
  workerEmployments: Array<string>;
  periodStartDate: string;
  periodEndDate: string;
  payDate: string;
}

export const CompanyPayrollApi = {
  createCompanyPayrollFiles: async (
    session: UserSession,
    companyPayrollId: string,
    body: CreateCompanyPayrollFilesRequest
  ) =>
    BaseApi.post({
      path: `/${resourceModel}/${companyPayrollId}/files`,
      body,
      session,
    }),
  statistics: async (
    session: UserSession,
    query: Query<
      keyof CompanyPayroll,
      CompanyPayrollFilter,
      CompanyPayrollSortBy
    >
  ) =>
    BaseApi.get<{ statistics: CompanyPayrollStatistics[] }>({
      path: `/${resourceModel}/statistics?${constructQuery(query)}`,
      session,
    }),
  list: async (
    session: UserSession,
    query: Query<
      keyof CompanyPayroll,
      CompanyPayrollFilter,
      CompanyPayrollSortBy
    >
  ) =>
    BaseApi.get<{ companyPayrolls: CompanyPayroll[]; meta: QueryMeta }>({
      path: `/${resourceModel}?${constructQuery(query)}`,
      session,
    }),
  getCompanyPayrollById: async (
    session: UserSession,
    query: Query<
      keyof CompanyPayroll,
      CompanyPayrollFilter,
      CompanyPayrollSortBy
    >,
    companyPayrollId: string
  ) =>
    BaseApi.get<{ companyPayroll: CompanyPayroll }>({
      path: `/${resourceModel}/${companyPayrollId}?${constructQuery(query)}`,
      session,
    }),
  updateCompanyPayrollStatus: async (
    session: UserSession,
    companyPayrollId: string,
    status: CompanyPayrollStatus
  ) =>
    BaseApi.patch({
      path: `/${resourceModel}/${companyPayrollId}`,
      session,
      body: {
        status,
      },
    }),
  post: async (session: UserSession, body: CreateRunOffPayrollCycle) =>
    BaseApi.post<{ companyPayroll: CompanyPayroll }>({
      path: `/${resourceModel}`,
      session,
      body,
    }),
};
