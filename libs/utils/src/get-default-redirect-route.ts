import { DefaultRouteType } from '@ayp/typings/commons';
import { Role } from '@ayp/typings/entities';

export const getDefaultRedirectRoute = (
  defaultRedirectRoutes: DefaultRouteType,
  role?: Role
): string => {
  if (role?.includes('company'))
    return defaultRedirectRoutes && defaultRedirectRoutes.company;

  if (role?.includes('staff')) return defaultRedirectRoutes.staff;

  if (role?.includes('worker')) return defaultRedirectRoutes.worker;

  return defaultRedirectRoutes.default;
};
