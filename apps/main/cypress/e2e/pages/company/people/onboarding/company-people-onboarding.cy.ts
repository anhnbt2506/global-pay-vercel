import { COMPANY_OWNER } from '@fixtures/users';

describe('company/people/onboarding', () => {
  describe('when get list onboarding success', () => {
    const columnNames = [
      'Name',
      'Status',
      'Location',
      'Hire Type',
      'Employment Type',
      'Start Date',
    ];
    const firstRowData = [
      'Tien Anh',
      'Employee invited',
      'Vietnam',
      'PEO',
      'Part Time',
      '26/10/2022',
    ];
    before(() => {
      cy.signInCompanyAndMockPeopleOnboardingCollection(false);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should call api with correct parameters', () => {
      cy.intercept('GET', '**/worker-employment?*').as('getWorkerEmployments');
      cy.visit(`/company/people/onboarding`);
      cy.url().should('include', '/company/people/onboarding');

      cy.wait('@getWorkerEmployments');
      cy.get('@getWorkerEmployments').then((xhr) => {
        expect(xhr['request'].method).eq('GET');
        expect(xhr['request'].url).contains(
          '/worker-employment?page=0&pageSize=25'
        );
      });

      cy.get('[data-testid="KeyboardArrowRightIcon"]')
        .should('be.visible')
        .click();
      cy.get('[data-testid="KeyboardArrowLeftIcon"]')
        .should('be.visible')
        .click();
    });

    it('should display correctly data list onboarding', () => {
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
      cy.get('[data-testid="searchToolbar-textField"]').type('Tien');
      columnNames.forEach((name) => cy.contains(name));
      firstRowData.forEach((value) => cy.contains(value));

      cy.get('[data-testid="searchToolbar-clearButton"]')
        .should('be.visible')
        .click();
    });
  });

  describe('when user access to onboarding list page with no data', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/company/people/onboarding/get-list:200-empty-success'
      );
      cy.login(COMPANY_OWNER);
      cy.visit(`/company/people/onboarding`);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display no rows overlay onboarding list', () => {
      cy.get('[data-testid="no-rows-overlay-companyOnboarding-icon"]').should(
        'be.visible'
      );
      cy.get('[data-testid="no-rows-overlay-companyOnboarding-title"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="no-rows-overlay-companyOnboarding-description"]'
      ).should('be.visible');
    });
  });

  describe('when access to Add New Hire ', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/company/people/onboarding/get-list:200-success'
      );
      cy.intercept('GET', '**/worker-employment?*').as('getWorkerEmployments');
      cy.login(COMPANY_OWNER);
      cy.visit(`/company/people/onboarding`);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should click to Add new Hire Button', () => {
      cy.get(
        '[data-testid="companyPeopleOnboarding-dataGrid-MoreVertButton"]'
      ).click();
      cy.get(
        '[data-testid="companyPeopleOnboarding-addNewHire-button"]'
      ).click();
    });

    it('should redirect to company people onboarding create', () => {
      cy.url().should('include', '/company/people/onboarding/create');
    });
  });

  describe('when export data successfully', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/company/people/onboarding/get-list:200-success'
      );
      cy.intercept('GET', '**/worker-employment?*').as('getWorkerEmployments');
      cy.login(COMPANY_OWNER);
      cy.mocksUseRouteVariant('people/v1/data-grid-export:200-success');
      cy.visit(`/company/people/onboarding`);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when success ', () => {
      cy.get(
        '[data-testid="companyPeopleOnboarding-dataGrid-MoreVertButton"]'
      ).click();
      cy.get(
        '[data-testid="companyPeopleOnboarding-exportData-button"]'
      ).click();
      cy.get('[data-testid="companyPeopleOnboarding-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="companyPeopleOnboarding-toast-successAlert"]'
      ).should('be.visible');
    });

    it('should close  toast', () => {
      cy.get(
        '[data-testid="companyPeopleOnboarding-toast-successAlert"]'
      ).clickOutside();
    });
  });

  describe('when export data fail - too many request', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/data-grid-export:429-error');
      cy.mocksUseRouteVariant(
        'people/v1/company/people/onboarding/get-list:200-success'
      );
      cy.intercept('GET', '**/worker-employment?*').as('getWorkerEmployments');
      cy.login(COMPANY_OWNER);
      cy.visit(`/company/people/onboarding`);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when export data fail - 429 error ', () => {
      cy.get(
        '[data-testid="companyPeopleOnboarding-dataGrid-MoreVertButton"]'
      ).click();
      cy.get(
        '[data-testid="companyPeopleOnboarding-exportData-button"]'
      ).click();
      cy.get('[data-testid="companyPeopleOnboarding-toast"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companyPeopleOnboarding-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when export with nodata in data-grid', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/company/people/onboarding/get-list:200-empty-success'
      );
      cy.login(COMPANY_OWNER);
      cy.visit(`/company/people/onboarding`);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when fail ', () => {
      cy.get(
        '[data-testid="companyPeopleOnboarding-dataGrid-MoreVertButton"]'
      ).click();
      cy.get(
        '[data-testid="companyPeopleOnboarding-exportData-button"]'
      ).click();
      cy.get('[data-testid="companyPeopleOnboarding-toast"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companyPeopleOnboarding-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when export data fail - internal error', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/data-grid-export:500-error');
      cy.mocksUseRouteVariant(
        'people/v1/company/people/onboarding/get-list:200-success'
      );
      cy.intercept('GET', '**/worker-employment?*').as('getWorkerEmployments');
      cy.login(COMPANY_OWNER);
      cy.visit(`/company/people/onboarding`);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when export data fail - 500 error ', () => {
      cy.get(
        '[data-testid="companyPeopleOnboarding-dataGrid-MoreVertButton"]'
      ).click();
      cy.get(
        '[data-testid="companyPeopleOnboarding-exportData-button"]'
      ).click();
      cy.get('[data-testid="companyPeopleOnboarding-toast"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companyPeopleOnboarding-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when export data fail - unknown error', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/data-grid-export:400-error');
      cy.mocksUseRouteVariant(
        'people/v1/company/people/onboarding/get-list:200-success'
      );
      cy.intercept('GET', '**/worker-employment?*').as('getWorkerEmployments');
      cy.login(COMPANY_OWNER);
      cy.visit(`/company/people/onboarding`);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when export data fail - 400 error ', () => {
      cy.get(
        '[data-testid="companyPeopleOnboarding-dataGrid-MoreVertButton"]'
      ).click();
      cy.get(
        '[data-testid="companyPeopleOnboarding-exportData-button"]'
      ).click();
      cy.get('[data-testid="companyPeopleOnboarding-toast"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companyPeopleOnboarding-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });
});
