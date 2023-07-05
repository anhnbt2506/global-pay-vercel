import { Query, QueryMeta, UserSession } from '@ayp/typings/commons';
import {
  Agreement,
  BankAccount,
  Company,
  CompanyCategory,
  CompanyFilter,
  CompanyHongKong,
  CompanyIndonesia,
  CompanyMalaysia,
  CompanySingapore,
  CompanySortBy,
  CompanyThailand,
  Currency,
  EntityLinking,
  EntityLinkStatus,
  HireType,
} from '@ayp/typings/entities';
import { constructQuery } from '@ayp/utils';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/company';

export interface EntityLinkParams {
  initiatingCompanyId: string;
  linkingType: Nullable<EntityLinkStatus>;
}

export interface CompanyRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  countryCode: Nullable<string>;
  interest: string;
  jobTitle: string;
  name: string;
  category: CompanyCategory;
  industryId: Nullable<string>;
  entityLink?: EntityLinkParams;
}

export type CompanyCreateServiceDetailsRequest =
  | CompanyHongKong
  | CompanyIndonesia
  | CompanyMalaysia
  | CompanySingapore
  | CompanyThailand;

export type CompanyUpdateServiceDetailsRequest =
  CompanyCreateServiceDetailsRequest & {
    companyId: string;
    token: string;
  };

export const CompanyApi = {
  get: async (session: UserSession) =>
    BaseApi.get<{ company: Company }>({
      path: `/${resourceModel}`,
      session,
    }),
  onboard: async (session: UserSession) =>
    BaseApi.get<{
      company: Company;
      currencies: Currency[];
    }>({
      path: `/${resourceModel}/onboard`,
      session,
    }),
  listAll: async (session: UserSession) =>
    BaseApi.get<{
      companies: Pick<Company, 'companyId' | 'name'>[];
    }>({
      path: `/${resourceModel}/list-all`,
      session,
    }),
  update: async (session: UserSession, company: unknown) =>
    BaseApi.patch({ path: `/${resourceModel}`, body: company, session }),

  updateByCompanyId: async (
    session: UserSession,
    companyId: string,
    company: Partial<Company>
  ) =>
    BaseApi.patch({
      path: `/${resourceModel}/${companyId}`,
      body: company,
      session,
    }),

  dashboard: async (session: UserSession) =>
    BaseApi.get({ path: `/${resourceModel}/dashboard`, session }),
  list: async (
    session: UserSession,
    query: Query<keyof Company, CompanyFilter, CompanySortBy>
  ) =>
    BaseApi.get<{ companies: Company[]; meta: QueryMeta }>({
      path: `/${resourceModel}/list?${constructQuery(query)}`,
      session,
    }),
  getByCompanyId: async (
    session: UserSession,
    query: Query<keyof Company, CompanyFilter, CompanySortBy>,
    companyId: string
  ) =>
    BaseApi.get<{ company: Company }>({
      session,
      path: `/${resourceModel}/${companyId}?${constructQuery(query)}`,
    }),
  post: async (session: UserSession, body: CompanyRegisterRequest) =>
    BaseApi.post({
      path: `/${resourceModel}`,
      body,
      session,
    }),
  signAgreement: async (
    session: UserSession,
    agreementVariables: Record<string, unknown>
  ) =>
    BaseApi.post<{ agreement: Pick<Agreement, 'agreementId'> }>({
      path: `/${resourceModel}/sign-agreement`,
      body: agreementVariables,
      session,
    }),
  checkCountryServiceDetails: async (
    session: UserSession,
    hireType: HireType,
    countryCode: string
  ) =>
    BaseApi.get<{ hasSubmitted: boolean }>({
      path: `/${resourceModel}/hire-type/${hireType}/${countryCode}/check`,
      session,
    }),
  createCountryServiceDetails: async (
    session: UserSession,
    hireType: HireType,
    countryCode: string,
    body: CompanyCreateServiceDetailsRequest
  ) =>
    BaseApi.post({
      path: `/${resourceModel}/hire-type/${hireType}/${countryCode}`,
      body,
      session,
    }),
  updateCountryServiceDetails: async (
    session: UserSession,
    hireType: HireType,
    countryCode: string,
    body: CompanyUpdateServiceDetailsRequest
  ): Promise<{
    hireType: Record<string, unknown> & {
      bankAccount: Nullable<BankAccount>;
    };
  }> =>
    BaseApi.patch({
      path: `/${resourceModel}/hire-type/${hireType}/${countryCode}`,
      body,
      session,
    }),
  getServiceDetails: async (
    session: UserSession,
    hireType: HireType,
    countryCode: string,
    body: {
      companyId: string;
      password?: string;
    }
  ): Promise<{
    data: {
      hireType: Record<string, unknown> & {
        bankAccount: Nullable<BankAccount>;
      };
    };
    context?: {
      token: string;
    };
  }> =>
    BaseApi.post({
      path: `/${resourceModel}/hire-type/${hireType}/${countryCode}/get`,
      body,
      session,
      raw: true,
    }),
  getEntityLinking: async (session: UserSession, companyId: string) =>
    BaseApi.get<{ companyEntityLink: EntityLinking }>({
      path: `/${resourceModel}/${companyId}/entity-link`,
      session,
    }),
  unlinkEntity: async (
    session: UserSession,
    companyId: string,
    entityUnlinkId: string
  ) =>
    BaseApi.delete({
      path: `/${resourceModel}/${companyId}/entity-link`,
      body: {
        entityUnlinkId,
      },
      session,
    }),
  linkExistingEntity: async (
    session: UserSession,
    companyId: string,
    body: {
      linkingCompanyId: string;
      linkingType: Nullable<EntityLinkStatus>;
    }
  ) =>
    BaseApi.patch({
      path: `/${resourceModel}/${companyId}/entity-link`,
      session,
      body,
    }),
};
