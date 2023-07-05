import {
  CalendarConfig,
  CalendarConfigFilter,
  CalendarConfigSortBy,
} from '@ayp/typings/entities';
import { UserSession, Query, QueryMeta } from '@ayp/typings/commons';
import { constructQuery } from '@ayp/utils';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/calendar-config';

export const CalendarConfigApi = {
  list: async (
    session: UserSession,
    query: Query<
      keyof CalendarConfig,
      CalendarConfigFilter,
      CalendarConfigSortBy
    >
  ) =>
    BaseApi.get<{ calendarConfigs: CalendarConfig[]; meta: QueryMeta }>({
      path: `/${resourceModel}?${constructQuery(query)}`,
      session,
    }),
  create: async (
    body: Omit<
      CalendarConfig,
      'id' | 'createdAt' | 'updatedAt' | 'calendarConfigId' | 'status'
    >,
    session: UserSession
  ) =>
    BaseApi.post<{ calendarC: CalendarConfig }>({
      path: `/${resourceModel}`,
      body,
      session,
    }),
  update: async (
    session: UserSession,
    calendarConfigId: string,
    body: Omit<
      CalendarConfig,
      'id' | 'createdAt' | 'updatedAt' | 'calendarConfigId' | 'status'
    >
  ) =>
    BaseApi.patch({
      path: `/${resourceModel}/${calendarConfigId}`,
      body,
      session,
    }),
};
