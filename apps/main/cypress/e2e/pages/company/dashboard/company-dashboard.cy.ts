import { COMPANY_OWNER } from '@fixtures/users';

describe('company/dashboard', () => {
  describe('when accessing /company/dashboard', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');

      cy.login(COMPANY_OWNER);
      cy.visit('/company/dashboard');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the dashboard home page', () => {
      cy.url().should('include', '/company/dashboard');
    });

    it('should contain correct page metadata on top navigation', () => {
      cy.get(
        '[data-testid="companyDashboard-appLayout-topNavigation-userName"]'
      ).should('be.visible');
    });
  });

  describe('when user logout from company dashboard  page', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');

      cy.login(COMPANY_OWNER);
      cy.visit('/company/dashboard');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirect to company sign in page', () => {
      cy.logout({ callbackUrl: '/company/sign-in' });
      cy.url().should('include', '/company/sign-in');
    });
  });

  describe('accessing the page with sidebar ', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');

      cy.login(COMPANY_OWNER);
      cy.visit('/company/dashboard');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should contain correct item in sidebar', () => {
      cy.get(
        '[data-testid="companyDashboard-appLayout-primarySidebar-menuItem-singleLevel-company-dashboard"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyDashboard-appLayout-primarySidebar-menuItem-singleLevel-live-support"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyDashboard-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-company-people-title"]'
      ).should('be.visible');
    });
  });

  describe('when user access to onboarding page via sidebar', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-list-onboarding:200-onboarding-success'
      );

      cy.login(COMPANY_OWNER);
      cy.visit('/company/dashboard');

      cy.get(
        '[data-testid="companyDashboard-appLayout-primarySidebar-menuItem-multiLevel-primarySidebar-company-people-title"]'
      ).click();
      cy.get(
        '[data-testid="companyDashboard-appLayout-primarySidebar-menuItem-multiLevel-singleLevel-company-people-onboarding"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirect to company onboarding  page', () => {
      cy.url().should('include', '/company/people/onboarding');
    });
  });

  describe('when user access to live support page via sidebar', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');

      // create a single stub we will use
      const stub = cy.stub().as('open');
      cy.on('window:before:load', (win) => {
        cy.stub(win, 'open').callsFake(stub);
      });

      cy.login(COMPANY_OWNER);
      cy.visit('/company/dashboard');

      cy.get(
        '[data-testid="companyDashboard-appLayout-primarySidebar-menuItem-singleLevel-live-support"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open live support  page', () => {
      cy.get('@open').should('have.been.calledOnce');
    });
  });

  describe('when user access to company dashboard and token does not exist', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/tableau/request-token:400-username-is-invalid'
      );

      cy.login(COMPANY_OWNER);
      cy.visit('/company/dashboard');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should contain correct page metadata', () => {
      cy.get('[data-testid="companyDashboard-noData-title"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companyDashboard-noData-caption"]').should(
        'be.visible'
      );
    });
  });

  describe('when user access to company dashboard and token exists', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');

      cy.login(COMPANY_OWNER);
      cy.visit('/company/dashboard');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should contain correct page metadata', () => {
      cy.get('[data-testid="companyDashboard-tableauDashboard"]').should(
        'be.visible'
      );
    });
  });

  describe(
    'when accessing /staff/home on mobile',
    { viewportWidth: 400, viewportHeight: 800 },
    () => {
      before(() => {
        cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');

        cy.login(COMPANY_OWNER);
        cy.visit('/company/dashboard');
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should contain button on the left top navigation', () => {
        cy.get(
          '[data-testid="companyDashboard-appLayout-topNavigation-mobileTopNavigation-iconButton"]'
        ).should('be.visible');
      });
    }
  );

  describe('when user access to help center page via sidebar', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');

      // create a single stub we will use
      const stub = cy.stub().as('open');
      cy.on('window:before:load', (win) => {
        cy.stub(win, 'open').callsFake(stub);
      });

      cy.login(COMPANY_OWNER);
      cy.visit('/company/dashboard');

      cy.get(
        '[data-testid="companyDashboard-appLayout-primarySidebar-menuItem-singleLevelhttps:--info.ayp-group.com-knowledge"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open help center page', () => {
      cy.get('@open').should('have.been.calledOnce');
    });
  });

  describe('when user access url that contain ga tracking without company name parameter', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');

      cy.login(
        Object.assign({}, COMPANY_OWNER, {
          selectedUserContext: {
            ...COMPANY_OWNER.selectedUserContext,
            contextCompanyName: null,
          },
        })
      );
    });

    it('should fire ga event and remove ga parameter in url', () => {
      cy.visit('/company/dashboard?ga=scb_tracking');

      cy.url().should('not.contain', 'ga');
    });

    it('should not fire ga event when type of ga is not string', () => {
      cy.visit('/company/dashboard?ga=scb_tracking&ga=scb_tracking=2');

      cy.url().should('contain', 'ga');
    });
  });

  describe('when user access url that contain ga tracking with full parameters', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');
      cy.login(COMPANY_OWNER);
    });

    it('should fire ga event and remove ga parameter in url', () => {
      cy.visit('/company/dashboard?ga=scb_tracking');

      cy.url().should('not.contain', 'ga');
    });

    it('should not fire ga event when type of ga is not string', () => {
      cy.visit('/company/dashboard?ga=scb_tracking&ga=scb_tracking=2');

      cy.url().should('contain', 'ga');
    });
  });

  describe('when user click logout', () => {
    before(() => {
      cy.clearCookies();
      cy.login(COMPANY_OWNER);
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');

      cy.visit('/staff/home');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should logout and redirect to login page', () => {
      cy.get(
        '[data-testid="companyDashboard-appLayout-topNavigation-iconButton"]'
      ).click();
      cy.get(
        '[data-testid="companyDashboard-appLayout-topNavigation-signOut"]'
      ).click();

      cy.logout({ callbackUrl: '/company/sign-in' });

      cy.url().should('include', '/company/sign-in');
    });
  });
});
