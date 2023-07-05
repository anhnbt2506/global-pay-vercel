import { Role } from '@ayp/typings/entities';
import { Route } from '@ayp/typings/commons';

const LABEL_PREFIX = 'primarySidebar.root';

export const ROOT: Route = {
  path: '/',
  roles: [Role['*']],
};

export const LIVE_SUPPORT: Route = {
  newTab: true,
  icon: 'SupportAgent',
  label: `${LABEL_PREFIX}.liveSupport`,
  path: '/live-support',
  roles: [Role['*']],
};
