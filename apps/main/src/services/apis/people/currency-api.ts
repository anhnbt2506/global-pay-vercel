import { UserSession } from '@ayp/typings/commons';
import { Currency } from '@ayp/typings/entities';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/currency';

export const CurrencyApi = {
  getCurrencies: async (session: UserSession) =>
    BaseApi.get<{ currencies: Currency[] }>({
      path: `/${resourceModel}`,
      session,
    }),
  getCurrenciesForInvoice: async (session: UserSession) =>
    BaseApi.get<{ currencies: Currency[] }>({
      path: `/${resourceModel}/invoicing`,
      session,
    }),
};
