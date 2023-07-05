import { Query, QueryMeta, UserSession } from '@ayp/typings/commons';
import {
  CalendarEvent,
  CalendarEventFilter,
  CalendarEventSortBy,
} from '@ayp/typings/entities';
import { constructQuery } from '@ayp/utils';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/calendar-event';

export const CalendarEventApi = {
  list: async (
    session: UserSession,
    query: Query<keyof CalendarEvent, CalendarEventFilter, CalendarEventSortBy>
  ) =>
    BaseApi.get<{ calendarEvents: CalendarEvent[]; meta: QueryMeta }>({
      path: `/${resourceModel}?${constructQuery(query)}`,
      session,
    }),
  createCalendarEvent: async (
    body: Omit<
      CalendarEvent,
      | 'calendarEventId'
      | 'status'
      | 'createdAt'
      | 'updatedAt'
      | 'id'
      | 'calendarTag'
    >,
    session: UserSession
  ) =>
    BaseApi.post<{ calendarEvent: CalendarEvent }>({
      path: `/${resourceModel}`,
      body,
      session,
    }),
  updateCalendarEvent: async (
    session: UserSession,
    calendarEventId: string,
    body: Omit<
      CalendarEvent,
      | 'calendarEventId'
      | 'status'
      | 'createdAt'
      | 'updatedAt'
      | 'id'
      | 'calendarTag'
    >
  ) =>
    BaseApi.patch({
      path: `/${resourceModel}/${calendarEventId}`,
      body,
      session,
    }),
};
