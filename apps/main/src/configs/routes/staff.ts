import { Role } from '@ayp/typings/entities';
import { Route } from '@ayp/typings/commons';

const ROUTE_PREFIX = '/staff';
const LABEL_PREFIX = 'primarySidebar.staff';

export const STAFF_ROOT: Route = {
  path: `${ROUTE_PREFIX}`,
  roles: [
    Role.GP_STAFF_ADMIN,
    Role.GP_STAFF_AUDITOR,
    Role.GP_STAFF_LEGAL,
    Role.GP_STAFF_MARKETING,
  ],
};

export const STAFF_SIGN_IN: Route = {
  path: `${ROUTE_PREFIX}/sign-in`,
  roles: [Role['*']],
};

export const STAFF_HOME: Route = {
  path: `${ROUTE_PREFIX}/home`,
  icon: 'Dashboard',
  label: `${LABEL_PREFIX}.home`,
  roles: [
    Role.GP_STAFF_ADMIN,
    Role.GP_STAFF_AUDITOR,
    Role.GP_STAFF_LEGAL,
    Role.GP_STAFF_MARKETING,
  ],
};

export const STAFF_AUDIT_CLIENT_HIRES: Route = {
  path: `${ROUTE_PREFIX}/audit/client-hires`,
  label: `${LABEL_PREFIX}.audit.clientHires`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
};

export const STAFF_AUDIT_CLIENT_HIRES_DETAIL = {
  path: `${ROUTE_PREFIX}/audit/client-hires/{{employmentId}}`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
};

export const STAFF_AUDIT_CLIENT_HIRES_DOWNLOAD_CONTRACT = {
  path: `${ROUTE_PREFIX}/audit/client-hires/{{employmentId}}/download-contract`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
};

export const STAFF_AUDIT_CLIENT_LIST: Route = {
  path: `${ROUTE_PREFIX}/audit/client-list`,
  label: `${LABEL_PREFIX}.audit.clientList`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
};

export const STAFF_AUDIT_CLIENT_LIST_DETAIL = {
  path: `${ROUTE_PREFIX}/audit/client-list/{{companyId}}`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
};

export const STAFF_AUDIT_CLIENT_SERVICE_AGREEMENTS: Route = {
  path: `${ROUTE_PREFIX}/audit/client-service-agreements`,
  label: `${LABEL_PREFIX}.audit.clientServiceAgreements`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR, Role.GP_STAFF_LEGAL],
};

export const STAFF_AUDIT_CLIENT_SERVICE_AGREEMENTS_DETAIL: Route = {
  path: `${ROUTE_PREFIX}/audit/client-service-agreements/{{serviceAgreementId}}`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR, Role.GP_STAFF_LEGAL],
};

export const STAFF_SETUP_CALENDAR: Route = {
  path: `${ROUTE_PREFIX}/setup/calendar`,
  label: `${LABEL_PREFIX}.setup.calendar`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
};

export const STAFF_SETUP_INDUSTRY: Route = {
  path: `${ROUTE_PREFIX}/setup/industry`,
  label: `${LABEL_PREFIX}.setup.industry`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
};

export const STAFF_SETUP_INTEGRATION: Route = {
  path: `${ROUTE_PREFIX}/setup/integration`,
  label: `${LABEL_PREFIX}.setup.integration`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
};

export const STAFF_CONTRACTS_EOR_AGREEMENT: Route = {
  path: `${ROUTE_PREFIX}/contracts/eor-agreement`,
  label: `${LABEL_PREFIX}.contracts.eorAgreement`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_LEGAL],
};

export const STAFF_CONTRACTS_PEO_AGREEMENT: Route = {
  path: `${ROUTE_PREFIX}/contracts/peo-agreement`,
  label: `${LABEL_PREFIX}.contracts.peoAgreement`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_LEGAL],
};

export const STAFF_CONTRACTS_SERVICE_AGREEMENT: Route = {
  path: `${ROUTE_PREFIX}/contracts/service-agreement`,
  label: `${LABEL_PREFIX}.contracts.serviceAgreement`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_LEGAL],
};

export const STAFF_EMAIL_TEMPLATES: Route = {
  path: `${ROUTE_PREFIX}/email-templates`,
  icon: 'Email',
  label: `${LABEL_PREFIX}.emailTemplates`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_MARKETING],
};

export const STAFF_PAYROLL_CALENDAR: Route = {
  path: `${ROUTE_PREFIX}/payroll/calendar`,
  label: `${LABEL_PREFIX}.payroll.calendar`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
};

export const STAFF_PAYROLL_DASHBOARD: Route = {
  path: `${ROUTE_PREFIX}/payroll/dashboard`,
  label: `${LABEL_PREFIX}.payroll.dashboard`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
};

export const STAFF_PAYROLL_COMPANY_PAYROLL = {
  path: `${ROUTE_PREFIX}/payroll/company-payroll`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
};

export const STAFF_PAYROLL_COMPANY_PAYROLL_DETAIL = {
  path: `${ROUTE_PREFIX}/payroll/company-payroll/{{id}}`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
};

export const STAFF_DOWNLOAD: Route = {
  path: `${ROUTE_PREFIX}/download`,
  roles: [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
};
