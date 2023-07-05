import { FeatureFlag } from '@ayp/typings/entities';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/feature-flag';

export const FeatureFlagApi = {
  get: async () =>
    BaseApi.get<{ featureFlags: FeatureFlag[] }>({
      path: `/${resourceModel}`,
    }),
};
