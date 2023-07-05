import { STAFF_ADMIN } from '@fixtures/users';

describe('staff/setup/integration', () => {
  describe('when accessing /staff/setup/integration', () => {
    before(() => {
      cy.useMocksApiClientFintech();
      cy.mocksUseRouteVariant('fintech/v1/jt-company/list:200-success');
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/setup/integration');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the staff home page', () => {
      cy.url().should('include', '/staff/setup/integration');
    });

    it('should display correctly column of table', () => {
      cy.viewport(1920, 1080);
      const columnNames = [
        'Client',
        'Service Type',
        'Service Country',
        'Date Sync With Juztalent',
        'AGP ID',
        'Juztalent ID',
      ];
      const firstRowData = [
        'crobakai',
        'POM',
        'Singapore',
        '07/04/2023',
        'ge4lmziiraes9vso',
        '611',
      ];
      columnNames.forEach((value) => cy.contains(value));
      firstRowData.forEach((value) => cy.contains(value));
    });

    it('should move between pages when click next, previously button', () => {
      cy.get('[data-testid="KeyboardArrowRightIcon"]').click();
      cy.contains('26–50 of 50').should('be.visible');
      cy.get('[data-testid="KeyboardArrowLeftIcon"]').click();
      cy.contains('1–25 of 50').should('be.visible');
    });
  });

  describe('when return value is empty', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'fintech/v1/jt-company/list:200-success-return-empty'
      );
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/setup/integration');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show NoRowOverLay table', () => {
      cy.get(
        '[data-testid="staffSetUpIntegration-noRowsOverLay-title"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffSetUpIntegration-noRowsOverLay-description"]'
      ).should('be.visible');
    });
  });

  describe('when get integration list error - 500', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'fintech/v1/jt-company/list:500-internal-server-error'
      );
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/setup/integration');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast error message ', () => {
      cy.get('[data-testid="staffIntegration-toast"]').should('be.visible');
      cy.get('[data-testid="staffIntegration-toast-errorAlert"]').should(
        'be.visible'
      );
    });

    it('should close  toast', () => {
      cy.get(
        '[data-testid="staffIntegration-toast-errorAlert"]'
      ).clickOutside();
    });
  });

  describe('when get integration list error - 500', () => {
    before(() => {
      cy.mocksUseRouteVariant('fintech/v1/jt-company/list:500-unknown-error');
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/setup/integration');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast error message ', () => {
      cy.get('[data-testid="staffIntegration-toast"]').should('be.visible');
      cy.get('[data-testid="staffIntegration-toast-errorAlert"]').should(
        'be.visible'
      );
    });

    it('should close  toast', () => {
      cy.get(
        '[data-testid="staffIntegration-toast-errorAlert"]'
      ).clickOutside();
    });
  });
});
