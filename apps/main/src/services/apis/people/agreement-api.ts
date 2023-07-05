import { UserSession } from '@ayp/typings/commons';
import { Agreement } from '@ayp/typings/entities';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/agreement';

export const AgreementApi = {
  get: async (session: UserSession, agreementId: string) =>
    BaseApi.get<{ agreement: Agreement }>({
      path: `/${resourceModel}/${agreementId}`,
      session,
    }),
};
