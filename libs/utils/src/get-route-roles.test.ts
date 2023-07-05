import { Route } from '@ayp/typings/commons';
import { Role, UserType } from '@ayp/typings/entities';

import { getRouteRoles } from './get-route-roles';

const STAFF_ROOT: Route = {
  path: `/staff`,
  roles: [
    Role.GP_STAFF_ADMIN,
    Role.GP_STAFF_AUDITOR,
    Role.GP_STAFF_LEGAL,
    Role.GP_STAFF_MARKETING,
  ],
};

const COMPANY_ROOT: Route = {
  path: `/company`,
  roles: [Role.GP_COMPANY_OWNER],
};

const WORKER_ROOT: Route = {
  path: `/worker`,
  roles: [Role.GP_WORKER],
};

const WORKER_SIGN_IN: Route = {
  path: `/staff/sign-in`,
  roles: [Role['*']],
};

describe('getRouteRoles', () => {
  it('should return empty array when user type is invalid', () => {
    expect(
      getRouteRoles(
        '/',
        'any' as UserType,
        { COMPANY_ROOT },
        { STAFF_ROOT },
        { WORKER_ROOT }
      )
    ).toEqual([]);
  });

  it('should return correct roles when company routes given', () => {
    Object.values({ COMPANY_ROOT }).forEach((route) => {
      expect(
        getRouteRoles(
          route.path,
          UserType.COMPANY,
          { COMPANY_ROOT },
          { STAFF_ROOT },
          { WORKER_ROOT, WORKER_SIGN_IN }
        )
      ).toEqual(route.roles);
    });
  });

  it('should return correct roles when staff routes given', () => {
    Object.values({ STAFF_ROOT }).forEach((route) => {
      expect(
        getRouteRoles(
          route.path,
          UserType.STAFF,
          { COMPANY_ROOT },
          { STAFF_ROOT },
          { WORKER_ROOT, WORKER_SIGN_IN }
        )
      ).toEqual(route.roles);
    });
  });

  it('should return correct roles when worker routes given', () => {
    Object.values({ WORKER_ROOT, WORKER_SIGN_IN }).forEach((route) => {
      expect(
        getRouteRoles(
          route.path,
          UserType.WORKER,
          { COMPANY_ROOT },
          { STAFF_ROOT },
          { WORKER_ROOT, WORKER_SIGN_IN }
        )
      ).toEqual(route.roles);
    });
  });
});
