import { Query, QueryMeta, UserSession } from '@ayp/typings/commons';
import { Bank, BankFilter, BankSortBy } from '@ayp/typings/entities';
import { constructQuery } from '@ayp/utils';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/bank';

export const BankApi = {
  getBanks: async (
    session: UserSession,
    query: Query<keyof Bank, BankFilter, BankSortBy>
  ) =>
    BaseApi.get<{ banks: Bank[]; meta: QueryMeta }>({
      path: `/${resourceModel}?${constructQuery(query)}`,
      session,
    }),
};
