import { WORKER } from '@fixtures/users';

const mockedSelectedCompanyId = 'mb76nfp7zhs5mrxb';

describe('worker/home', () => {
  describe('when accessing the page', () => {
    before(() => {
      cy.clearCookies();

      cy.mocksUseRouteVariant(
        'people/v1/worker-user/get-employment-companies:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/worker-user/get-home:200-success');

      cy.login(WORKER);
      cy.visit('/worker/home');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirect to worker home page', () => {
      cy.url().should('include', '/worker/home');
    });

    it('should contain correct sidebar item', () => {
      cy.get(
        '[data-testid="workerHome-appLayout-primarySidebar-menuItem-singleLevel-worker-home"]'
      ).should('be.visible');
    });

    it('should contain correct page metadata on top navigation', () => {
      cy.get(
        '[data-testid="workerHome-appLayout-topNavigation-userName"]'
      ).should('be.visible');
    });
  });

  describe('when worker has only one company', () => {
    const signInWorker = () => {
      cy.visit('/worker/sign-in');

      cy.get('[data-testid="workerSignIn-emailField"]')
        .type('worker@ayp-group.com')
        .find('input')
        .should('have.value', 'worker@ayp-group.com');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();
      cy.get('[data-testid="workerSignIn-passwordField"]')
        .type('Aypglobalpay22')
        .find('input')
        .should('have.value', 'Aypglobalpay22');

      cy.login(WORKER);

      cy.get('[data-testid="workerSignIn-submitButton"]').click();
    };

    describe('when worker has NOT onboarded that company', () => {
      before(() => {
        cy.clearCookies();
        cy.clearAllSessionStorage();

        cy.mocksUseRouteVariant(
          'people/v1/worker-user/get-employment-companies:200-has-one-company'
        );
        cy.mocksUseRouteVariant(
          'people/v1/worker-user/get-home:400-redirect-error'
        );
        cy.mocksUseRouteVariant(
          'people/v1/auth/check-email:200-has-set-password'
        );
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/get-by-employment-id:200-employee-review-status'
        );

        signInWorker();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
        cy.logout({ callbackUrl: '/worker/sign-in' });
      });

      it('should redirect them to worker/onboarding page after login', () => {
        cy.url().should('include', '/worker/onboarding');
      });
    });

    describe('when worker has already onboarded that company', () => {
      before(() => {
        cy.clearCookies();
        cy.clearAllSessionStorage();

        cy.mocksUseRouteVariant(
          'people/v1/worker-user/get-employment-companies:200-has-one-company'
        );
        cy.mocksUseRouteVariant('people/v1/worker-user/get-home:200-success');
        cy.mocksUseRouteVariant(
          'people/v1/auth/check-email:200-has-set-password'
        );
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/get-by-employment-id:200-worker-onboarded-status-success'
        );

        signInWorker();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should contain correct page metadata', () => {
        cy.get('[data-testid="workerHome-description"]').should('be.visible');
      });
    });
  });

  describe('when worker already selected company before', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/worker-user/get-employment-companies:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/worker-user/get-home:200-success');

      cy.login(WORKER);
      cy.visit('/worker/home');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should contain correct page metadata', () => {
      cy.get('[data-testid="workerHome-description"]').should('be.visible');
    });
  });

  describe('when worker have NOT selected company', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/worker-user/get-employment-companies:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/worker-user/get-home:200-success');

      cy.login(WORKER);
      cy.visit('/worker/home');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should contain correct page metadata', () => {
      cy.get('[data-testid="workerHome-title-withCompanyInfo"]').should(
        'be.visible'
      );
      cy.get('[data-testid="workerHome-description"]').should('be.visible');
    });
  });

  describe('when clicking switch button', () => {
    describe('when worker select company that they have already onboarded', () => {
      before(() => {
        cy.clearCookies();

        cy.mocksUseRouteVariant(
          'people/v1/worker-user/get-employment-companies:200-success'
        );
        cy.mocksUseRouteVariant('people/v1/worker-user/get-home:200-success');

        cy.login(WORKER);
        cy.visit('/worker/home');

        cy.get('[data-testid="workerHome-switchButton"]').click();
        cy.get('[data-testid="workerHome-companySelectField"]').click();
        cy.get(
          `[data-testid=workerHome-companySelectField-optionId-${mockedSelectedCompanyId}]`
        ).click();
        cy.get('[data-testid="workerHome-confirmButton"]').click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should contain correct page metadata', () => {
        cy.get('[data-testid="workerHome-description"]').should('be.visible');
      });
    });

    describe('when worker select company that they have NOT onboarded', () => {
      before(() => {
        cy.clearCookies();

        cy.mocksUseRouteVariant(
          'people/v1/worker-user/get-employment-companies:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/get-by-employment-id:200-worker-onboarded-status-success'
        );
        cy.mocksUseRouteVariant('people/v1/worker-user/get-home:200-success');

        cy.login(WORKER);
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
        cy.logout({ callbackUrl: '/worker/sign-in' });
      });

      it('should redirect them to worker/home page to select user profile', () => {
        cy.visit('/worker/home');

        cy.url().should('include', '/worker/home');
      });

      it('should redirect them to worker/onboarding page', () => {
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/get-by-employment-id:200-employee-review-status'
        );
        cy.mocksUseRouteVariant(
          'people/v1/worker-user/get-home:400-redirect-error'
        );

        cy.get('[data-testid="workerHome-switchButton"]').click();
        cy.get('[data-testid="workerHome-companySelectField"]').click();
        cy.get(
          `[data-testid=workerHome-companySelectField-optionId-${mockedSelectedCompanyId}]`
        ).click();
        cy.get('[data-testid="workerHome-confirmButton"]').click();

        cy.url().should('include', '/worker/onboarding');
      });
    });

    describe('when worker cancel switch company', () => {
      before(() => {
        cy.clearCookies();
        cy.clearAllSessionStorage();

        cy.mocksUseRouteVariant(
          'people/v1/worker-user/get-employment-companies:200-success'
        );
        cy.mocksUseRouteVariant('people/v1/worker-user/get-home:200-success');
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/get-by-employment-id:200-worker-onboarded-status-success'
        );

        cy.login(WORKER);
        cy.visit('/worker/home');

        cy.get('[data-testid="workerHome-switchButton"]').click();
        cy.get('[data-testid="workerHome-cancelButton"]').click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should contain correct page metadata', () => {
        cy.get('[data-testid="workerHome-title-withCompanyInfo"]').should(
          'be.visible'
        );
        cy.get('[data-testid="workerHome-description"]').should('be.visible');
      });
    });
  });

  describe('when user logout from worker home page', () => {
    before(() => {
      cy.clearCookies();
      cy.clearAllSessionStorage();

      cy.login(WORKER);

      cy.mocksUseRouteVariant(
        'people/v1/worker-user/get-employment-companies:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/worker-user/get-home:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-by-employment-id:200-worker-onboarded-status-success'
      );

      cy.visit('/worker/home');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirect to worker sign in page', () => {
      cy.get(
        '[data-testid="workerHome-appLayout-topNavigation-iconButton"]'
      ).click();
      cy.get(
        '[data-testid="workerHome-appLayout-topNavigation-signOut"]'
      ).click();

      cy.logout({ callbackUrl: '/worker/sign-in' });
      cy.url().should('include', '/worker/sign-in');
    });
  });

  describe(
    'when accessing /worker/home on mobile',
    { viewportWidth: 400, viewportHeight: 800 },
    () => {
      before(() => {
        cy.clearCookies();

        cy.mocksUseRouteVariant(
          'people/v1/worker-user/get-employment-companies:200-success'
        );
        cy.mocksUseRouteVariant('people/v1/worker-user/get-home:200-success');
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/get-by-employment-id:200-worker-onboarded-status-success'
        );

        cy.login(WORKER);
        cy.visit('/worker/home');
      });

      it('should contain button on the left top navigation', () => {
        cy.get(
          '[data-testid="workerHome-appLayout-topNavigation-mobileTopNavigation-iconButton"]'
        ).should('be.visible');
      });
    }
  );
});
