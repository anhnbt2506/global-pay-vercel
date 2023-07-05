import { FeatureFlagKey, Role } from '@ayp/typings/entities';
import { Route } from '@ayp/typings/commons';

const ROUTE_PREFIX = '/company';
const LABEL_PREFIX = 'primarySidebar.company';

export const HELP_CENTER: Route = {
  newTab: true,
  icon: 'SchoolIcon',
  label: `${LABEL_PREFIX}.helpCenter`,
  path: 'https://info.ayp-group.com/knowledge',
  roles: [Role.GP_COMPANY],
  featureFlagKey: FeatureFlagKey.HELP_CENTER,
};

export const COMPANY_ROOT: Route = {
  path: `${ROUTE_PREFIX}`,
  roles: [Role.GP_COMPANY_OWNER],
};

export const COMPANY_SIGN_IN: Route = {
  path: `${ROUTE_PREFIX}/sign-in`,
  roles: [Role['*']],
};

export const COMPANY_SIGN_UP: Route = {
  path: `${ROUTE_PREFIX}/sign-up`,
  roles: [Role['*']],
};

export const COMPANY_AGREEMENT = {
  path: `${ROUTE_PREFIX}/agreement/{{agreementId}}`,
  roles: [Role.GP_COMPANY_OWNER],
};

export const COMPANY_ONBOARDING: Route = {
  path: `${ROUTE_PREFIX}/onboarding`,
  roles: [Role.GP_COMPANY_OWNER],
};

export const COMPANY_DASHBOARD: Route = {
  path: `${ROUTE_PREFIX}/dashboard`,
  icon: 'Dashboard',
  label: `${LABEL_PREFIX}.dashboard`,
  roles: [Role.GP_COMPANY_OWNER],
};

export const COMPANY_PEOPLE_WORKFORCE: Route = {
  path: `${ROUTE_PREFIX}/people/workforce`,
  roles: [Role.GP_COMPANY_OWNER],
  label: `${LABEL_PREFIX}.people.workforce`,
};

export const COMPANY_PEOPLE_WORKFORCE_WORKER_DETAIL: Route = {
  path: `${ROUTE_PREFIX}/people/workforce/{{employmentId}}`,
  roles: [Role.GP_COMPANY_OWNER],
};

export const COMPANY_PEOPLE_ONBOARDING: Route = {
  path: `${ROUTE_PREFIX}/people/onboarding`,
  roles: [Role.GP_COMPANY_OWNER],
  label: `${LABEL_PREFIX}.people.onboarding`,
};

export const COMPANY_PEOPLE_ONBOARDING_CREATE: Route = {
  path: `${ROUTE_PREFIX}/people/onboarding/create`,
  roles: [Role.GP_COMPANY_OWNER],
};

export const COMPANY_PEOPLE_ONBOARDING_WORKER_DETAIL: Route = {
  path: `${ROUTE_PREFIX}/people/onboarding/{{employmentId}}`,
  roles: [Role.GP_COMPANY_OWNER],
};

export const COMPANY_PAYROLL_CALENDAR: Route = {
  path: `${ROUTE_PREFIX}/payroll/calendar`,
  roles: [Role.GP_COMPANY_OWNER],
  label: `${LABEL_PREFIX}.payroll.calendar`,
};

export const COMPANY_PAYROLL_DASHBOARD: Route = {
  path: `${ROUTE_PREFIX}/payroll/dashboard`,
  roles: [Role.GP_COMPANY_OWNER],
  label: `${LABEL_PREFIX}.payroll.dashboard`,
};

export const COMPANY_PAYROLL_COMPANY_PAYROLL = {
  path: `${ROUTE_PREFIX}/payroll/company-payroll`,
  roles: [Role.GP_COMPANY_OWNER],
};

export const COMPANY_PAYROLL_COMPANY_PAYROLL_DETAIL = {
  path: `${ROUTE_PREFIX}/payroll/company-payroll/{{id}}`,
  roles: [Role.GP_COMPANY_OWNER],
};

export const COMPANY_DOWNLOAD: Route = {
  path: `${ROUTE_PREFIX}/download`,
  roles: [Role.GP_COMPANY_OWNER],
};
