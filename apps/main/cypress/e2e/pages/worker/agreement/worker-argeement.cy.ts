import { WORKER } from '@fixtures/users';

const mockedId = '123';

describe('worker/agreement', () => {
  describe('when accessing /worker/agreement/:id', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/worker-user/get-employment-companies:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/worker/agreement:200-success');
      cy.login(WORKER);
      cy.visit(`/worker/agreement/${mockedId}`);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
      cy.logout({ callbackUrl: '/worker/sign-up' });
    });

    it('should redirects to the agreement download page', () => {
      cy.url().should('include', `/worker/agreement/${mockedId}`);
    });

    it('should stubs print', () => {
      cy.window().then((win) => {
        cy.stub(win, 'print');
      });
    });
  });

  describe('when accessing /worker/agreement/:id - 403 error', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/worker/agreement:403-forbidden-error');
      cy.mocksUseRouteVariant('people/v1/worker-user/get-home:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/worker-user/get-employment-companies:200-success'
      );

      cy.login(WORKER);
      cy.visit(`/worker/agreement/${mockedId}`);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show error message - 403 error', () => {
      cy.url().should('include', '/worker/home');
    });
  });

  describe('when accessing /worker/agreement/:id - 404 error', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/worker/agreement:404-not-found-error');
      cy.mocksUseRouteVariant('people/v1/worker-user/get-home:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/worker-user/get-employment-companies:200-success'
      );

      cy.login(WORKER);
      cy.visit(`/worker/agreement/${mockedId}`);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show error message - 404 error', () => {
      cy.url().should('include', '/worker/home');
    });
  });
});
