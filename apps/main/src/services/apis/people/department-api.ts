import { Query, QueryMeta, UserSession } from '@ayp/typings/commons';
import {
  Department,
  DepartmentFilter,
  DepartmentSortBy,
} from '@ayp/typings/entities';
import { constructQuery } from '@ayp/utils';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/department';

export type DepartmentSelection = Pick<Department, 'departmentId' | 'name'>;

export const DepartmentApi = {
  getDepartments: async (
    session: UserSession,
    companyId: string,
    query: Query<keyof Department, DepartmentFilter, DepartmentSortBy>
  ) =>
    BaseApi.get<{ departments: Department[]; meta: QueryMeta }>({
      path: `/${resourceModel}?companyId=${companyId}&${constructQuery(query)}`,
      session,
    }),
  getDepartmentsSelection: async (session: UserSession) =>
    BaseApi.get<{ departments: DepartmentSelection[] }>({
      path: `/${resourceModel}/selection`,
      session,
    }),
  post: async (session: UserSession, companyId: string, name: string) =>
    BaseApi.post<{ department: Department }>({
      path: `/${resourceModel}`,
      body: {
        companyId,
        name,
      },
      session,
    }),
  patch: async (
    session: UserSession,
    companyId: string,
    name: string,
    departmentId: string
  ) =>
    BaseApi.patch<{ department: Department }>({
      path: `/${resourceModel}/${departmentId}`,
      body: {
        name,
        companyId,
      },
      session,
    }),
  updateEmployee: async (
    session: UserSession,
    departmentId: string,
    employmentIds: string[]
  ) =>
    BaseApi.patch({
      path: `/${resourceModel}/${departmentId}/employees`,
      session,
      body: {
        employmentIds,
      },
    }),
};
