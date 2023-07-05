import { EmailTemplates, UserSession } from '@ayp/typings/commons';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/email-template';

export const EmailTemplateApi = {
  getTemplateNames: async (session: UserSession) =>
    BaseApi.get<{ emailTemplates: Array<string> }>({
      path: `/${resourceModel}`,
      session,
    }),
  getTemplate: async (session: UserSession, templateName: string) =>
    BaseApi.get<{
      templateName: EmailTemplates;
      subjectPart: string;
      htmlPart: string;
      autoFillTags: string[];
      cc: string[];
    }>({
      path: `/${resourceModel}/${templateName}`,
      session,
    }),
  update: async (
    session: UserSession,
    templateName: string,
    subjectPart: string,
    htmlPart: string,
    cc?: string[]
  ) =>
    BaseApi.patch({
      path: `/${resourceModel}/${templateName}`,
      body: {
        subjectPart,
        htmlPart,
        cc,
      },
      session,
    }),
};
