import { WORKER } from '@fixtures/users';

import { testEachViewport } from 'support/utils';

describe('worker/sign-in', () => {
  describe('when accessing the page', () => {
    before(() => {
      cy.clearCookies();
      cy.visit('/worker');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirect to worker sign-in page', () => {
      cy.url().should('include', '/worker/sign-in');
    });

    it('should contain correct page metadata', () => {
      cy.get('[data-testid="workerSignIn-title"]').should('be.visible');
      cy.get('[data-testid="workerSignIn-description"]').should('be.visible');
      cy.get('[data-testid="workerSignIn-sidebar-title"]').should('be.visible');
      cy.get('[data-testid="workerSignIn-sidebar-subtitle"]').should(
        'be.visible'
      );
    });
  });

  describe('when worker has not set password', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/auth/check-email:200-has-not-set-password'
      );
      cy.visit('/worker');
      cy.get('[data-testid="workerSignIn-emailField"]')
        .type('worker@ayp-group.com')
        .find('input')
        .should('have.value', 'worker@ayp-group.com');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should have correct page url', () => {
      cy.url().should('include', '/worker/sign-in');
    });

    it('should show password field', () => {
      cy.get('[data-testid="workerSignIn-setPasswordField"]').should(
        'be.visible'
      );
    });
  });

  describe('when worker has not set password and given password not yet meet requirements', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/auth/check-email:200-has-not-set-password'
      );

      cy.visit('/worker');
      cy.get('[data-testid="workerSignIn-emailField"]')
        .type('worker@ayp-group.com')
        .find('input')
        .should('have.value', 'worker@ayp-group.com');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should have correct page url', () => {
      cy.url().should('include', '/worker/sign-in');
    });

    it('should show password field', () => {
      cy.get('[data-testid="workerSignIn-setPasswordField"]').should(
        'be.visible'
      );
    });

    it('should show error when password does not meet requirements', () => {
      cy.get('[data-testid="workerSignIn-setPasswordField"]')
        .type('Awf2')
        .find('input')
        .should('have.value', 'Awf2');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();

      cy.get('[data-testid="workerSignIn-setPasswordField-error"]').should(
        'be.visible'
      );
    });
  });

  describe('when worker has not set password and given password meet requirements, but API not responding', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/auth/check-email:200-has-not-set-password'
      );
      cy.mocksUseRouteVariant(
        'people/v1/auth/set-password:400-password-too-short'
      );

      cy.visit('/worker');
      cy.get('[data-testid="workerSignIn-emailField"]')
        .type('worker@ayp-group.com')
        .find('input')
        .should('have.value', 'worker@ayp-group.com');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should have correct page url', () => {
      cy.url().should('include', '/worker/sign-in');
    });

    it('should show password field', () => {
      cy.get('[data-testid="workerSignIn-setPasswordField"]').should(
        'be.visible'
      );
    });

    it('should show toast error message when API is not responding', () => {
      cy.get('[data-testid="workerSignIn-setPasswordField"]')
        .type('Aypglobalpay22')
        .find('input')
        .should('have.value', 'Aypglobalpay22');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();

      cy.get('[data-testid="workerSignIn-toast"]').should('be.visible');
      cy.get('[data-testid="workerSignIn-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when worker has not set password and given password has met requirements', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/auth/check-email:200-has-not-set-password'
      );
      cy.mocksUseRouteVariant('people/v1/auth/set-password:200-success');

      cy.visit('/worker');
      cy.get('[data-testid="workerSignIn-emailField"]')
        .type('worker@ayp-group.com')
        .find('input')
        .should('have.value', 'worker@ayp-group.com');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should have correct page url', () => {
      cy.url().should('include', '/worker/sign-in');
    });

    it('should show password field', () => {
      cy.get('[data-testid="workerSignIn-setPasswordField"]').should(
        'be.visible'
      );
    });

    it('should show toast success message', () => {
      cy.get('[data-testid="workerSignIn-setPasswordField"]')
        .type('Aypglobalpay22')
        .find('input')
        .should('have.value', 'Aypglobalpay22');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();

      cy.get('[data-testid="workerSignIn-toast"]').should('be.visible');
      cy.get('[data-testid="workerSignIn-toast-successAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when worker has not verify email', () => {
    testEachViewport('', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant(
          'people/v1/auth/check-email:200-has-not-verify-email'
        );

        cy.visit('/worker');
        cy.get('[data-testid="workerSignIn-emailField"]')
          .type('worker@ayp-group.com')
          .find('input')
          .should('have.value', 'worker@ayp-group.com');
        cy.get('[data-testid="workerSignIn-submitButton"]').click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should have correct page url', () => {
        cy.url().should('include', '/worker/sign-in');
      });

      it('should show verify email message', () => {
        cy.get('[data-testid="workerSignIn-emailVerificationTitle"]').should(
          'be.visible'
        );
        cy.get(
          '[data-testid="workerSignIn-emailVerificationDescription"]'
        ).should('be.visible');
      });
    });
  });

  describe('when worker email is not found', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/auth/check-email:400-email-not-exist');

      cy.visit('/worker');
      cy.get('[data-testid="workerSignIn-emailField"]')
        .type('worker@ayp-group.com')
        .find('input')
        .should('have.value', 'worker@ayp-group.com');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should have correct page url', () => {
      cy.url().should('include', '/worker/sign-in');
    });

    it('should show toast error message', () => {
      cy.get('[data-testid="workerSignIn-toast"]').should('be.visible');
      cy.get('[data-testid="workerSignIn-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when worker has set password and has successfully verify email before', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/auth/check-email:200-has-set-password'
      );

      cy.visit('/worker/home');
      cy.get('[data-testid="workerSignIn-emailField"]')
        .type('worker@ayp-group.com')
        .find('input')
        .should('have.value', 'worker@ayp-group.com');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();
    });

    after(() => {
      cy.logout({ callbackUrl: '/worker/sign-in' });
      cy.mocksRestoreRouteVariants();
    });

    it('should have correct page url', () => {
      cy.url().should('include', '/worker/sign-in');
    });

    it('should show password field', () => {
      cy.get('[data-testid="workerSignIn-passwordField"]').should('be.visible');
    });

    it('should display an error message when password is incorrect', () => {
      cy.get('[data-testid="workerSignIn-passwordField"]')
        .type('Aypglobalpay22')
        .find('input')
        .should('have.value', 'Aypglobalpay22');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();

      cy.get('[data-testid="workerSignIn-passwordField-error"]').should(
        'be.visible'
      );
    });

    it('should redirect to worker home once the credential is correct', () => {
      cy.get('[data-testid="workerSignIn-passwordField"]')
        .find('input')
        .clear();
      cy.get('[data-testid="workerSignIn-passwordField"]')
        .type('Aypglobalpay22')
        .find('input')
        .should('have.value', 'Aypglobalpay22');
      cy.login(WORKER);
      cy.get('[data-testid="workerSignIn-submitButton"]').click();

      cy.url().should('include', '/worker/home');
    });
  });

  describe('when worker has set password and has successfully verify email before, then redirect to a path after user sign in', () => {
    const redirectPath = '/worker/employment-contract?code=1';

    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/auth/check-email:200-has-set-password'
      );
      cy.mocksUseRouteVariant(
        'people/v1/worker-user/get-employment-companies:200-success'
      );
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-by-employment-id:200-worker-status-success'
      );
      cy.mocksUseRouteVariant('people/v1/agreement/get:200-success');

      cy.visit(redirectPath);
      cy.get('[data-testid="workerSignIn-emailField"]')
        .type('worker@ayp-group.com')
        .find('input')
        .should('have.value', 'worker@ayp-group.com');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();
    });

    after(() => {
      cy.logout({ callbackUrl: '/worker/sign-in' });
      cy.mocksRestoreRouteVariants();
    });

    it('should show password field', () => {
      cy.get('[data-testid="workerSignIn-passwordField"]').should('be.visible');
    });

    it('should redirect to worker home once the credential is correct', () => {
      cy.get('[data-testid="workerSignIn-passwordField"]')
        .find('input')
        .clear();
      cy.get('[data-testid="workerSignIn-passwordField"]')
        .type('Aypglobalpay22')
        .find('input')
        .should('have.value', 'Aypglobalpay22');
      cy.login(WORKER);
      cy.get('[data-testid="workerSignIn-submitButton"]').click();

      cy.url().should('include', redirectPath);
    });
  });

  describe('when worker is not allowed to login', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/auth/check-email:200-is-not-allowed-to-login'
      );

      cy.visit('/worker');
      cy.get('[data-testid="workerSignIn-emailField"]')
        .type('worker@ayp-group.com')
        .find('input')
        .should('have.value', 'worker@ayp-group.com');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should have correct page url', () => {
      cy.url().should('include', '/worker/sign-in');
    });

    it('should show toast error message', () => {
      cy.get('[data-testid="workerSignIn-toast"]').should('be.visible');
      cy.get('[data-testid="workerSignIn-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when worker verify the email, but the link is expired', () => {
    testEachViewport('', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant(
          'people/v1/auth/verify:400-verification-link-expired'
        );

        cy.visit('/worker/sign-in?code=abc');
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should have correct page url', () => {
        cy.url().should('include', '/worker/sign-in');
      });

      it('should display correct page', () => {
        cy.get('[data-testid="workerSignIn-tokenExpiredTitle"]').should(
          'be.visible'
        );
        cy.get('[data-testid="workerSignIn-tokenExpiredDescription"]').should(
          'be.visible'
        );
        cy.get(
          '[data-testid="workerSignIn-tokenExpiredDescriptionTwo"]'
        ).should('be.visible');
        cy.get('[data-testid="workerSignIn-tokenExpiredLoginButton"]').should(
          'be.visible'
        );
      });

      it('should redirect to check email form', () => {
        cy.get('[data-testid="workerSignIn-tokenExpiredLoginButton"]').click();

        cy.url().should('include', '/worker/sign-in');
        cy.get('[data-testid="workerSignIn-emailField"]').should('be.visible');
      });
    });
  });

  describe('when worker verify the email, but the link is invalid', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/auth/verify:400-verification-link-invalid'
      );

      cy.visit('/worker/sign-in?code=abc');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should have correct page url', () => {
      cy.url().should('include', '/worker/sign-in');
    });

    it('should redirect to check email form', () => {
      cy.get('[data-testid="workerSignIn-emailField"]').should('be.visible');
    });
  });

  describe('when worker verify the email successfully, but has not set password', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/auth/verify:200-has-not-set-password');
      cy.mocksUseRouteVariant('people/v1/auth/set-password:200-success');

      cy.visit('/worker/sign-in?code=abc');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should have correct page url', () => {
      cy.url().should('include', '/worker/sign-in');
    });

    it('should show password field', () => {
      cy.get('[data-testid="workerSignIn-setPasswordField"]').should(
        'be.visible'
      );
    });

    it('should show toast success message', () => {
      cy.get('[data-testid="workerSignIn-toast"]').should('be.visible');
      cy.get('[data-testid="workerSignIn-toast-successAlert"]').should(
        'be.visible'
      );
    });

    it("should successfully set the user's password", () => {
      cy.get('[data-testid="workerSignIn-setPasswordField"]')
        .type('Aypglobalpay22')
        .find('input')
        .should('have.value', 'Aypglobalpay22');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();

      cy.get('[data-testid="workerSignIn-toast"]').should('be.visible');
      cy.get('[data-testid="workerSignIn-toast-successAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when worker verify the email successfully and has set password', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/auth/verify:200-has-set-password');

      cy.visit('/worker/sign-in?code=abc');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should have correct page url', () => {
      cy.url().should('include', '/worker/sign-in');
    });

    it('should show password field', () => {
      cy.get('[data-testid="workerSignIn-passwordField"]').should('be.visible');
    });

    it('should show toast success message', () => {
      cy.get('[data-testid="workerSignIn-toast"]').should('be.visible');
      cy.get('[data-testid="workerSignIn-toast-successAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when check email api not responding', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/auth/check-email:500-unknown-error');

      cy.visit('/worker');
      cy.get('[data-testid="workerSignIn-emailField"]')
        .type('worker@ayp-group.com')
        .find('input')
        .should('have.value', 'worker@ayp-group.com');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should have correct page url', () => {
      cy.url().should('include', '/worker/sign-in');
    });

    it('should still show email field', () => {
      cy.get('[data-testid="workerSignIn-emailField"]')
        .find('input')
        .should('have.value', 'worker@ayp-group.com');
    });
  });

  describe('when check email api not responding', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/auth/check-email:500-unknown-error');

      cy.visit('/worker');
      cy.get('[data-testid="workerSignIn-emailField"]')
        .type('worker@ayp-group.com')
        .find('input')
        .should('have.value', 'worker@ayp-group.com');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should have correct page url', () => {
      cy.url().should('include', '/worker/sign-in');
    });

    it('should still show email field', () => {
      cy.get('[data-testid="workerSignIn-emailField"]')
        .find('input')
        .should('have.value', 'worker@ayp-group.com');
    });
  });

  describe('when set password api not responding', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/auth/check-email:200-has-not-set-password'
      );
      cy.mocksUseRouteVariant('people/v1/auth/set-password:500-unknown-error');

      cy.visit('/worker');
      cy.get('[data-testid="workerSignIn-emailField"]')
        .type('worker@ayp-group.com')
        .find('input')
        .should('have.value', 'worker@ayp-group.com');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should have correct page url', () => {
      cy.url().should('include', '/worker/sign-in');
    });

    it('should show password field', () => {
      cy.get('[data-testid="workerSignIn-setPasswordField"]').should(
        'be.visible'
      );
    });

    it('should still show set password field', () => {
      cy.get('[data-testid="workerSignIn-setPasswordField"]')
        .type('Aypglobalpay22')
        .find('input')
        .should('have.value', 'Aypglobalpay22');
      cy.get('[data-testid="workerSignIn-submitButton"]').click();

      cy.get('[data-testid="workerSignIn-setPasswordField"]')
        .find('input')
        .should('have.value', 'Aypglobalpay22');
    });
  });
});
