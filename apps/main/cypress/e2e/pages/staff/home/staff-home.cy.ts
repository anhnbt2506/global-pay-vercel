import {
  STAFF_ADMIN,
  STAFF_AUDITOR,
  STAFF_MARKETING,
  STAFF_LEGAL,
} from '@fixtures/users';

describe('staff/home', () => {
  describe('when accessing /staff/home', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/home');
    });

    it('should redirects to the staff home page', () => {
      cy.url().should('include', '/staff/home');
    });

    it('should contain correct page metadata', () => {
      cy.get('[data-testid="staffHome-title"]').should('be.visible');
      cy.get('[data-testid="staffHome-description"]').should('be.visible');
    });

    it('should contain correct page metadata on top navigation', () => {
      cy.get(
        '[data-testid="staffHome-appLayout-topNavigation-userName"]'
      ).should('be.visible');
    });
  });

  describe('when user logout from staff home page', () => {
    before(() => {
      cy.clearCookies();
      cy.login(STAFF_ADMIN);

      cy.visit('/staff/home');
    });

    it('should redirect to staff sign in page', () => {
      cy.logout({ callbackUrl: '/staff/sign-in' });
      cy.url().should('include', '/staff/sign-in');
    });
  });

  describe('accessing the page with side bar by admin role', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/home');
    });

    it('should contain correct item in sidebar', () => {
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-singleLevel-staff-home"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-singleLevel-staff-email-templates"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-contracts-title"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-setup-title"]'
      ).should('be.visible');
    });
  });

  describe('when user access to Calendar page via sidebar by admin role', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-setup-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-setup-calendar"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirect to staff Setup Calendar page', () => {
      cy.url().should('include', '/staff/setup/calendar');
    });
  });

  describe('when user access to client list page via sidebar by admin role', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/home');
      cy.mocksUseRouteVariant('people/v1/company/list:200-success');
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
  });

  describe('when user access to client hires page via sidebar by admin role', () => {
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
  });

  describe('when user access to client service agreements page via sidebar by admin role', () => {
    before(() => {
      cy.login(STAFF_ADMIN);

      cy.visit('/staff/home');

      cy.mocksUseRouteVariant(
        'people/v1/service-agreement/get-list:200-success'
      );

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

    it('should redirect to staff client service agreements page', () => {
      cy.url().should('include', '/staff/audit/client-service-agreements');
    });
  });

  describe('when user access to PEO agreement page via sidebar by admin role', () => {
    before(() => {
      cy.login(STAFF_ADMIN);

      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-contracts-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-contracts-peo-agreement"]'
      ).click();
    });

    it('should redirect to  PEO agreement page', () => {
      cy.url().should('include', '/staff/contracts/peo-agreement');
    });
  });

  describe('when user access to service agreement page via sidebar by admin role', () => {
    before(() => {
      cy.login(STAFF_ADMIN);

      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-contracts-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-contracts-service-agreement"]'
      ).click();
    });

    it('should redirect to  service agreement page', () => {
      cy.url().should('include', '/staff/contracts/service-agreement');
    });
  });

  describe('when user access to email template page via sidebar by admin role', () => {
    before(() => {
      cy.login(STAFF_ADMIN);

      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-singleLevel-staff-email-templates"]'
      ).click();
    });

    it('should redirect to email template page', () => {
      cy.url().should('include', '/staff/email-templates');
    });
  });

  describe('accessing the page with side bar by auditor role', () => {
    before(() => {
      cy.login(STAFF_AUDITOR);
      cy.visit('/staff/home');
    });

    it('should contain correct item in sidebar', () => {
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-singleLevel-staff-home"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).should('be.visible');
    });
  });

  describe('when user access to Calendar page via sidebar by auditor role', () => {
    before(() => {
      cy.login(STAFF_AUDITOR);
      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-setup-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-setup-calendar"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirect to staff Setup Calendar page', () => {
      cy.url().should('include', '/staff/setup/calendar');
    });
  });

  describe('when user access to client list page via sidebar by auditor role', () => {
    before(() => {
      cy.login(STAFF_AUDITOR);
      cy.visit('/staff/home');
      cy.mocksUseRouteVariant('people/v1/company/list:200-success');
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
  });

  describe('when user access to client hires page via sidebar by auditor role', () => {
    before(() => {
      cy.login(STAFF_AUDITOR);

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
  });

  describe('when user access to client service agreements page via sidebar by auditor role', () => {
    before(() => {
      cy.login(STAFF_AUDITOR);

      cy.visit('/staff/home');

      cy.mocksUseRouteVariant(
        'people/v1/service-agreement/get-list:200-success'
      );

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

    it('should redirect to staff client service agreements page', () => {
      cy.url().should('include', '/staff/audit/client-service-agreements');
    });
  });

  describe('accessing the page with side bar by marketing role', () => {
    before(() => {
      cy.login(STAFF_MARKETING);
      cy.visit('/staff/home');
    });

    it('should contain correct item in sidebar', () => {
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-singleLevel-staff-home"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-singleLevel-staff-email-templates"]'
      ).should('be.visible');
    });
  });

  describe('when user access to email template page via sidebar by marketing role', () => {
    before(() => {
      cy.login(STAFF_MARKETING);

      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-singleLevel-staff-email-templates"]'
      ).click();
    });

    it('should redirect to email template page', () => {
      cy.url().should('include', '/staff/email-templates');
    });
  });

  describe('accessing the page with side bar by legal role', () => {
    before(() => {
      cy.login(STAFF_LEGAL);
      cy.visit('/staff/home');
    });

    it('should contain correct item in sidebar', () => {
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-singleLevel-staff-home"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-audit-title"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-contracts-title"]'
      ).should('be.visible');
    });
  });

  describe('when user access to client service agreements page via sidebar by legal role', () => {
    before(() => {
      cy.login(STAFF_LEGAL);

      cy.visit('/staff/home');

      cy.mocksUseRouteVariant(
        'people/v1/service-agreement/get-list:200-success'
      );

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

    it('should redirect to staff client service agreements page', () => {
      cy.url().should('include', '/staff/audit/client-service-agreements');
    });
  });

  describe('when user access to PEO agreement page via sidebar by legal role', () => {
    before(() => {
      cy.login(STAFF_LEGAL);

      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-contracts-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-contracts-peo-agreement"]'
      ).click();
    });

    it('should redirect to  PEO agreement page', () => {
      cy.url().should('include', '/staff/contracts/peo-agreement');
    });
  });

  describe('when user access to service agreement page via sidebar by legal role', () => {
    before(() => {
      cy.login(STAFF_LEGAL);

      cy.visit('/staff/home');
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-staff-contracts-title"]'
      ).click();
      cy.get(
        '[data-testid="staffHome-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-staff-contracts-service-agreement"]'
      ).click();
    });

    it('should redirect to  service agreement page', () => {
      cy.url().should('include', '/staff/contracts/service-agreement');
    });
  });

  describe('when support show toast after download Csv file at download page', () => {
    const queryPath = '/staff/home?message=message&code=200';
    before(() => {
      cy.clearCookies();
      cy.login(STAFF_ADMIN);

      cy.visit(queryPath);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast success ', () => {
      cy.get('[data-testid="staffHome-toast"]').should('be.visible');
      cy.get('[data-testid="staffHome-toast-successAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when support show toast after download Csv file at download page', () => {
    const queryPath = '/staff/home?message=message&code=200';
    before(() => {
      cy.clearCookies();
      cy.login(STAFF_ADMIN);

      cy.visit(queryPath);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast success ', () => {
      cy.get('[data-testid="staffHome-toast"]').should('be.visible');
      cy.get('[data-testid="staffHome-toast-successAlert"]').should(
        'be.visible'
      );
    });
    it('should close  toast', () => {
      cy.get('[data-testid="staffHome-toast-successAlert"]').clickOutside();
    });
  });

  describe('when does not have query code - does not show toast', () => {
    const queryPath = '/staff/home?message=message';
    before(() => {
      cy.clearCookies();
      cy.login(STAFF_ADMIN);

      cy.visit(queryPath);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should contain correct page metadata', () => {
      cy.get('[data-testid="staffHome-title"]').should('be.visible');
      cy.get('[data-testid="staffHome-description"]').should('be.visible');
    });

    it('should contain correct page metadata on top navigation', () => {
      cy.get(
        '[data-testid="staffHome-appLayout-topNavigation-userName"]'
      ).should('be.visible');
    });
  });

  describe('when does click logout', () => {
    before(() => {
      cy.clearCookies();
      cy.login(STAFF_ADMIN);

      cy.visit('/staff/home');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should logout and redirect to login page', () => {
      cy.get(
        '[data-testid="staffHome-appLayout-topNavigation-iconButton"]'
      ).click();

      cy.get(
        '[data-testid="staffHome-appLayout-topNavigation-signOut"]'
      ).click();

      cy.logout({ callbackUrl: '/staff/sign-in' });

      cy.url().should('include', '/staff/sign-in');
    });
  });

  describe(
    'when accessing /staff/home on mobile',
    { viewportWidth: 400, viewportHeight: 800 },
    () => {
      before(() => {
        cy.login(STAFF_ADMIN);

        cy.visit('/staff/home');
      });

      it('should contain button on the left top navigation', () => {
        cy.get(
          '[data-testid="staffHome-appLayout-topNavigation-mobileTopNavigation-iconButton"]'
        ).should('be.visible');
      });
    }
  );
});
