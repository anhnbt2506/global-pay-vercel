import { STAFF_ADMIN } from '@fixtures/users';

describe('staff/sign-in', () => {
  describe('when accessing /staff', () => {
    before(() => {
      cy.clearCookies();

      cy.visit('/staff');
    });

    it('should redirects to the staff sign-in page', () => {
      cy.url().should('include', '/staff/sign-in');
    });

    it('should contain correct page metadata', () => {
      cy.get('[data-testid="staffSignIn-title"]').should('be.visible');
      cy.get('[data-testid="staffSignIn-description"]').should('be.visible');
      cy.get('[data-testid="staffSignIn-sidebar-title"]').should('be.visible');
      cy.get('[data-testid="staffSignIn-sidebar-subtitle"]').should(
        'be.visible'
      );
    });
  });

  describe(
    'when accessing /staff on mobile',
    { viewportWidth: 400, viewportHeight: 800 },
    () => {
      before(() => {
        cy.clearCookies();

        cy.visit('/staff');
      });

      it('should redirects to the staff sign-in page', () => {
        cy.url().should('include', '/staff/sign-in');
      });

      it('should contain correct page metadata', () => {
        cy.get('[data-testid="staffSignIn-title"]').should('be.visible');
        cy.get('[data-testid="staffSignIn-description"]').should('be.visible');
        cy.get('[data-testid="staffSignIn-sidebar-title"]').should(
          'not.be.visible'
        );
        cy.get('[data-testid="staffSignIn-sidebar-subtitle"]').should(
          'not.be.visible'
        );
      });
    }
  );

  describe('when credentials are correct', () => {
    before(() => {
      cy.clearCookies();

      cy.visit('/staff');

      cy.get('[data-testid="staffSignIn-emailField"]')
        .type('alpha@example.com')
        .find('input')
        .should('have.value', 'alpha@example.com');
      cy.get('[data-testid="staffSignIn-passwordField"]')
        .type('password')
        .find('input')
        .should('have.value', 'password');
      cy.login(STAFF_ADMIN);
      cy.get('[data-testid="staffSignIn-submitButton"]').click();
    });

    after(() => {
      cy.logout({ callbackUrl: '/staff/sign-in' });
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the staff home', () => {
      cy.url().should('include', '/staff/home');
    });
  });

  describe('when support path redirect after user sign in', () => {
    const redirectPath = '/staff/audit/client-list';

    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/company/list:200-success');

      cy.visit(redirectPath);

      cy.get('[data-testid="staffSignIn-emailField"]')
        .type('alpha@example.com')
        .find('input')
        .should('have.value', 'alpha@example.com');
      cy.get('[data-testid="staffSignIn-passwordField"]')
        .type('password')
        .find('input')
        .should('have.value', 'password');
      cy.login(STAFF_ADMIN);
      cy.get('[data-testid="staffSignIn-submitButton"]').click();
    });

    after(() => {
      cy.logout({ callbackUrl: '/staff/sign-in' });
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the staff home', () => {
      cy.url().should('include', redirectPath);
    });
  });

  describe('when the email is in wrong format', () => {
    before(() => {
      cy.clearCookies();

      cy.visit('/staff');

      cy.get('[data-testid="staffSignIn-emailField"]')
        .type('alpha')
        .find('input')
        .should('have.value', 'alpha');
      cy.get('[data-testid="staffSignIn-passwordField"]')
        .type('password')
        .find('input')
        .should('have.value', 'password');
      cy.get('[data-testid="staffSignIn-submitButton"]').click();
    });

    it('should display an error message', () => {
      cy.get('[data-testid="staffSignIn-emailField-error"]').should(
        'be.visible'
      );
    });
  });

  describe('when the password is empty', () => {
    before(() => {
      cy.clearCookies();

      cy.visit('/staff');

      cy.get('[data-testid="staffSignIn-emailField"]')
        .type('alpha@example.com')
        .find('input')
        .should('have.value', 'alpha@example.com');
      cy.get('[data-testid="staffSignIn-passwordField"]').should(
        'have.value',
        ''
      );
      cy.get('[data-testid="staffSignIn-submitButton"]').click();
    });

    it('should display an error message', () => {
      cy.get('[data-testid="staffSignIn-passwordField-error"]').should(
        'be.visible'
      );
    });
  });

  describe('when the email and/or password combination is not correct', () => {
    before(() => {
      cy.clearCookies();

      cy.visit('/staff');

      cy.get('[data-testid="staffSignIn-emailField"]')
        .type('alpha@example.com')
        .find('input')
        .should('have.value', 'alpha@example.com');
      cy.get('[data-testid="staffSignIn-passwordField"]')
        .type('password')
        .find('input')
        .should('have.value', 'password');
      cy.get('[data-testid="staffSignIn-submitButton"]').click();
    });

    it('should display an error message', () => {
      cy.get('[data-testid="staffSignIn-passwordField-error"]').should(
        'be.visible'
      );
    });
  });
});
