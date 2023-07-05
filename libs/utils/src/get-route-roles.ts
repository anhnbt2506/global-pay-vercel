import { Route } from '@ayp/typings/commons';
import { Role, UserType } from '@ayp/typings/entities';

import { renderString } from './render-string';

export const getRouteRoles = (
  path: string,
  userType: UserType,
  companyRoutes: Record<string, Route>,
  staffRoutes: Record<string, Route>,
  workerRoutes: Record<string, Route>
): Role[] => {
  const getRoles = (routes: Record<string, Route>) => {
    let roles: Role[] = [];
    for (const key of Object.keys(routes)) {
      const route = routes[key];
      if (new RegExp(`${renderString(route.path, {}, '.+')}$`).test(path)) {
        roles = route.roles;
        break;
      }
    }

    return roles;
  };

  switch (userType) {
    case UserType.COMPANY:
      return getRoles(companyRoutes);
    case UserType.STAFF:
      return getRoles(staffRoutes);
    case UserType.WORKER:
      return getRoles(workerRoutes);
    default:
      return [];
  }
};
