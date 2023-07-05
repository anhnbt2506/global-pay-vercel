import { Role } from '@ayp/typings/entities';

import { isUserPermitted } from '.';

describe('isUserPermitted', () => {
  it('should return false role is undefined', () => {
    expect(isUserPermitted([])).toBe(false);
    expect(isUserPermitted([Role.GP_COMPANY_OWNER])).toBe(false);
    expect(isUserPermitted([Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR])).toBe(
      false
    );
  });

  it('should return false when no permissions given', () => {
    expect(isUserPermitted([], Role.GP_COMPANY_OWNER)).toBe(false);
    expect(isUserPermitted([], Role.GP_STAFF_ADMIN)).toBe(false);
    expect(isUserPermitted([], Role.GP_STAFF_AUDITOR)).toBe(false);
  });

  it('should return false when permission does not match', () => {
    expect(isUserPermitted([Role.GP_STAFF], Role.GP_COMPANY_OWNER)).toBe(false);
    expect(isUserPermitted([Role.GP_STAFF_ADMIN], Role.GP_COMPANY_OWNER)).toBe(
      false
    );
    expect(
      isUserPermitted([Role.GP_STAFF_AUDITOR], Role.GP_COMPANY_OWNER)
    ).toBe(false);
  });

  it('should return false when wildcard permission given to the unmatched roles', () => {
    expect(isUserPermitted([Role.GP_STAFF], Role.GP_COMPANY_OWNER)).toBe(false);
    expect(isUserPermitted([Role.GP_COMPANY], Role.GP_STAFF_ADMIN)).toBe(false);
    expect(isUserPermitted([Role.GP_COMPANY], Role.GP_STAFF_AUDITOR)).toBe(
      false
    );
  });

  it('should return true when wildcard permission given', () => {
    expect(isUserPermitted([Role['*']], Role.GP_COMPANY_OWNER)).toBe(true);
    expect(isUserPermitted([Role['*']], Role.GP_STAFF_ADMIN)).toBe(true);
    expect(isUserPermitted([Role['*']], Role.GP_STAFF_AUDITOR)).toBe(true);
  });

  it('should return true when wildcard permission given to the respective roles', () => {
    expect(isUserPermitted([Role.GP_COMPANY], Role.GP_COMPANY_OWNER)).toBe(
      true
    );
    expect(isUserPermitted([Role.GP_STAFF], Role.GP_STAFF_ADMIN)).toBe(true);
    expect(isUserPermitted([Role.GP_STAFF], Role.GP_STAFF_AUDITOR)).toBe(true);
  });

  it('should return true when mutiple permission given to the respective roles', () => {
    expect(
      isUserPermitted(
        [Role.GP_COMPANY_OWNER, Role.GP_STAFF_ADMIN],
        Role.GP_COMPANY_OWNER
      )
    ).toBe(true);
    expect(
      isUserPermitted(
        [Role.GP_COMPANY_OWNER, Role.GP_STAFF_ADMIN],
        Role.GP_STAFF_ADMIN
      )
    ).toBe(true);
  });
});
