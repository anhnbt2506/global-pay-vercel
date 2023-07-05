import { UserSession } from '@ayp/typings/commons';
import { AgreementTemplate } from '@ayp/typings/entities';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/agreement-template';

export const AgreementTemplateApi = {
  get: async (session: UserSession, agreementTemplateId: string) =>
    BaseApi.get<{
      agreementTemplate: AgreementTemplate;
      autoFillTags: string[];
    }>({
      path: `/${resourceModel}/${agreementTemplateId}`,
      session,
    }),
  getPreviewById: async (
    session: UserSession,
    agreementTemplateId: string,
    agreementVariables: Record<string, unknown>
  ) =>
    BaseApi.post<{ agreementTemplate: AgreementTemplate }>({
      path: `/${resourceModel}/${agreementTemplateId}/preview`,
      session,
      body: agreementVariables,
    }),
  update: async (
    session: UserSession,
    agreementTemplate: Pick<
      AgreementTemplate,
      'agreementTemplateId' | 'content'
    >
  ) =>
    BaseApi.patch({
      path: `/${resourceModel}/${agreementTemplate.agreementTemplateId}`,
      body: {
        content: agreementTemplate.content,
      },
      session,
    }),
};
