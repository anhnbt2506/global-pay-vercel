import {
  AdjustmentCalendarTag,
  CalendarTag,
  CalendarTagFilter,
  CalendarTagSortBy,
  CalendarSelectionType,
} from '@ayp/typings/entities';
import { UserSession, Query, QueryMeta } from '@ayp/typings/commons';
import { constructQuery } from '@ayp/utils';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/calendar-tag';

export const CalendarTagApi = {
  list: async (
    session: UserSession,
    query: Query<keyof CalendarTag, CalendarTagFilter, CalendarTagSortBy>
  ) =>
    BaseApi.get<{ calendarTags: CalendarTag[]; meta: QueryMeta }>({
      path: `/${resourceModel}?${constructQuery(query)}`,
      session,
    }),
  getSelection: async (
    selectionType: CalendarSelectionType,
    session: UserSession
  ) =>
    BaseApi.get<{ calendarTags: AdjustmentCalendarTag[] }>({
      path: `/${resourceModel}/selection?type=${selectionType}`,
      session,
    }),
  createCalendarTag: async (
    body: Omit<
      CalendarTag,
      'calendarTagId' | 'status' | 'createdAt' | 'updatedAt' | 'id'
    >,
    session: UserSession
  ) =>
    BaseApi.post<{ calendarTags: AdjustmentCalendarTag[] }>({
      path: `/${resourceModel}`,
      body,
      session,
    }),
  updateCalendarTag: async (
    calendarTagId: string,
    body: Omit<
      CalendarTag,
      'calendarTagId' | 'status' | 'createdAt' | 'updatedAt' | 'id'
    >,
    session: UserSession
  ) =>
    BaseApi.patch<{ calendarTags: AdjustmentCalendarTag[] }>({
      path: `/${resourceModel}/${calendarTagId}`,
      body,
      session,
    }),
};
