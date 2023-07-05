import { Stage } from '@ayp/typings/commons';

import { Environment } from './get-env';

export const getAssetUrl = (key: string): string => {
  const stage = Environment.getStage();

  switch (stage) {
    case Stage.PROD:
      return `https://assets.ayp-group.com/${key}`;
    case Stage.DEV_LOCAL:
    case Stage.TESTING:
      return `https://assets-${Stage.DEV}.ayp-group.com/${key}`;
    default:
      return `https://assets-${stage}.ayp-group.com/${key}`;
  }
};
