import { UserSession } from '@ayp/typings/commons';
import {
  CompanyCalendar,
  CompanyCalendarClient,
  CompanyEvent,
} from '@ayp/typings/entities';
import { format } from 'date-fns';
import memoizee from 'memoizee';

import { GP_BACKEND_DATE_FORMAT } from '@configs/constants';
import { BaseApi } from '@utils';

const resourceModel = 'people/v1/company-calendar';

export const CompanyCalendarApi = {
  getListCompanyEvents: memoizee(
    (session: UserSession, companyCalendarId: string, from: Date, to: Date) => {
      const fromString = format(from, GP_BACKEND_DATE_FORMAT);
      const toString = format(to, GP_BACKEND_DATE_FORMAT);
      return BaseApi.get<{ companyEvents: CompanyEvent[] }>({
        path: `/${resourceModel}/${companyCalendarId}/events?from=${fromString}&to=${toString}`,
        session,
      });
    },
    { promise: true }
  ),
  getClients: (session: UserSession) =>
    BaseApi.get<{ companies: CompanyCalendarClient[] }>({
      path: `/${resourceModel}/clients`,
      session,
    }),
  getCalendarsGenerated: (
    body: Omit<CompanyCalendarClient, 'name'>,
    session: UserSession
  ) =>
    BaseApi.post<{ companyCalendar: CompanyCalendar[] }>({
      path: `/${resourceModel}`,
      body,
      session,
    }),
  getAllCalendarsGenerated: (session: UserSession) =>
    BaseApi.post<{ companyCalendar: CompanyCalendar[] }>({
      path: `/${resourceModel}`,
      session,
    }),
};
