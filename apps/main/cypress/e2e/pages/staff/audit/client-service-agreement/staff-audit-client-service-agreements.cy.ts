import { STAFF_ADMIN } from '@fixtures/users';

describe('staff/audit/client-service-agreements', () => {
  describe('when user access to client service agreement via side bar', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/service-agreement/get-list:200-success'
      );

      cy.login(STAFF_ADMIN);
      cy.visit('/staff/home');

      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-service-agreements"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirect to staff client list page', () => {
      cy.url().should('include', '/staff/audit/client-service-agreements');
    });

    it('should display correctly column of table', () => {
      cy.viewport(1920, 1080);
      const columnNames = [
        'Client',
        'Service Agreement',
        'Days In-review',
        'Total Updates',
        'Current Status',
      ];
      const firstRowData = ['AYP-GP', 'POM', '-', '-', 'Signed'];
      columnNames.forEach((value) => cy.contains(value));
      firstRowData.forEach((value) => cy.contains(value));
    });

    it('should move between pages when click next, previously button', () => {
      cy.get('[data-testid="KeyboardArrowRightIcon"]').click();
      cy.contains('26–28 of 28').should('be.visible');
      cy.get('[data-testid="KeyboardArrowLeftIcon"]').click();
      cy.contains('1–25 of 28').should('be.visible');
    });
  });

  describe('when user access to client service agreements page with no data', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/service-agreement/get-list:200-empty');

      cy.login(STAFF_ADMIN);
      cy.visit('/staff/audit/client-service-agreements');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display no rows overlay client list', () => {
      cy.get(
        '[data-testid="no-rows-overlay-clientServiceAgreements-icon"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="no-rows-overlay-clientServiceAgreements-title"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="no-rows-overlay-clientServiceAgreements-description"]'
      ).should('be.visible');
    });
  });

  describe('when user access to client service agreements and open service agreements view', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/service-agreement/get-list:200-success'
      );

      // create a single stub we will use
      const stub = cy.stub().as('open');
      cy.on('window:before:load', (win) => {
        cy.stub(win, 'open').callsFake(stub);
      });

      cy.login(STAFF_ADMIN);
      cy.visit('/staff/audit/client-service-agreements');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open view detail client service agreement in the new tab', () => {
      cy.get('.MuiDataGrid-virtualScroller').scrollTo('right');
      cy.get(
        '[data-testid="staffAuditClientServiceAgreements-clientServiceAgreementsRow-itemOptions"]'
      )
        .first()
        .scrollIntoView()
        .click();
      cy.get(
        `[data-testid="staffAuditClientServiceAgreements-clientServiceAgreementsRow-itemOptions-view"]`
      ).click();

      cy.get('@open').should('have.been.calledOnce');
    });
  });
  describe('when export data successfully', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant(
        'people/v1/service-agreement/get-list:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/data-grid-export:200-success');
      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-service-agreements"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when success ', () => {
      cy.get(
        '[data-testid="staffAuditClientServiceAgreements-dataGrid-MoreVertButton"]'
      ).click();
      cy.get(
        '[data-testid="staffAuditClientServiceAgreements-exportData-button"]'
      ).click();
      cy.get('[data-testid="staffAuditClientServiceAgreements-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffAuditClientServiceAgreements-toast-successAlert"]'
      ).should('be.visible');
    });

    it('should close  toast', () => {
      cy.get(
        '[data-testid="staffAuditClientServiceAgreements-toast-successAlert"]'
      ).clickOutside();
    });
  });

  describe('when export data fail - too many request', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant(
        'people/v1/service-agreement/get-list:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/data-grid-export:429-error');
      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-service-agreements"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when export data fail - 429 error ', () => {
      cy.get(
        '[data-testid="staffAuditClientServiceAgreements-dataGrid-MoreVertButton"]'
      ).click();
      cy.get(
        '[data-testid="staffAuditClientServiceAgreements-exportData-button"]'
      ).click();
      cy.get('[data-testid="staffAuditClientServiceAgreements-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffAuditClientServiceAgreements-toast-errorAlert"]'
      ).should('be.visible');
    });
  });

  describe('when export with nodata in data-grid', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant('people/v1/service-agreement/get-list:200-empty');
      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-service-agreements"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when fail ', () => {
      cy.get(
        '[data-testid="staffAuditClientServiceAgreements-dataGrid-MoreVertButton"]'
      ).click();
      cy.get(
        '[data-testid="staffAuditClientServiceAgreements-exportData-button"]'
      ).click();
      cy.get('[data-testid="staffAuditClientServiceAgreements-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffAuditClientServiceAgreements-toast-errorAlert"]'
      ).should('be.visible');
    });
  });

  describe('when export data fail - internal error', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant(
        'people/v1/service-agreement/get-list:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/data-grid-export:500-error');
      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-audit-client-service-agreements"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast when export data fail - 500 error ', () => {
      cy.get(
        '[data-testid="staffAuditClientServiceAgreements-dataGrid-MoreVertButton"]'
      ).click();
      cy.get(
        '[data-testid="staffAuditClientServiceAgreements-exportData-button"]'
      ).click();
      cy.get('[data-testid="staffAuditClientServiceAgreements-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffAuditClientServiceAgreements-toast-errorAlert"]'
      ).should('be.visible');
    });
  });
});
