import {
  CountryCode,
  Query,
  QueryMeta,
  UserSession,
  WorkerEmploymentPostCsvBody,
  WorkerEmploymentUploadCsvBody,
  WorkerEmploymentValidateCsvError,
} from '@ayp/typings/commons';
import {
  CsvTemplate,
  User,
  WorkerEmployment,
  WorkerEmploymentFilter,
  WorkerEmploymentSortBy,
} from '@ayp/typings/entities';
import { constructQuery } from '@ayp/utils';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/worker-employment';

export interface WorkerUserResponse
  extends Omit<
    User,
    | 'id'
    | 'userId'
    | 'userType'
    | 'firstNameAlternate'
    | 'lastNameAlternate'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'info'
  > {
  employmentId: string;
}

export const WorkerEmploymentApi = {
  get: async (
    session: UserSession,
    query: Query<
      keyof WorkerEmployment,
      WorkerEmploymentFilter,
      WorkerEmploymentSortBy
    >
  ) =>
    BaseApi.get<{ workerEmployments: WorkerEmployment[]; meta: QueryMeta }>({
      path: `/${resourceModel}?${constructQuery(query)}`,
      session,
    }),
  post: async (session: UserSession, body: unknown) =>
    BaseApi.post<{
      workerEmployment: Pick<
        WorkerEmployment,
        'id' | 'agreement' | 'employmentId'
      >;
    }>({
      path: `/${resourceModel}`,
      session,
      body,
    }),
  getByEmploymentId: async (
    session: UserSession,
    query: Query<
      keyof WorkerEmployment,
      WorkerEmploymentFilter,
      WorkerEmploymentSortBy
    >,
    employmentId: string
  ) =>
    BaseApi.get<{
      workerEmployment: WorkerEmployment;
    }>({
      path: `/${resourceModel}/${employmentId}?${constructQuery(query)}`,
      session,
    }),
  update: async (session: UserSession, employmentId: string, body: unknown) =>
    BaseApi.patch({
      path: `/${resourceModel}/${employmentId}`,
      body,
      session,
    }),
  signAgreement: async (session: UserSession, employmentId: string) =>
    BaseApi.patch({
      path: `/${resourceModel}/${employmentId}/sign-agreement`,
      session,
    }),
  postCsv: async (session: UserSession, body: WorkerEmploymentPostCsvBody) =>
    BaseApi.post({
      path: `/${resourceModel}/csv`,
      session,
      body,
    }),
  getCsvTemplate: async (session: UserSession, countryCode: CountryCode) =>
    BaseApi.get<CsvTemplate[]>({
      path: `/${resourceModel}/csv-template/${countryCode}`,
      session,
    }),
  getUnassignedEmployees: async (session: UserSession, companyId: string) =>
    BaseApi.get<{
      workerEmployments: WorkerEmployment[];
    }>({
      path: `/${resourceModel}/unassigned-department?companyId=${companyId}`,
      session,
    }),
  validateCsv: async (
    session: UserSession,
    body: WorkerEmploymentUploadCsvBody
  ) =>
    BaseApi.post<{ errors: WorkerEmploymentValidateCsvError[] }>({
      path: `/${resourceModel}/validate`,
      session,
      body,
    }),
  bulkUploadCsv: async (
    session: UserSession,
    body: WorkerEmploymentUploadCsvBody
  ) =>
    BaseApi.post({
      path: `/${resourceModel}/bulk-upload`,
      session,
      body,
    }),
  checkEmployeeId: async (session: UserSession, employeeId: string) =>
    BaseApi.post<{ isEmployeeIdValidated: boolean }>({
      path: `/${resourceModel}/check-employee-id`,
      session,
      body: {
        employeeId,
      },
    }),
  getPayrollQualified: async (
    session: UserSession,
    hireType: string,
    companyId: string,
    countryCode: CountryCode
  ) =>
    BaseApi.get<{ workerUsers: WorkerUserResponse[] }>({
      path: `/${resourceModel}/payroll-qualified?hireType=${hireType}&companyId=${companyId}&countryCode=${countryCode}`,
      session,
    }),
};
