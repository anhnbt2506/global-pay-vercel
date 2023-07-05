import { Role } from '@ayp/typings/entities';

export const isUserPermitted = (roles: Role[], role?: Role): boolean => {
  if (!role) return false;

  for (const permission of roles) {
    if (permission === Role['*']) return true;

    if (new RegExp(permission).test(role)) return true;
  }

  return false;
};
