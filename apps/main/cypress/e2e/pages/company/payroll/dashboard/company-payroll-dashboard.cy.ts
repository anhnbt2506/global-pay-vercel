import { COMPANY_OWNER } from '@fixtures/users';

describe('company/payroll/dashboard', () => {
  describe('when accessing /company/payroll/dashboard', () => {
    before(() => {
      cy.useMocksApiClientFintech();
      cy.mocksUseRouteVariant(
        'fintech/v1/company-payroll/statistics:200-success'
      );
      cy.login(COMPANY_OWNER);
      cy.visit('/company/payroll/dashboard');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should load page correctly with statistics data', () => {
      cy.url().should('include', '/company/payroll/dashboard');
      cy.get(
        '[data-testid="companyPayrollDashboard-payrollDraft-container"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPayrollDashboard-offCyclePayroll-container"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPayrollDashboard-payrollCard-Draft"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPayrollDashboard-payrollCard-Pending"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPayrollDashboard-payrollCard-Rejected"]'
      ).should('be.visible');
    });
  });

  describe('call api payroll statistics empty success ', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'fintech/v1/company-payroll/statistics:200-success-return-empty'
      );
      cy.login(COMPANY_OWNER);
      cy.visit('/company/payroll/dashboard');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should load page correctly with statistics data', () => {
      cy.url().should('include', '/company/payroll/dashboard');
      cy.get(
        '[data-testid="companyPayrollDashboard-offCyclePayroll-container"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPayrollDashboard-payrollCard-Draft"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPayrollDashboard-payrollCard-Pending"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPayrollDashboard-payrollCard-Rejected"]'
      ).should('be.visible');
    });
  });
});
