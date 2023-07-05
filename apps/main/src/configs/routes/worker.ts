import { Role } from '@ayp/typings/entities';
import { Route } from '@ayp/typings/commons';

const ROUTE_PREFIX = '/worker';
const LABEL_PREFIX = 'primarySidebar.worker';

export const WORKER_ROOT: Route = {
  path: `${ROUTE_PREFIX}`,
  roles: [Role.GP_WORKER],
};

export const WORKER_SIGN_IN: Route = {
  path: `${ROUTE_PREFIX}/sign-in`,
  roles: [Role['*']],
};

export const WORKER_HOME: Route = {
  path: `${ROUTE_PREFIX}/home`,
  icon: 'Dashboard',
  label: `${LABEL_PREFIX}.home`,
  roles: [Role.GP_WORKER],
};

export const WORKER_ONBOARDING: Route = {
  path: `${ROUTE_PREFIX}/onboarding`,
  roles: [Role.GP_WORKER],
};
export const WORKER_EMPLOYMENT_CONTRACT: Route = {
  path: `${ROUTE_PREFIX}/employment-contract`,
  roles: [Role.GP_WORKER],
};

export const WORKER_AGREEMENT: Route = {
  path: `${ROUTE_PREFIX}/agreement/{{agreementId}}`,
  roles: [Role.GP_WORKER],
};
