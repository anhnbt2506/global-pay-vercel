import { Query, UserSession, QueryMeta } from '@ayp/typings/commons';
import { constructQuery } from '@ayp/utils';
import {
  Industry,
  IndustryFilter,
  IndustrySortBy,
} from '@ayp/typings/entities';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/industry';

export const IndustryApi = {
  list: async (
    session: UserSession,
    query: Query<keyof Industry, IndustryFilter, IndustrySortBy>
  ) =>
    BaseApi.get<{ industries: Industry[]; meta: QueryMeta }>({
      path: `/${resourceModel}?${constructQuery(query)}`,
      session,
    }),
  listSelection: async (session: UserSession) =>
    BaseApi.get<{
      industries: Pick<Industry, 'industryId' | 'name'>[];
    }>({
      path: `/${resourceModel}/selection`,
      session,
    }),
  post: async (session: UserSession, name: string) =>
    BaseApi.post({
      path: `/${resourceModel}`,
      body: {
        name,
      },
      session,
    }),
  patch: async (session: UserSession, name: string, industryId: string) =>
    BaseApi.patch({
      path: `/${resourceModel}/${industryId}`,
      body: {
        name,
      },
      session,
    }),
};
