import { COMPANY_OWNER, STAFF_AUDITOR } from '@fixtures/users';

export const mockedCompanyPayrollId = 'mk6eo1fzpchuovz6';

export const mockDataAndVisitCompanyPayroll = (
  tab?: string,
  isCompany?: boolean
) => {
  cy.useMocksApiClientFintech();
  cy.mocksUseRouteVariant('fintech/v1/company-payroll/statistics:200-success');
  cy.mocksUseRouteVariant('fintech/v1/company-payroll:200-success');

  if (isCompany) {
    cy.login(COMPANY_OWNER);
  } else {
    cy.login(STAFF_AUDITOR);
  }

  cy.visit(`/staff/payroll/company-payroll${tab ? `?tab=${tab}` : ''}`);
};

export const mockDataAndVisitCompanyPayrollDetail = (
  suffixes?: string,
  isCompany?: boolean
) => {
  cy.useMocksApiClientFintech();
  cy.mocksUseRouteVariant(
    `fintech/v1/company-payroll/get-by-id:200-success${
      suffixes ? `-${suffixes}` : ''
    }`
  );
  cy.mocksUseRouteVariant('fintech/v1/company-payroll/statistics:200-success');
  if (isCompany) {
    cy.login(COMPANY_OWNER);
  } else {
    cy.login(STAFF_AUDITOR);
  }
  cy.visit(
    `/${
      isCompany ? 'company' : 'staff'
    }/payroll/company-payroll/${mockedCompanyPayrollId}`
  );
};

export const submitUpdateStatus = () => {
  cy.get(
    '[data-testid="staffPayroll-companyPayrollId-actions-buttonUpdateStatus"]'
  ).click();
  cy.get(
    '[data-testid="staffPayroll-companyPayrollId-updatePayrollStatusModal-radioGroup-PENDING_REVIEW"]'
  ).click();
  cy.get(
    '[data-testid="staffPayroll-companyPayrollId-updatePayrollStatusModal-buttonSubmit"]'
  ).click();
};
