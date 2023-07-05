import { STAFF_ADMIN } from '@fixtures/users';

const openAddNewClientModal = () => {
  cy.get(
    '[data-testid="staffAuditClientList-dataGrid-MoreVertButton"]'
  ).click();
  cy.get('[data-testid="staffAuditClientList-addNewClient-button"]').click();
  cy.get('[data-testid="staffAuditClientList-selectionModal-title"]').should(
    'be.visible'
  );
};

const closeAddNewClientModal = () => {
  cy.get(
    '[data-testid="staffAuditClientList-addNewClient-cancelButton"]'
  ).click();
};

const fillDataCreateNewClient = () => {
  cy.get('[data-testid="companySignUp-firstNameField"]')
    .type('Tommy')
    .find('input')
    .should('have.value', 'Tommy');
  cy.get('[data-testid="companySignUp-lastNameField"]')
    .type('Nguyen')
    .find('input')
    .should('have.value', 'Nguyen');

  cy.get('[data-testid="companySignUp-companyNameField"]')
    .type('AYP-GROUP')
    .find('input')
    .should('have.value', 'AYP-GROUP');
  cy.wait(1_000);
  cy.typeAutocompleteClickOptionIndex(
    'companySignUp-countryField',
    'singapore',
    0
  );
  cy.get('[data-testid="companySignUp-jobTitleField"]')
    .scrollIntoView()
    .type('Developer')
    .find('input')
    .should('have.value', 'Developer');
  cy.get('[data-testid="companySignUp-emailField"]')
    .type('tommy.nguyen@ayp-group.com')
    .find('input')
    .should('have.value', 'tommy.nguyen@ayp-group.com');
  cy.get('[data-testid="companySignUp-passwordField"]')
    .type('Pwd12345')
    .find('input')
    .should('have.value', 'Pwd12345');
  cy.getSelectFieldClickOption('companySignUp-interestField', 'PARTNERSHIP');
  cy.getSelectFieldClickOption('companySignUp-industryField', 'ntd93ugf');
  cy.getSelectFieldClickOption('companySignUp-categoryField', 'DIRECT');
};

describe('staff/audit/client-list', () => {
  describe('when user access to client list page via sidebar', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/company/list:200-success');

      cy.login(STAFF_ADMIN);
      cy.visit('/staff/home');

      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-list"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirect to staff client list page', () => {
      cy.url().should('include', '/staff/audit/client-list');
    });

    it('should display correctly column of table', () => {
      cy.viewport(1920, 1080);
      const columnNames = [
        'Client',
        'Category',
        'Industry',
        'Location',
        'Registered By',
        'Registered Email',
        'Invoicing Currency',
        'Entity Link Status',
        'Created On',
        'Status',
      ];
      const firstRowData = [
        'AYP-GP',
        'Internal',
        'Manufacturing',
        'Albania',
        '[uat] Tester o222 NGUYEN',
        'ssdk@bkav.com',
        '-',
        'Standalone',
        '21/02/2023',
        'Onboarding',
      ];
      columnNames.forEach((value) => cy.contains(value));
      firstRowData.forEach((value) => cy.contains(value));
    });

    it('should move between pages when click next, previously button', () => {
      cy.get('[data-testid="KeyboardArrowRightIcon"]').click();
      cy.contains('26–50 of 183').should('be.visible');
      cy.get('[data-testid="KeyboardArrowLeftIcon"]').click();
      cy.contains('1–25 of 183').should('be.visible');
    });
  });

  describe('when user access to client list page with no data', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/company/list:200-empty');

      cy.login(STAFF_ADMIN);
      cy.visit('/staff/audit/client-list');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display no rows overlay client list', () => {
      cy.get('[data-testid="no-rows-overlay-clientList-icon"]').should(
        'be.visible'
      );
      cy.get('[data-testid="no-rows-overlay-clientList-title"]').should(
        'be.visible'
      );
      cy.get('[data-testid="no-rows-overlay-clientList-description"]').should(
        'be.visible'
      );
    });
  });

  describe('when get client list error - 400', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/company/list:400-unknown-error');
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/audit/client-list');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast error message ', () => {
      cy.get('[data-testid="staffAuditClientList-toast"]').should('be.visible');
      cy.get('[data-testid="staffAuditClientList-toast-errorAlert"]').should(
        'be.visible'
      );
    });

    it('should close  toast', () => {
      cy.get(
        '[data-testid="staffAuditClientList-toast-errorAlert"]'
      ).clickOutside();
    });
  });

  describe('when get client list error - 500', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/company/list:500-internal-error');
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/audit/client-list');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast error message ', () => {
      cy.get('[data-testid="staffAuditClientList-toast"]').should('be.visible');
      cy.get('[data-testid="staffAuditClientList-toast-errorAlert"]').should(
        'be.visible'
      );
    });

    it('should close  toast', () => {
      cy.get(
        '[data-testid="staffAuditClientList-toast-errorAlert"]'
      ).clickOutside();
    });
  });

  describe('when user add new client but does not fill any input', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/company/list:200-success');

      cy.login(STAFF_ADMIN);
      cy.visit('/staff/audit/client-list');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display add new client modal and fill value', () => {
      openAddNewClientModal();

      cy.get(
        '[data-testid="staffAuditClientList-addNewClient-submitButton"]'
      ).click();
      cy.get('[data-testid="companySignUp-firstNameField-error"]')
        .scrollIntoView()
        .should('be.visible');

      closeAddNewClientModal();
    });
  });

  describe('when user add new client success', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/industry/selection:200-success');
      cy.mocksUseRouteVariant('people/v1/company/list:200-success');

      cy.mocksUseRouteVariant('people/v1/company/new-client:200-success');

      cy.login(STAFF_ADMIN);
      cy.visit('/staff/audit/client-list');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should close modal new client', () => {
      openAddNewClientModal();
      closeAddNewClientModal();
    });

    it('should display add new client modal and fill value', () => {
      openAddNewClientModal();
      fillDataCreateNewClient();

      cy.get(
        '[data-testid="staffAuditClientList-addNewClient-submitButton"]'
      ).click();
      cy.get(
        '[data-testid="staffAuditClientList-selectionModal-title"]'
      ).should('not.exist');

      cy.get('[data-testid="staffAuditClientList-toast-successAlert"]').should(
        'be.visible'
      );
      cy.get('.MuiAlert-action > .MuiButtonBase-root').click();
      cy.get('[data-testid="staffAuditClientList-toast-successAlert"]').should(
        'not.exist'
      );
    });
  });

  describe('when user add new client fail 403 forbidden error', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/industry/selection:200-success');
      cy.mocksUseRouteVariant('people/v1/company/list:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/company/new-client:403-forbidden-error'
      );

      cy.login(STAFF_ADMIN);
      cy.visit('/staff/audit/client-list');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should close modal and show error message', () => {
      openAddNewClientModal();
      fillDataCreateNewClient();

      cy.get(
        '[data-testid="staffAuditClientList-addNewClient-submitButton"]'
      ).click();
      cy.get(
        '[data-testid="staffAuditClientList-selectionModal-title"]'
      ).should('not.exist');

      cy.get('[data-testid="staffAuditClientList-toast-errorAlert"]').should(
        'be.visible'
      );
      cy.get('.MuiAlert-action > .MuiButtonBase-root').click();
      cy.get('[data-testid="staffAuditClientList-toast-errorAlert"]').should(
        'not.exist'
      );
    });
  });

  describe('when user add new client fail 400 unknown error', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/industry/selection:200-success');
      cy.mocksUseRouteVariant('people/v1/company/list:200-success');
      cy.mocksUseRouteVariant('people/v1/company/new-client:400-unknown-error');

      cy.login(STAFF_ADMIN);
      cy.visit('/staff/audit/client-list');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should close modal and show error message', () => {
      openAddNewClientModal();
      fillDataCreateNewClient();

      cy.get(
        '[data-testid="staffAuditClientList-addNewClient-submitButton"]'
      ).click();
      cy.get(
        '[data-testid="staffAuditClientList-selectionModal-title"]'
      ).should('not.exist');

      cy.get('[data-testid="staffAuditClientList-toast-errorAlert"]').should(
        'be.visible'
      );
      cy.get('.MuiAlert-action > .MuiButtonBase-root').click();
      cy.get('[data-testid="staffAuditClientList-toast-errorAlert"]').should(
        'not.exist'
      );
    });
  });

  describe('when user access to client list and open view client detail', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/company/list:200-success');

      // create a single stub we will use
      const stub = cy.stub().as('open');
      cy.on('window:before:load', (win) => {
        cy.stub(win, 'open').callsFake(stub);
      });

      cy.login(STAFF_ADMIN);
      cy.visit('/staff/audit/client-list');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open view profile in the new tab', () => {
      cy.get('.MuiDataGrid-virtualScroller').scrollTo('right');
      cy.get('[data-testid="staffAuditClientList-clientRow-itemOptions"]')
        .first()
        .scrollIntoView()
        .click();
      cy.get(
        `[data-testid="staffAuditClientList-clientRow-viewProfile"]`
      ).click();

      cy.get('@open').should('have.been.calledOnce');
    });
  });

  describe('when export data successfully', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/company/list:200-success');
      cy.mocksUseRouteVariant('people/v1/data-grid-export:200-success');
      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-list"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when success ', () => {
      cy.get(
        '[data-testid="staffAuditClientList-dataGrid-MoreVertButton"]'
      ).click();
      cy.get('[data-testid="staffAuditClientList-exportData-button"]').click();
      cy.get('[data-testid="staffAuditClientList-toast"]').should('be.visible');
      cy.get('[data-testid="staffAuditClientList-toast-successAlert"]').should(
        'be.visible'
      );
    });

    it('should close  toast', () => {
      cy.get(
        '[data-testid="staffAuditClientList-toast-successAlert"]'
      ).clickOutside();
    });
  });

  describe('when export data fail - too many request', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/company/list:200-success');
      cy.mocksUseRouteVariant('people/v1/data-grid-export:429-error');
      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-list"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when export data fail - 429 error ', () => {
      cy.get(
        '[data-testid="staffAuditClientList-dataGrid-MoreVertButton"]'
      ).click();
      cy.get('[data-testid="staffAuditClientList-exportData-button"]').click();
      cy.get('[data-testid="staffAuditClientList-toast"]').should('be.visible');
      cy.get('[data-testid="staffAuditClientList-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when export with nodata in data-grid', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant('people/v1/company/list:200-empty');
      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-list"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when fail ', () => {
      cy.get(
        '[data-testid="staffAuditClientList-dataGrid-MoreVertButton"]'
      ).click();
      cy.get('[data-testid="staffAuditClientList-exportData-button"]').click();
      cy.get('[data-testid="staffAuditClientList-toast"]').should('be.visible');
      cy.get('[data-testid="staffAuditClientList-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when export data fail - internal error', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant('people/v1/company/list:200-success');
      cy.mocksUseRouteVariant('people/v1/data-grid-export:500-error');
      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-list"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when export data fail - 500 error ', () => {
      cy.get(
        '[data-testid="staffAuditClientList-dataGrid-MoreVertButton"]'
      ).click();
      cy.get('[data-testid="staffAuditClientList-exportData-button"]').click();
      cy.get('[data-testid="staffAuditClientList-toast"]').should('be.visible');
      cy.get('[data-testid="staffAuditClientList-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });
});
