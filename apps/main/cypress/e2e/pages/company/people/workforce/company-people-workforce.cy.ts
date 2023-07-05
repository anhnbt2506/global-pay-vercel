import { COMPANY_OWNER } from '@fixtures/users';

describe('company/people/workforce', () => {
  const columnNames = [
    'Name',
    'Email',
    'Location',
    'Hire Type',
    'Contract Type',
    'Job Role',
    'Permit Required',
  ];
  const firstRowData = [
    '[TEST] Worker verification 01',
    'test-worker01@mailsac.com',
    'Vietnam',
    'POM',
    'Indefinite',
    'Security Engineer 12345',
    'Yes',
  ];
  before(() => {
    cy.mocksRestoreBaseCollection();
  });
  describe('when get list workforce success', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list-workforce:200-workforce-success'
      );
      cy.intercept('GET', '**/worker-employment?*').as('getWorkerEmployments');
      cy.login(COMPANY_OWNER);
      cy.visit(`/company/people/workforce`);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should call api with correct parameters', () => {
      cy.url().should('include', '/company/people/workforce');
      cy.wait('@getWorkerEmployments');
      cy.get('@getWorkerEmployments').then((xhr) => {
        expect(xhr['request'].method).eq('GET');
        expect(xhr['request'].url).contains(
          '/worker-employment?page=0&pageSize=25'
        );
      });
    });

    it('should display correctly data list workforce', () => {
      columnNames.forEach((name) => cy.contains(name));
      firstRowData.forEach((value) => cy.contains(value));
    });

    it('should move between pages when click next, previously button', () => {
      cy.get('[data-testid="KeyboardArrowRightIcon"]').click();
      cy.contains('26–26 of 26').should('be.visible');
      cy.get('[data-testid="KeyboardArrowLeftIcon"]').click();
      cy.contains('1–25 of 26').should('be.visible');
    });

    it('should display correctly data when search', () => {
      cy.get('[data-testid="searchToolbar-textField"]').type(
        '[TEST] Worker verification 01'
      );
      columnNames.forEach((name) => cy.contains(name));
      firstRowData.forEach((value) => cy.contains(value));

      cy.get('[data-testid="searchToolbar-clearButton"]')
        .should('be.visible')
        .click();
    });
  });

  describe('when get list workforce failed', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list-workforce:200-workforce-empty'
      );
      cy.login(COMPANY_OWNER);
      cy.visit(`/company/people/workforce`);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display correctly data not found', () => {
      cy.get(
        '[data-testid="companyPeopleWorkforce-noRowsOverlay-title"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPeopleWorkforce-noRowsOverlay-description"]'
      ).should('be.visible');
    });
  });

  describe('when export data successfully', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list-workforce:200-workforce-success'
      );
      cy.intercept('GET', '**/worker-employment?*').as('getWorkerEmployments');
      cy.login(COMPANY_OWNER);
      cy.mocksUseRouteVariant('people/v1/data-grid-export:200-success');
      cy.visit(`/company/people/workforce`);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when success ', () => {
      cy.get(
        '[data-testid="companyPeopleWorkforce-dataGrid-MoreVertButton"]'
      ).click();
      cy.get(
        '[data-testid="companyPeopleWorkforce-exportData-button"]'
      ).click();
      cy.get('[data-testid="companyPeopleWorkforce-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="companyPeopleWorkforce-toast-successAlert"]'
      ).should('be.visible');
    });

    it('should close  toast', () => {
      cy.get(
        '[data-testid="companyPeopleWorkforce-toast-successAlert"]'
      ).clickOutside();
    });
  });

  describe('when export data fail - too many request', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/data-grid-export:429-error');
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list-workforce:200-workforce-success'
      );
      cy.intercept('GET', '**/worker-employment?*').as('getWorkerEmployments');
      cy.login(COMPANY_OWNER);
      cy.visit(`/company/people/workforce`);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when export data fail - 429 error ', () => {
      cy.get(
        '[data-testid="companyPeopleWorkforce-dataGrid-MoreVertButton"]'
      ).click();
      cy.get(
        '[data-testid="companyPeopleWorkforce-exportData-button"]'
      ).click();
      cy.get('[data-testid="companyPeopleWorkforce-toast"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companyPeopleWorkforce-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when export with nodata in data-grid', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list-workforce:200-workforce-empty'
      );
      cy.login(COMPANY_OWNER);
      cy.visit(`/company/people/workforce`);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when fail ', () => {
      cy.get(
        '[data-testid="companyPeopleWorkforce-dataGrid-MoreVertButton"]'
      ).click();
      cy.get(
        '[data-testid="companyPeopleWorkforce-exportData-button"]'
      ).click();
      cy.get('[data-testid="companyPeopleWorkforce-toast"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companyPeopleWorkforce-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when export data fail - internal error', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/data-grid-export:500-error');
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list-workforce:200-workforce-success'
      );
      cy.intercept('GET', '**/worker-employment?*').as('getWorkerEmployments');
      cy.login(COMPANY_OWNER);
      cy.visit(`/company/people/workforce`);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when export data fail - 500 error ', () => {
      cy.get(
        '[data-testid="companyPeopleWorkforce-dataGrid-MoreVertButton"]'
      ).click();
      cy.get(
        '[data-testid="companyPeopleWorkforce-exportData-button"]'
      ).click();
      cy.get('[data-testid="companyPeopleWorkforce-toast"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companyPeopleWorkforce-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when export data fail - unknown error', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/data-grid-export:400-error');
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list-workforce:200-workforce-success'
      );
      cy.intercept('GET', '**/worker-employment?*').as('getWorkerEmployments');
      cy.login(COMPANY_OWNER);
      cy.visit(`/company/people/workforce`);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when export data fail - 400 error ', () => {
      cy.get(
        '[data-testid="companyPeopleWorkforce-dataGrid-MoreVertButton"]'
      ).click();
      cy.get(
        '[data-testid="companyPeopleWorkforce-exportData-button"]'
      ).click();
      cy.get('[data-testid="companyPeopleWorkforce-toast"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companyPeopleWorkforce-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });
});
