import { UserSession } from '@ayp/typings/commons';
import { WorkerEmploymentCompany } from '@ayp/typings/entities';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/worker-user';

export const WorkerUserApi = {
  getEmploymentCompanies: async (session: UserSession) =>
    BaseApi.get<{ companies: WorkerEmploymentCompany[] }>({
      path: `/${resourceModel}/employment-companies`,
      session,
    }),

  getHome: async (session: UserSession) =>
    BaseApi.get({
      path: `/${resourceModel}/home`,
      session,
    }),
};
