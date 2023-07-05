import { COMPANY_OWNER } from '@fixtures/users';

describe('company/dashboard', () => {
  describe('when accessing /company/agreement/:id', () => {
    const mockedId = '123';
    before(() => {
      cy.login(COMPANY_OWNER);
      cy.mocksUseRouteVariant('people/v1/company/agreement:200-success');
    });

    after(() => {
      cy.logout({ callbackUrl: '/company/sign-up' });
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the agreement download page', () => {
      cy.visit(`/company/agreement/${mockedId}`);
      cy.url().should('include', `/company/agreement/${mockedId}`);
    });

    it('stubs print', () => {
      cy.window().then((win) => {
        cy.stub(win, 'print');
      });
    });
  });

  describe('when accessing /company/agreement/:id - 403 error', () => {
    const mockedId = '123';
    before(() => {
      cy.login(COMPANY_OWNER);
      cy.mocksUseRouteVariant(
        'people/v1/company/agreement:403-forbidden-error'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show error message - 403 error', () => {
      cy.visit(`/company/agreement/${mockedId}`);
      cy.url().should('include', '/company/dashboard');
    });
  });

  describe('when accessing /company/agreement/:id - 404 error', () => {
    const mockedId = '123';
    before(() => {
      cy.login(COMPANY_OWNER);
      cy.mocksUseRouteVariant(
        'people/v1/company/agreement:404-not-found-error'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show error message - 404 error', () => {
      cy.visit(`/company/agreement/${mockedId}`);
      cy.url().should('include', '/company/dashboard');
    });
  });
});
