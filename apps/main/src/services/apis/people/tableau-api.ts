import { UserSession } from '@ayp/typings/commons';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/tableau';

export const TableauApi = {
  requestToken: async (session: UserSession) =>
    BaseApi.post<{ token: string }>({
      path: `/${resourceModel}/request-token`,
      session,
      body: {
        username: `viewer0${(new Date().valueOf() % 5) + 1}`,
      },
    }),
};
