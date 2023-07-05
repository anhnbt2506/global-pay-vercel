import { STAFF_ADMIN } from '@fixtures/users';

describe('staff/contracts/service-agreement', () => {
  describe('when accessing /staff/contracts/service-agreement', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/contracts/service-agreement');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the staff contracts service agreement page', () => {
      cy.url().should('include', '/staff/contracts/service-agreement');
      cy.get(
        '[data-testid="staffContractsServiceAgreement-selectionButton"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffContractsServiceAgreement-submitButton"]'
      ).should('be.visible');
    });
  });

  describe('when open selection modal', () => {
    it('should open modal and show list service agreement', () => {
      cy.get(
        '[data-testid="staffContractsServiceAgreement-selectionButton"]'
      ).click();
      cy.typeAutocompleteClickOptionIndex(
        'staffContractsServiceAgreement-sectionNameSelectField',
        'PEO',
        0
      );
      cy.get(
        '[data-testid="staffContractsServiceAgreement-sectionNameSelectField"]'
      )
        .find('input')
        .should('have.value', 'PEO / EOR service agreement');
    });

    it('should close modal', () => {
      cy.get(
        '[data-testid="staffContractsServiceAgreement-selectServiceAgreement-closeButton"]'
      ).click();
      cy.get(
        '[data-testid="staffContractsServiceAgreement-selectionButton"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffContractsServiceAgreement-submitButton"]'
      ).should('be.visible');
    });
  });

  describe('when load and submit successfully service agreement', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/agreement-template/get:200-success');
      cy.mocksUseRouteVariant('people/v1/agreement-template/patch:200-success');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should get successfully contracts service agreements', () => {
      cy.get(
        '[data-testid="staffContractsServiceAgreement-selectionButton"]'
      ).click();
      cy.typeAutocompleteClickOptionIndex(
        'staffContractsServiceAgreement-sectionNameSelectField',
        'PEO',
        0
      );
      cy.get(
        '[data-testid="staffContractsServiceAgreement-selectServiceAgreement-submitButton"]'
      ).click();

      const mockData = {
        content: '{{companyId}}',
      };
      cy.wait(3_000);
      cy.typeTextEditor('content', `${mockData.content}`, true);
    });

    it('should submit successfully new contracts service agreements', () => {
      cy.wait(3_000);
      cy.typeTextEditor('content', 'testing');
      cy.get(
        '[data-testid="staffContractsServiceAgreement-submitButton"]'
      ).click();
      cy.get('[data-testid="staffContractsServiceAgreement-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffContractsServiceAgreement-toast-successAlert"]'
      ).should('be.visible');
    });

    it('should close  toast', () => {
      cy.get(
        '[data-testid="staffContractsServiceAgreement-toast-successAlert"]'
      ).clickOutside();
      cy.get(
        '[data-testid="staffContractsServiceAgreement-toast-successAlert"]'
      ).should('not.exist');
    });
  });

  describe('when failed to load service agreement template - 400 error', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/agreement-template/get:400-unknown-error'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should failed when load error agreement template content', () => {
      cy.get(
        '[data-testid="staffContractsServiceAgreement-selectionButton"]'
      ).click();

      cy.typeAutocompleteClickOptionIndex(
        'staffContractsServiceAgreement-sectionNameSelectField',
        'PEO',
        0
      );
      cy.get(
        '[data-testid="staffContractsServiceAgreement-selectServiceAgreement-submitButton"]'
      ).click();

      cy.wait(3_000);
      cy.typeTextEditor('content', '', true);
    });
  });

  describe('when submitting new service agreement template returns error ', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/agreement-template/get:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/agreement-template/patch:500-internal-server-error'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should get successfully contracts service agreements', () => {
      cy.get(
        '[data-testid="staffContractsServiceAgreement-selectionButton"]'
      ).click();
      cy.typeAutocompleteClickOptionIndex(
        'staffContractsServiceAgreement-sectionNameSelectField',
        'PEO',
        0
      );
      cy.get(
        '[data-testid="staffContractsServiceAgreement-selectServiceAgreement-submitButton"]'
      ).click();

      const mockData = {
        content: '{{companyId}}',
      };
      cy.wait(3_000);
      cy.typeTextEditor('content', `${mockData.content}`, true);
    });

    it('should show toast error message when submit new contracts Peo agreements', () => {
      cy.wait(3_000);
      cy.typeTextEditor('content', 'testing');
      cy.get(
        '[data-testid="staffContractsServiceAgreement-submitButton"]'
      ).click();
      cy.get('[data-testid="staffContractsServiceAgreement-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffContractsServiceAgreement-toast-errorAlert"]'
      ).should('be.visible');
    });
  });
});
