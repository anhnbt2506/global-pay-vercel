import { STAFF_AUDITOR } from '@fixtures/users';

describe('staff/payroll/dashboard', () => {
  describe('when accessing /staff/payroll/dashboard', () => {
    before(() => {
      cy.useMocksApiClientFintech();
      cy.mocksUseRouteVariant(
        'fintech/v1/company-payroll/statistics:200-success'
      );
      cy.login(STAFF_AUDITOR);
      cy.visit('/staff/payroll/dashboard');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should load page correctly with statistics data', () => {
      cy.url().should('include', '/staff/payroll/dashboard');
      cy.get(
        '[data-testid="staffPayrollDashboard-payrollDraft-container"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffPayrollDashboard-offCyclePayroll-container"]'
      ).should('be.visible');
      cy.get('[data-testid="staffPayrollDashboard-payrollCard-Draft"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffPayrollDashboard-payrollCard-Pending"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffPayrollDashboard-payrollCard-Rejected"]'
      ).should('be.visible');
    });
  });

  describe('call api payroll statistics empty success ', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'fintech/v1/company-payroll/statistics:200-success-return-empty'
      );
      cy.login(STAFF_AUDITOR);
      cy.visit('/staff/payroll/dashboard');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should load page correctly with statistics data', () => {
      cy.url().should('include', '/staff/payroll/dashboard');
      cy.get(
        '[data-testid="staffPayrollDashboard-offCyclePayroll-container"]'
      ).should('be.visible');
      cy.get('[data-testid="staffPayrollDashboard-payrollCard-Draft"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffPayrollDashboard-payrollCard-Pending"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffPayrollDashboard-payrollCard-Rejected"]'
      ).should('be.visible');
    });
  });
});
