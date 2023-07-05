import { Query, UserSession, QueryMeta } from '@ayp/typings/commons';
import { constructQuery } from '@ayp/utils';
import {
  JtCompany,
  JtCompanyFilter,
  JtCompanySortBy,
} from '@ayp/typings/entities';

import { BaseApi } from '@utils';

const resourceModel = 'fintech/v1/jt-company';

export const JtCompanyApi = {
  list: async (
    session: UserSession,
    query: Query<keyof JtCompany, JtCompanyFilter, JtCompanySortBy>
  ) =>
    BaseApi.get<{ jtCompanies: JtCompany[]; meta: QueryMeta }>({
      path: `/${resourceModel}?${constructQuery(query)}`,
      session,
    }),
};
