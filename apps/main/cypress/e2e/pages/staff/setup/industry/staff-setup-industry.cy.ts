import { STAFF_ADMIN } from '@fixtures/users';

const openAddAndFillDataIndustryModal = (fillData?: boolean) => {
  cy.get('[data-testid="staffSetUpIndustry-dataGrid-MoreVertButton"]').click();
  cy.get('[data-testid="staffSetUpIndustry-addNewIndustry-button"]').click();
  cy.get('[data-testid="staffSetupIndustry-selectionModal-title"]').should(
    'be.visible'
  );
  if (fillData) {
    cy.get('[data-testid="staffSetupIndustry-AddOrEditIndustry-nameTextField"]')
      .type('University')
      .find('input')
      .should('have.value', 'University');
  }
  cy.get(
    '[data-testid="staffSetupIndustry-AddOrEditIndustry-submitButton"]'
  ).click();
};

const openEditIndustryModal = () => {
  cy.get('.MuiDataGrid-virtualScroller').scrollTo('right');
  cy.get('[data-testid="staffSetupIndustry-row-itemOptions"]')
    .first()
    .scrollIntoView()
    .click();
  cy.get(`[data-testid="staffSetupIndustry-row-editIndustry"]`).click();
  cy.get('[data-testid="staffSetupIndustry-AddOrEditIndustry-nameTextField"]')
    .type('University')
    .find('input')
    .should('have.value', 'Industry 2 Fix timeUniversity');
  cy.get(
    '[data-testid="staffSetupIndustry-AddOrEditIndustry-submitButton"]'
  ).click();
};

const closeIndustryModal = () => {
  cy.get(
    '[data-testid="staffSetupIndustry-AddOrEditIndustry-closeButton"]'
  ).click();
};

describe('staff/setup/industry', () => {
  describe('when accessing /staff/setup/industry', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/industry:200-success');
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/setup/industry');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the staff home page', () => {
      cy.url().should('include', '/staff/setup/industry');
    });

    it('should display correctly column of table', () => {
      cy.viewport(1920, 1080);
      const columnNames = [
        'Industry',
        'Created Date',
        'Created By',
        'Last Updated Date',
        'Last Updated By',
      ];
      const firstRowData = [
        'Industry 2 Fix time',
        '09/03/2023',
        'Staff Admin AYP Group',
        '09/03/2023',
        '-',
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
      cy.mocksUseRouteVariant('people/v1/industry:200-success-return-empty');
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/setup/industry');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show NoRowOverLay table', () => {
      cy.get('[data-testid="staffSetUpIndustry-noRowsOverLay-title"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffSetUpIndustry-noRowsOverLay-description"]'
      ).should('be.visible');
    });
  });

  describe('when get industry list error - 500', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/industry:500-internal-server-error');
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/setup/industry');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast error message ', () => {
      cy.get('[data-testid="staffSetUpIndustry-toast"]').should('be.visible');
      cy.get('[data-testid="staffSetUpIndustry-toast-errorAlert"]').should(
        'be.visible'
      );
    });

    it('should close  toast', () => {
      cy.get(
        '[data-testid="staffSetUpIndustry-toast-errorAlert"]'
      ).clickOutside();
    });
  });

  describe('when get industry list error - 400', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/industry:400-unknown-error');
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/setup/industry');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast error message ', () => {
      cy.get('[data-testid="staffSetUpIndustry-toast"]').should('be.visible');
      cy.get('[data-testid="staffSetUpIndustry-toast-errorAlert"]').should(
        'be.visible'
      );
    });

    it('should close  toast', () => {
      cy.get(
        '[data-testid="staffSetUpIndustry-toast-errorAlert"]'
      ).clickOutside();
    });
  });

  describe('when user add new industry but does not fill any input', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/industry:200-success');

      cy.login(STAFF_ADMIN);
      cy.visit('/staff/setup/industry');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display add new industry modal and do not fill value', () => {
      openAddAndFillDataIndustryModal();
      cy.get(
        '[data-testid="staffSetupIndustry-AddOrEditIndustry-nameTextField-error"]'
      )
        .scrollIntoView()
        .should('be.visible');

      closeIndustryModal();
    });
  });

  describe('when create new industry successfully', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/industry:200-success');
      cy.mocksUseRouteVariant('people/v1/industry/create-industry:200-success');

      cy.login(STAFF_ADMIN);
      cy.visit('/staff/setup/industry');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display add new industry modal and fill value', () => {
      openAddAndFillDataIndustryModal(true);
    });

    it('should show toast success message ', () => {
      cy.get('[data-testid="staffSetUpIndustry-toast"]').should('be.visible');
      cy.get('[data-testid="staffSetUpIndustry-toast-successAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when create new industry error - 500', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/industry:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/industry/create-industry:500-internal-server-error'
      );

      cy.login(STAFF_ADMIN);
      cy.visit('/staff/setup/industry');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display add new industry modal and fill value', () => {
      openAddAndFillDataIndustryModal(true);
    });

    it('should show toast error message ', () => {
      cy.get('[data-testid="staffSetUpIndustry-toast"]').should('be.visible');
      cy.get('[data-testid="staffSetUpIndustry-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when edit a industry successfully', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/industry:200-success');
      cy.mocksUseRouteVariant('people/v1/industry/edit-industry:200-success');

      cy.login(STAFF_ADMIN);
      cy.visit('/staff/setup/industry');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display add new industry modal and fill value', () => {
      openEditIndustryModal();
    });

    it('should show toast success message ', () => {
      cy.get('[data-testid="staffSetUpIndustry-toast"]').should('be.visible');
      cy.get('[data-testid="staffSetUpIndustry-toast-successAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when edit a new industry error - 500', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/industry:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/industry/edit-industry:500-internal-server-error'
      );

      cy.login(STAFF_ADMIN);
      cy.visit('/staff/setup/industry');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display add new industry modal and fill value', () => {
      openEditIndustryModal();
    });

    it('should show toast error message ', () => {
      cy.get('[data-testid="staffSetUpIndustry-toast"]').should('be.visible');
      cy.get('[data-testid="staffSetUpIndustry-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });
});
