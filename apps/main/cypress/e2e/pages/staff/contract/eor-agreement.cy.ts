import { STAFF_ADMIN } from '@fixtures/users';

describe('staff/contracts/eor-agreement', () => {
  describe('when accessing /staff/contracts/eor-agreement', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/contracts/eor-agreement');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the staff contracts EOR agreement page', () => {
      cy.url().should('include', '/staff/contracts/eor-agreement');
      cy.get(
        '[data-testid="staffContractsEorAgreement-selectionButton"]'
      ).should('be.visible');
      cy.get('[data-testid="staffContractsEorAgreement-submitButton"]').should(
        'be.visible'
      );
    });
  });

  describe('when open selection modal then load countries list', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/country/get-countries:200-success');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open modal and show list countries', () => {
      cy.get(
        '[data-testid="staffContractsEorAgreement-selectionButton"]'
      ).click();
      cy.typeAutocompleteClickOptionIndex(
        'staffContractsEorAgreement-sectionNameSelectField',
        'Hong Kong',
        0
      );
      cy.get(
        '[data-testid="staffContractsEorAgreement-sectionNameSelectField"]'
      )
        .find('input')
        .should('have.value', 'Hong Kong');
    });

    it('should close modal', () => {
      cy.get(
        '[data-testid="staffContractsEorAgreement-selectCountry-closeButton"]'
      ).click();
      cy.get(
        '[data-testid="staffContractsEorAgreement-selectionButton"]'
      ).should('be.visible');
      cy.get('[data-testid="staffContractsEorAgreement-submitButton"]').should(
        'be.visible'
      );
    });
  });

  describe('when load and submit successfully EOR agreement based on countries ', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/country/get-countries:200-success');
      cy.mocksUseRouteVariant('people/v1/agreement-template/get:200-success');
      cy.mocksUseRouteVariant('people/v1/agreement-template/patch:200-success');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should get successfully contracts EOR agreements', () => {
      cy.get(
        '[data-testid="staffContractsEorAgreement-selectionButton"]'
      ).click();
      cy.typeAutocompleteClickOptionIndex(
        'staffContractsEorAgreement-sectionNameSelectField',
        'Hong Kong',
        0
      );
      cy.get(
        '[data-testid="staffContractsEorAgreement-selectCountry-submitButton"]'
      ).click();

      const mockData = {
        content: '{{companyId}}',
      };
      cy.wait(3_000);
      cy.typeTextEditor('content', `${mockData.content}`, true);
    });

    it('should submit successfully new contracts EOR agreements', () => {
      cy.wait(3_000);
      cy.typeTextEditor('content', 'testing');
      cy.get('[data-testid="staffContractsEorAgreement-submitButton"]').click();
      cy.get('[data-testid="staffContractsEorAgreement-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffContractsEorAgreement-toast-successAlert"]'
      ).should('be.visible');
    });

    it('should close  toast', () => {
      cy.get(
        '[data-testid="staffContractsEorAgreement-toast-successAlert"]'
      ).clickOutside();
      cy.get(
        '[data-testid="staffContractsEorAgreement-toast-successAlert"]'
      ).should('not.exist');
    });
  });

  describe('when failed to load EOR agreement template - 400 error', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/country/get-countries:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/agreement-template/get:400-unknown-error'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should failed when load error agreement template content', () => {
      cy.get(
        '[data-testid="staffContractsEorAgreement-selectionButton"]'
      ).click();

      cy.typeAutocompleteClickOptionIndex(
        'staffContractsEorAgreement-sectionNameSelectField',
        'Hong Kong',
        0
      );
      cy.get(
        '[data-testid="staffContractsEorAgreement-selectCountry-submitButton"]'
      ).click();

      cy.wait(3_000);
      cy.typeTextEditor('content', '', true);
    });
  });
  describe('when submitting new EOR agreement template returns error ', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/country/get-countries:200-success');
      cy.mocksUseRouteVariant('people/v1/agreement-template/get:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/agreement-template/patch:500-internal-server-error'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should get successfully contracts EOR agreements', () => {
      cy.get(
        '[data-testid="staffContractsEorAgreement-selectionButton"]'
      ).click();
      cy.typeAutocompleteClickOptionIndex(
        'staffContractsEorAgreement-sectionNameSelectField',
        'Hong Kong',
        0
      );
      cy.get(
        '[data-testid="staffContractsEorAgreement-selectCountry-submitButton"]'
      ).click();

      const mockData = {
        content: '{{companyId}}',
      };
      cy.wait(3_000);
      cy.typeTextEditor('content', `${mockData.content}`, true);
    });

    it('should show toast error message when submit new contracts EOR agreements', () => {
      cy.wait(3_000);
      cy.typeTextEditor('content', 'testing');
      cy.get('[data-testid="staffContractsEorAgreement-submitButton"]').click();
      cy.get('[data-testid="staffContractsEorAgreement-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffContractsEorAgreement-toast-errorAlert"]'
      ).should('be.visible');
    });
  });
});
