import { visitCompanyPeopleOnboardingPageAndSelectPEO } from './config';

describe('company/people/onboarding/create', () => {
  describe('when open service agreement for PEO/EOR and reply comment then submit agreement', () => {
    before(() => {
      cy.signInCompanyAndMockPeopleOnboardingCollection(false);
      cy.mocksUseRouteVariant(
        'people/v1/service-agreement/peo/get-by-hire-type:200-success-peo-in-review'
      );
    });

    after(() => {
      cy.mocksRestoreBaseCollection();
    });

    describe('when open service agreement for PEO/EOR', () => {
      before(() => {
        cy.mocksUseRouteVariant('people/v1/conversation/get-by-id:200-success');
        visitCompanyPeopleOnboardingPageAndSelectPEO();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show service agreement model', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-employment-services-agreement-field-isSigned"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-employment-services-agreement-button-review-later"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-employment-services-agreement-button-acknowledge"]'
        ).should('be.visible');
      });
    });

    describe('when reply comment on conversation box', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/conversation/comment/reply:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/service-agreement/update:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/conversation/get-by-id:200-success-replying-comment'
        );

        cy.get('[data-testid="conversation-box-field-content"]').type(
          'should include address'
        );
        cy.get('[data-testid="conversation-box-button-comment"]').click();
      });

      it('should display the comment just commented', () => {
        cy.get('[data-testid="conversation-box-comments"]').should(
          'be.visible'
        );
      });
    });

    describe('when submit service agreement for PEO/EOR', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/service-agreement/sign-agreement:200-success'
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-employment-services-agreement-field-isSigned"]'
        ).click();
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-employment-services-agreement-button-acknowledge"]'
        )
          .should('be.visible')
          .click();
      });

      it('should display correct title', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-title"]'
        ).should('be.visible');
      });
    });
  });

  describe('when open service agreement for PEO/EOR and review later', () => {
    before(() => {
      cy.signInCompanyAndMockPeopleOnboardingCollection(false);
      cy.mocksUseRouteVariant(
        'people/v1/service-agreement/peo/get-by-hire-type:200-success-peo-in-review'
      );
      cy.mocksUseRouteVariant('people/v1/conversation/get-by-id:200-success');

      visitCompanyPeopleOnboardingPageAndSelectPEO();
    });

    after(() => {
      cy.mocksRestoreBaseCollection();
    });

    it('should close service agreement model after click review later', () => {
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-employment-services-agreement-button-review-later"]'
      )
        .should('be.visible')
        .click();

      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-employment-services-agreement-field-isSigned"]'
      ).should('not.exist');
    });
  });
});
