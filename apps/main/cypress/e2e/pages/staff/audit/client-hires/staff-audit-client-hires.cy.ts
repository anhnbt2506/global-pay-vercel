import { STAFF_ADMIN } from '@fixtures/users';

const openAddNewHireModal = () => {
  cy.get('[data-testid="staffClientHires-dataGrid-MoreVertButton"]').click();
  cy.get('[data-testid="staffClientHires-addNewHire-button"]').click();
  cy.get('[data-testid="staffClientHires-selectionModal-title"]').should(
    'be.visible'
  );
};
const closeAddNewHireModal = () => {
  cy.get('[data-testid="staffClientHires-addNewHire-cancelButton"]').click();
};

describe('staff/audit/client-hires', () => {
  describe('when user access to client hires page via sidebar', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/home');
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list:200-success'
      );
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-hires"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirect to staff client hires page', () => {
      cy.url().should('include', '/staff/audit/client-hires');
    });

    it('should display correctly column of table', () => {
      const columnNames = [
        'Company',
        'Name',
        'Email',
        'Hire Type',
        'Location',
        'Citizenship Status',
        'Permit Required',
        'Start Date',
      ];
      const firstRowData = [
        'crobakai',
        'Tien Anh',
        'tienanh1@gmail.com',
        'PEO',
        'Vietnam',
        'undefined',
        'No',
        '26/10/2022',
      ];
      const secondRowData = [
        'crobakai',
        'Tien Anh',
        'tienanh1@gmail.com',
        'PEO',
        'Vietnam',
        'undefined',
        'Yes',
        '12/10/2022',
      ];
      columnNames.forEach((value) => cy.contains(value));
      firstRowData.forEach((value) => cy.contains(value));
      secondRowData.forEach((value) => cy.contains(value));
    });

    it('should move between pages when click next, previously button', () => {
      cy.get('[data-testid="KeyboardArrowRightIcon"]').click();
      cy.contains('26–50 of 100').should('be.visible');
      cy.get('[data-testid="KeyboardArrowLeftIcon"]').click();
      cy.contains('1–25 of 100').should('be.visible');
    });
  });

  describe('when user access to client hires page with no data', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/home');
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list-workforce:200-workforce-empty'
      );
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-hires"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display no rows overlay client hires', () => {
      cy.get('[data-testid="no-rows-overlay-client-hires-icon"]').should(
        'be.visible'
      );
      cy.get('[data-testid="no-rows-overlay-client-hires-title"]').should(
        'be.visible'
      );
      cy.get('[data-testid="no-rows-overlay-client-hires-description"]').should(
        'be.visible'
      );
    });
  });

  describe('when get client hire list error - 400', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list-workforce:400-unknown-error'
      );
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/audit/client-hires');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast error message ', () => {
      cy.get('[data-testid="staffClientHires-toastClientHires"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffClientHires-toastClientHires-errorAlert"]'
      ).should('be.visible');
    });

    it('should close  toast', () => {
      cy.get(
        '[data-testid="staffClientHires-toastClientHires-errorAlert"]'
      ).clickOutside();
    });
  });

  describe('when get client hire list error - 500', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list-workforce:500-internal-error'
      );
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/audit/client-hires');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast error message ', () => {
      cy.get('[data-testid="staffClientHires-toastClientHires"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffClientHires-toastClientHires-errorAlert"]'
      ).should('be.visible');
    });
  });

  describe('when user add new hire', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/home');
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/company/list-all:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/file-management:200-upload-file-success'
      );
      cy.mocksUseRouteVariant('s3Api-upload:200-success');
      cy.mocksUseRouteVariant('people/v1/worker-employment/csv:200-success');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-hires"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should close modal new hire', () => {
      openAddNewHireModal();
      closeAddNewHireModal();
    });

    it('should display add new hire modal and fill value', () => {
      openAddNewHireModal();
      cy.getSelectFieldClickOption(
        'staffClientHires-addNewHire-hireType',
        'PEO'
      );
      cy.typeAutocompleteClickOptionIndex(
        'staffClientHires-addNewHire-company',
        'AYP',
        0
      );
      cy.get(
        '[data-testid="staffClientHires-addNewHire-csvBulkUpload"]'
      ).attachFile('test.csv');
      cy.wait(1000);
      cy.get(
        '[data-testid="staffClientHires-addNewHire-submitButton"]'
      ).click();
      cy.get('[data-testid="staffClientHires-selectionModal-title"]').should(
        'not.exist'
      );
      cy.get(
        '[data-testid="staffClientHires-toastClientHires-successAlert"]'
      ).should('be.visible');
      cy.get('.MuiAlert-action > .MuiButtonBase-root').click();
      cy.get(
        '[data-testid="staffClientHires-toastClientHires-successAlert"]'
      ).should('not.exist');
    });
  });

  describe('when the user has not filled in the information but clicks submit', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/home');
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/company/list-all:200-success');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-hires"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should displays a warning asking the user to fill in more field', () => {
      openAddNewHireModal();
      cy.get(
        '[data-testid="staffClientHires-addNewHire-submitButton"]'
      ).click();
      cy.get(
        '[data-testid="staffClientHires-addNewHire-hireType-error"]'
      ).should('be.visible');
      closeAddNewHireModal();
    });
  });

  describe('when user add new hire fail', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/home');
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/company/list-all:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/file-management:200-upload-file-success'
      );
      cy.mocksUseRouteVariant('s3Api-upload:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/csv:404-not-found-error'
      );
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-hires"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display add new hire modal and fill value', () => {
      openAddNewHireModal();
      cy.getSelectFieldClickOption(
        'staffClientHires-addNewHire-hireType',
        'PEO'
      );
      cy.typeAutocompleteClickOptionIndex(
        'staffClientHires-addNewHire-company',
        'AYP',
        0
      );
      cy.get(
        '[data-testid="staffClientHires-addNewHire-csvBulkUpload"]'
      ).attachFile('test.csv');
      cy.wait(1000);
      cy.get(
        '[data-testid="staffClientHires-addNewHire-submitButton"]'
      ).click();
      cy.get('[data-testid="staffClientHires-selectionModal-title"]').should(
        'not.exist'
      );
    });
    it('should display error message', () => {
      cy.get(
        '[data-testid="staffClientHires-toastClientHires-errorAlert"]'
      ).should('be.visible');
    });
  });

  describe('when user access to client hires and open view profile', () => {
    before(() => {
      const stub = cy.stub().as('open');
      cy.on('window:before:load', (win) => {
        cy.stub(win, 'open').callsFake(stub);
      });
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/home');
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list:200-success'
      );
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-hires"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open view profile in the new tab', () => {
      cy.get('.MuiDataGrid-virtualScroller').scrollTo('right');
      cy.get('[data-testid="staffAuditClientHires-clientRow-itemOptions"]')
        .first()
        .scrollIntoView()
        .click();
      cy.get('[data-testid="staffClientHires-viewProfile"]').click();
      cy.get('@open').should('have.been.calledOnce');
    });
  });

  describe('when export data successfully', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/company/list-all:200-success');
      cy.mocksUseRouteVariant('people/v1/data-grid-export:200-success');
      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-hires"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when success ', () => {
      cy.get(
        '[data-testid="staffClientHires-dataGrid-MoreVertButton"]'
      ).click();
      cy.get('[data-testid="staffClientHires-exportData-button"]').click();
      cy.get('[data-testid="staffClientHires-toastClientHires"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffClientHires-toastClientHires-successAlert"]'
      ).should('be.visible');
    });

    it('should close  toast', () => {
      cy.get(
        '[data-testid="staffClientHires-toastClientHires-successAlert"]'
      ).clickOutside();
    });
  });

  describe('when export data fail - too many request', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/company/list-all:200-success');
      cy.mocksUseRouteVariant('people/v1/data-grid-export:429-error');
      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-hires"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when export data fail - 429 error ', () => {
      cy.get(
        '[data-testid="staffClientHires-dataGrid-MoreVertButton"]'
      ).click();
      cy.get('[data-testid="staffClientHires-exportData-button"]').click();
      cy.get('[data-testid="staffClientHires-toastClientHires"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffClientHires-toastClientHires-errorAlert"]'
      ).should('be.visible');
    });
  });

  describe('when export with nodata in data-grid', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list-workforce:200-workforce-empty'
      );
      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-hires"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when fail ', () => {
      cy.get(
        '[data-testid="staffClientHires-dataGrid-MoreVertButton"]'
      ).click();
      cy.get('[data-testid="staffClientHires-exportData-button"]').click();
      cy.get('[data-testid="staffClientHires-toastClientHires"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffClientHires-toastClientHires-errorAlert"]'
      ).should('be.visible');
    });
  });

  describe('when export data fail - internal error', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/company/list-all:200-success');
      cy.mocksUseRouteVariant('people/v1/data-grid-export:500-error');
      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-hires"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when export data fail - 500 error ', () => {
      cy.get(
        '[data-testid="staffClientHires-dataGrid-MoreVertButton"]'
      ).click();
      cy.get('[data-testid="staffClientHires-exportData-button"]').click();
      cy.get('[data-testid="staffClientHires-toastClientHires"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffClientHires-toastClientHires-errorAlert"]'
      ).should('be.visible');
    });
  });
});
