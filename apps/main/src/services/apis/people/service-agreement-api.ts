import { Query, QueryMeta, UserSession } from '@ayp/typings/commons';
import {
  HireType,
  ServiceAgreement,
  ServiceAgreementsFilter,
  ServiceAgreementsSortBy,
} from '@ayp/typings/entities';
import { constructQuery } from '@ayp/utils';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/service-agreement';

export const ServiceAgreementApi = {
  list: async (
    session: UserSession,
    query: Query<
      keyof ServiceAgreement,
      ServiceAgreementsFilter,
      ServiceAgreementsSortBy
    >
  ) =>
    BaseApi.get<{
      serviceAgreements: ServiceAgreement[];
      meta: QueryMeta;
    }>({
      path: `/${resourceModel}?${constructQuery(query)}`,
      session,
    }),

  getByHireType: async (session: UserSession, hireType: HireType) =>
    BaseApi.post<{ serviceAgreement: ServiceAgreement }>({
      path: `/${resourceModel}`,
      body: {
        hireType,
      },
      session,
    }),
  get: async (session: UserSession, serviceAgreementId: string) =>
    BaseApi.get<{ serviceAgreement: ServiceAgreement }>({
      path: `/${resourceModel}/${serviceAgreementId}`,
      session,
    }),
  signAgreement: async (session: UserSession, serviceAgreementId: string) =>
    BaseApi.patch<{
      serviceAgreement: Pick<ServiceAgreement, 'serviceAgreementId' | 'status'>;
    }>({
      path: `/${resourceModel}/${serviceAgreementId}/sign-agreement`,
      session,
    }),
  update: async (
    session: UserSession,
    serviceAgreementId: string,
    body: Partial<Pick<ServiceAgreement, 'status' | 'content'>>
  ) =>
    BaseApi.patch<{ serviceAgreement: ServiceAgreement }>({
      path: `/${resourceModel}/${serviceAgreementId}`,
      body,
      session,
    }),
};
