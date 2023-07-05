import { COMPANY_OWNER } from '@fixtures/users';

export const mockedCompanyPayrollId = 'mk6eo1fzpchuovz6';

export const mockDataAndVisitCompanyPayroll = (tab?: string) => {
  cy.useMocksApiClientFintech();
  cy.mocksUseRouteVariant('fintech/v1/company-payroll/statistics:200-success');
  cy.mocksUseRouteVariant('fintech/v1/company-payroll:200-success');

  cy.login(COMPANY_OWNER);

  cy.visit(`/company/payroll/company-payroll${tab ? `?tab=${tab}` : ''}`);
};

export const mockDataAndVisitCompanyPayrollDetail = (suffixes?: string) => {
  cy.useMocksApiClientFintech();
  cy.mocksUseRouteVariant(
    `fintech/v1/company-payroll/get-by-id:200-success${
      suffixes ? `-${suffixes}` : ''
    }`
  );
  cy.mocksUseRouteVariant('fintech/v1/company-payroll/statistics:200-success');
  cy.login(COMPANY_OWNER);
  cy.visit(`/company/payroll/company-payroll/${mockedCompanyPayrollId}`);
};
