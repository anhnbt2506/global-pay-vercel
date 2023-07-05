import { Country } from '@ayp/typings/entities';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/country';

export const CountryApi = {
  getCountries: async () =>
    BaseApi.get<{ countries: Country[] }>({ path: `/${resourceModel}` }),
};
