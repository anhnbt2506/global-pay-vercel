import { COMPANY_OWNER } from '@fixtures/users';

describe('company/sign-in', () => {
  describe('when accessing /company', () => {
    before(() => {
      cy.clearCookies();

      cy.visit('/company');
    });

    it('should redirects to the company sign-in page', () => {
      cy.url().should('include', '/company/sign-in');
    });

    it('should contain correct page metadata', () => {
      cy.get('[data-testid="companySignIn-title"]').should('be.visible');
      cy.get('[data-testid="companySignIn-description"]').should('be.visible');
      cy.get('[data-testid="companySignIn-sidebar-title"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companySignIn-sidebar-subtitle"]').should(
        'be.visible'
      );
    });
  });

  describe(
    'when accessing /company on mobile',
    { viewportWidth: 400, viewportHeight: 800 },
    () => {
      before(() => {
        cy.clearCookies();

        cy.visit('/company');
      });

      it('should redirects to the company sign-in page', () => {
        cy.url().should('include', '/company/sign-in');
      });

      it('should contain correct page metadata', () => {
        cy.get('[data-testid="companySignIn-title"]').should('be.visible');
        cy.get('[data-testid="companySignIn-description"]').should(
          'be.visible'
        );
        cy.get('[data-testid="companySignIn-sidebar-title"]').should(
          'not.be.visible'
        );
        cy.get('[data-testid="companySignIn-sidebar-subtitle"]').should(
          'not.be.visible'
        );
      });
    }
  );

  describe('when support path redirect after user sign in', () => {
    const redirectPath = '/company/people/onboarding?code=1';

    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/auth/check-email:200-has-set-password'
      );
      cy.mocksUseRouteVariant(
        'people/v1/company/people/onboarding/get-list:200-success'
      );

      cy.visit(redirectPath);

      cy.get('[data-testid="companySignIn-emailField"]')
        .type('alpha@example.com')
        .find('input')
        .should('have.value', 'alpha@example.com');
      cy.get('[data-testid="companySignIn-submitButton"]').click();
      cy.wait(1_000);
      cy.get('[data-testid="companySignIn-passwordField"]')
        .type('password')
        .find('input');

      cy.login(COMPANY_OWNER);

      cy.get('[data-testid="companySignIn-submitButton"]').click();
    });

    after(() => {
      cy.logout({ callbackUrl: '/company/sign-in' });
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the company/people/onboarding', () => {
      cy.url().should('include', redirectPath);
    });
  });

  describe('when credentials are correct', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/auth/check-email:200-has-set-password'
      );

      cy.visit('/company/sign-in');
      cy.get('[data-testid="companySignIn-emailField"]')
        .type('alpha@example.com')
        .find('input')
        .should('have.value', 'alpha@example.com');
      cy.get('[data-testid="companySignIn-submitButton"]').click();
      cy.wait(1_000);
      cy.get('[data-testid="companySignIn-passwordField"]')
        .type('password')
        .find('input');

      cy.login(COMPANY_OWNER);

      cy.get('[data-testid="companySignIn-submitButton"]').click();
    });

    after(() => {
      cy.logout({ callbackUrl: '/company/sign-in' });
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the company dashboard', () => {
      cy.url().should('include', '/company/dashboard');
    });
  });

  describe('when the email is in wrong format', () => {
    before(() => {
      cy.clearCookies();

      cy.visit('/company');

      cy.get('[data-testid="companySignIn-emailField"]')
        .type('alpha')
        .find('input')
        .should('have.value', 'alpha');
      cy.get('[data-testid="companySignIn-submitButton"]').click();
    });

    it('should display an error message', () => {
      cy.get('[data-testid="companySignIn-emailField-error"]').should(
        'be.visible'
      );
    });
  });

  describe('when the password is empty', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/auth/check-email:200-has-set-password'
      );
      cy.visit('/company');

      cy.get('[data-testid="companySignIn-emailField"]')
        .type('alpha@example.com')
        .find('input')
        .should('have.value', 'alpha@example.com');
      cy.get('[data-testid="companySignIn-submitButton"]').click();
      cy.get('[data-testid="companySignIn-passwordField"]').should(
        'have.value',
        ''
      );
      cy.get('[data-testid="companySignIn-submitButton"]').click();
    });

    it('should display an error message', () => {
      cy.get('[data-testid="companySignIn-passwordField-error"]').should(
        'be.visible'
      );
    });
  });

  describe('when the email and/or password combination is not correct', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/auth/check-email:200-has-set-password'
      );
      cy.visit('/company');

      cy.get('[data-testid="companySignIn-emailField"]')
        .type('alpha@example.com')
        .find('input')
        .should('have.value', 'alpha@example.com');
      cy.get('[data-testid="companySignIn-submitButton"]').click();
      cy.get('[data-testid="companySignIn-passwordField"]')
        .type('password')
        .find('input')
        .should('have.value', 'password');
      cy.get('[data-testid="companySignIn-submitButton"]').click();
    });

    it('should display an error message', () => {
      cy.get('[data-testid="companySignIn-passwordField-error"]').should(
        'be.visible'
      );
    });
  });

  describe('when the email is not verified', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/auth/check-email:200-has-not-verify-email'
      );
      cy.visit('/company');

      cy.get('[data-testid="companySignIn-emailField"]')
        .type('alpha@example.com')
        .find('input')
        .should('have.value', 'alpha@example.com');
      cy.get('[data-testid="companySignIn-submitButton"]').click();
    });

    after(() => {
      cy.logout({ callbackUrl: '/company/sign-in' });
      cy.mocksRestoreRouteVariants();
    });

    it(
      'should display a notice to email verification',
      { viewportHeight: 800, viewportWidth: 400 },
      () => {
        cy.get('[data-testid="companySignIn-emailVerificationTitle"]').should(
          'be.visible'
        );
        cy.get(
          '[data-testid="companySignIn-emailVerificationDescription"]'
        ).should('be.visible');
      }
    );

    it('should display a sidebar to notice email verification', () => {
      cy.get('[data-testid="companySignIn-sidebar-subtitle"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companySignIn-sidebar-title"]').should(
        'be.visible'
      );
    });
  });

  describe('when company client verify the email successfully', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/auth/verify:200-has-set-password');
      cy.visit('/company/sign-in?code=abc');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display a a toast verify success', () => {
      cy.get('[data-testid="companySignIn-toast-successAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when company client verify the email, but the link is expired', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/auth/verify:400-verification-link-expired'
      );
      cy.visit('/company/sign-in?code=abc');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display a a toast verify error', () => {
      cy.get('[data-testid="companySignIn-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });
});
