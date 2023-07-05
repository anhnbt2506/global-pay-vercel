import { DefaultRouteType, Route } from '@ayp/typings/commons';
import { Role } from '@ayp/typings/entities';

import { getDefaultRedirectRoute } from './get-default-redirect-route';

const COMPANY_SIGN_IN: Route = {
  path: `/company/sign-in`,
  roles: [Role['*']],
};

const STAFF_SIGN_IN: Route = {
  path: `/staff/sign-in`,
  roles: [Role['*']],
};

const WORKER_SIGN_IN: Route = {
  path: `/worker/sign-in`,
  roles: [Role['*']],
};

const ROOT: Route = {
  path: '/',
  roles: [Role['*']],
};

const DEFAULT_REDIRECT_ROUTES: DefaultRouteType = {
  company: COMPANY_SIGN_IN.path,
  staff: STAFF_SIGN_IN.path,
  worker: WORKER_SIGN_IN.path,
  default: ROOT.path,
};

describe('getDefaultRedirectRoute', () => {
  it('should return root path if role is undefined', () => {
    expect(getDefaultRedirectRoute(DEFAULT_REDIRECT_ROUTES)).toBe(ROOT.path);
  });

  it('should return company sign in path when company user', () => {
    expect(
      getDefaultRedirectRoute(DEFAULT_REDIRECT_ROUTES, Role.GP_COMPANY_OWNER)
    ).toBe(COMPANY_SIGN_IN.path);
  });

  it('should return staff sign in path when staff user', () => {
    expect(
      getDefaultRedirectRoute(DEFAULT_REDIRECT_ROUTES, Role.GP_STAFF_ADMIN)
    ).toBe(STAFF_SIGN_IN.path);
    expect(
      getDefaultRedirectRoute(DEFAULT_REDIRECT_ROUTES, Role.GP_STAFF_AUDITOR)
    ).toBe(STAFF_SIGN_IN.path);
  });

  it('should return worker sign in path when worker user', () => {
    expect(
      getDefaultRedirectRoute(DEFAULT_REDIRECT_ROUTES, Role.GP_WORKER)
    ).toBe(WORKER_SIGN_IN.path);
  });
});
