import { mockDataAndVisitCompanyPayroll } from './config';

describe('company/payroll/company-payroll', () => {
  describe('when accessing /company/payroll/company-payroll', () => {
    before(() => {
      mockDataAndVisitCompanyPayroll();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should load page correctly with empty query', () => {
      cy.url().should('include', '/company/payroll/company-payroll');
      cy.get('.css-xz7pcd').should('be.visible');
    });
  });

  describe('when accessing /company/payroll/company-payroll?tab=draft', () => {
    before(() => {
      mockDataAndVisitCompanyPayroll('draft');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should load page correctly with specific tab data', () => {
      cy.url().should('include', '/company/payroll/company-payroll?tab=draft');
    });

    it('should display correctly column of table', () => {
      cy.viewport(1920, 1080);
      const columnNames = [
        'Country',
        'Service type',
        'Payroll name',
        'Payroll period',
        'Payroll type',
        'Employee no.',
        'Payroll status',
      ];
      const firstRowData = [
        'Singapore',
        'POM',
        '1st Feb 2023 - 28th Feb 2023',
        '1 Feb 2023 - 28 Feb 2023',
        'Regular cycle',
        '0',
        'Draft',
      ];
      columnNames.forEach((value) => cy.contains(value));
      firstRowData.forEach((value) => cy.contains(value));
    });

    it('should move between pages when click next, previously button', () => {
      cy.get('[data-testid="KeyboardArrowRightIcon"]').click();
      cy.contains('26–30 of 30').should('be.visible');
      cy.get('[data-testid="KeyboardArrowLeftIcon"]').click();
      cy.contains('1–25 of 30').should('be.visible');
    });
  });

  describe('when accessing /company/payroll/company-payroll?tab=pending', () => {
    before(() => {
      mockDataAndVisitCompanyPayroll('pending');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should load page correctly with status pending', () => {
      cy.url().should(
        'include',
        '/company/payroll/company-payroll?tab=pending'
      );
    });

    it('should display correctly column of table', () => {
      cy.viewport(1920, 1080);
      const columnNames = [
        'Country',
        'Service type',
        'Payroll name',
        'Payroll period',
        'Payroll type',
        'Employee no.',
        'Payroll status',
      ];
      const firstRowData = [
        'Singapore',
        'POM',
        '1st Feb 2023 - 28th Feb 2023',
        '1 Feb 2023 - 28 Feb 2023',
        'Regular cycle',
        '0',
        'Draft',
      ];
      columnNames.forEach((value) => cy.contains(value));
      firstRowData.forEach((value) => cy.contains(value));
    });
  });

  describe('when accessing /company/payroll/company-payroll?tab=rejected', () => {
    before(() => {
      mockDataAndVisitCompanyPayroll('rejected');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should load page correctly with status rejected', () => {
      cy.url().should(
        'include',
        '/company/payroll/company-payroll?tab=rejected'
      );
    });

    it('should display correctly column of table', () => {
      cy.viewport(1920, 1080);
      const columnNames = [
        'Country',
        'Service type',
        'Payroll name',
        'Payroll period',
        'Payroll type',
        'Employee no.',
        'Payroll status',
      ];
      const firstRowData = [
        'Singapore',
        'POM',
        '1st Feb 2023 - 28th Feb 2023',
        '1 Feb 2023 - 28 Feb 2023',
        'Regular cycle',
        '0',
        'Draft',
      ];
      columnNames.forEach((value) => cy.contains(value));
      firstRowData.forEach((value) => cy.contains(value));
    });
  });

  describe('when accessing /company/payroll/company-payroll?tab=draft failed - 403 error', () => {
    before(() => {
      mockDataAndVisitCompanyPayroll('draft');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display error toast', () => {
      cy.mocksUseRouteVariant('fintech/v1/company-payroll:403-error');
      cy.get('[data-testid="companyPayrollCompanyPayroll-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="companyPayrollCompanyPayroll-toast-errorAlert"]'
      ).should('be.visible');
    });

    it('should close  toast', () => {
      cy.get(
        '[data-testid="companyPayrollCompanyPayroll-toast-errorAlert"]'
      ).clickOutside();
    });
  });
});
