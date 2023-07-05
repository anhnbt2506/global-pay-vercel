import { FeatureFlagKey, Role } from '@ayp/typings/entities';
import { Route } from '@ayp/typings/commons';
import { isUserPermitted } from '@ayp/utils/is-user-permitted';

import {
  COMPANY_DASHBOARD,
  COMPANY_PAYROLL_CALENDAR,
  COMPANY_PAYROLL_DASHBOARD,
  COMPANY_PEOPLE_ONBOARDING,
  COMPANY_PEOPLE_WORKFORCE,
  LIVE_SUPPORT,
  STAFF_AUDIT_CLIENT_HIRES,
  STAFF_AUDIT_CLIENT_LIST,
  STAFF_AUDIT_CLIENT_SERVICE_AGREEMENTS,
  STAFF_SETUP_CALENDAR,
  STAFF_SETUP_INDUSTRY,
  STAFF_SETUP_INTEGRATION,
  STAFF_CONTRACTS_PEO_AGREEMENT,
  STAFF_CONTRACTS_SERVICE_AGREEMENT,
  STAFF_HOME,
  STAFF_EMAIL_TEMPLATES,
  STAFF_PAYROLL_CALENDAR,
  STAFF_PAYROLL_DASHBOARD,
  WORKER_HOME,
  STAFF_CONTRACTS_EOR_AGREEMENT,
  HELP_CENTER,
} from '@configs/routes';

const STAFF_LABEL_PREFIX = 'primarySidebar.staff';

export const STAFF_SIDEBAR: Route[] = [
  STAFF_HOME,
  {
    path: '#',
    icon: 'Sync',
    roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
    label: `${STAFF_LABEL_PREFIX}.audit.title`,
    children: [
      STAFF_AUDIT_CLIENT_LIST,
      STAFF_AUDIT_CLIENT_HIRES,
      STAFF_AUDIT_CLIENT_SERVICE_AGREEMENTS,
    ],
  },
  {
    path: '#',
    icon: 'Build',
    roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
    label: `${STAFF_LABEL_PREFIX}.setup.title`,
    children: [
      STAFF_SETUP_CALENDAR,
      STAFF_SETUP_INDUSTRY,
      STAFF_SETUP_INTEGRATION,
    ],
  },
  {
    path: '#',
    icon: 'Article',
    roles: [Role.GP_STAFF_ADMIN],
    label: `${STAFF_LABEL_PREFIX}.contracts.title`,
    children: [
      STAFF_CONTRACTS_EOR_AGREEMENT,
      STAFF_CONTRACTS_PEO_AGREEMENT,
      STAFF_CONTRACTS_SERVICE_AGREEMENT,
    ],
  },
  STAFF_EMAIL_TEMPLATES,
  {
    path: '#',
    icon: 'Monetization',
    roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
    label: `${STAFF_LABEL_PREFIX}.payroll.title`,
    children: [STAFF_PAYROLL_DASHBOARD, STAFF_PAYROLL_CALENDAR],
  },
];

const COMPANY_LABEL_PREFIX = 'primarySidebar.company';

export const COMPANY_SIDEBAR: Route[] = [
  COMPANY_DASHBOARD,
  {
    path: '#',
    icon: 'People',
    roles: [Role.GP_COMPANY_OWNER],
    label: `${COMPANY_LABEL_PREFIX}.people.title`,
    children: [COMPANY_PEOPLE_ONBOARDING, COMPANY_PEOPLE_WORKFORCE],
  },
  {
    path: '#',
    icon: 'Monetization',
    roles: [Role.GP_COMPANY_OWNER],
    label: `${COMPANY_LABEL_PREFIX}.payroll.title`,
    children: [COMPANY_PAYROLL_DASHBOARD, COMPANY_PAYROLL_CALENDAR],
  },
  LIVE_SUPPORT,
  HELP_CENTER,
];

export const WORKER_SIDEBAR: Route[] = [WORKER_HOME];

export const getSidebarItems = (
  role?: Role,
  featureFlag?: Partial<Record<FeatureFlagKey, boolean>>
) => {
  if (!role) return [];

  const filterByRoleAndFeatureFlag = (routes: Route[]): Route[] =>
    routes.reduce((prev, route) => {
      if (route.children) {
        const children = route.children.filter(
          (item) =>
            (featureFlag && item.featureFlagKey
              ? featureFlag[item.featureFlagKey]
              : true) && isUserPermitted(item.roles, role)
        );
        if (children.length) {
          prev.push({
            ...route,
            children,
          });
        }
      } else if (isUserPermitted(route.roles, role)) {
        if (featureFlag && route.featureFlagKey) {
          if (featureFlag[route.featureFlagKey]) {
            prev.push(route);
          }
        } else {
          prev.push(route);
        }
      }

      return prev;
    }, [] as Route[]);

  if (role.includes('staff')) {
    return filterByRoleAndFeatureFlag(STAFF_SIDEBAR);
  }

  if (role.includes('company')) {
    return filterByRoleAndFeatureFlag(COMPANY_SIDEBAR);
  }

  if (role.includes('worker')) {
    return filterByRoleAndFeatureFlag(WORKER_SIDEBAR);
  }

  return [];
};
