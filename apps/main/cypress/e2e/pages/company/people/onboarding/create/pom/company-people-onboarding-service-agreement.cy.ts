import { visitCompanyPeopleOnboardingPageAndSelectPOM } from './config';

describe('company/people/onboarding/create', () => {
  describe('when open service agreement for POM and reply comment then submit agreement', () => {
    before(() => {
      cy.signInCompanyAndMockPeopleOnboardingCollection(false);
      cy.mocksUseRouteVariant(
        'people/v1/service-agreement/pom/get-by-hire-type:200-success-pom-in-review'
      );
    });

    after(() => {
      cy.mocksRestoreBaseCollection();
    });

    describe('when open service agreement for POM', () => {
      before(() => {
        cy.mocksUseRouteVariant('people/v1/conversation/get-by-id:200-success');
        visitCompanyPeopleOnboardingPageAndSelectPOM();
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

    describe('when submit service agreement for POM', () => {
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
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-title"]'
        ).should('be.visible');
      });
    });
  });

  describe('when open service agreement for POM and create conversation', () => {
    before(() => {
      cy.signInCompanyAndMockPeopleOnboardingCollection(false);
      cy.mocksUseRouteVariant(
        'people/v1/service-agreement/pom/get-by-hire-type:200-success-pom-in-review'
      );
    });

    after(() => {
      cy.mocksRestoreBaseCollection();
    });

    describe('when create comment on conversation box', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/conversation/get-by-id:200-success-no-conversation'
        );
        cy.mocksUseRouteVariant(
          'people/v1/conversation/comment/create:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/service-agreement/update:200-success'
        );
        visitCompanyPeopleOnboardingPageAndSelectPOM();

        cy.get('[data-testid="conversation-box-field-content"]').type(
          'should include address'
        );
        cy.get('[data-testid="conversation-box-button-comment"]').click();
      });

      it('should not display the comments box', () => {
        cy.get('[data-testid="conversation-box-comments"]').should('not.exist');
      });
    });
  });

  describe('when open service agreement for POM and submit fail', () => {
    before(() => {
      cy.signInCompanyAndMockPeopleOnboardingCollection(false);
      cy.mocksUseRouteVariant(
        'people/v1/service-agreement/pom/get-by-hire-type:200-success-pom-in-review'
      );
    });

    after(() => {
      cy.mocksRestoreBaseCollection();
    });

    describe('when submit service agreement for POM fail - 500 internal server error', () => {
      before(() => {
        cy.mocksUseRouteVariant('people/v1/conversation/get-by-id:200-success');
        cy.mocksUseRouteVariant(
          'people/v1/service-agreement/sign-agreement:500-internal-server-error'
        );
        visitCompanyPeopleOnboardingPageAndSelectPOM();

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-employment-services-agreement-field-isSigned"]'
        ).click();
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-employment-services-agreement-button-acknowledge"]'
        )
          .should('be.visible')
          .click();
      });

      it('should display error toast message 500 internal server error', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-employmentServices-toast-errorAlert"]'
        )
          .should('be.visible')
          .clickOutside();
      });
    });

    describe('when submit service agreement for POM fail - 500 unknown error', () => {
      before(() => {
        cy.mocksUseRouteVariant('people/v1/conversation/get-by-id:200-success');
        cy.mocksUseRouteVariant(
          'people/v1/service-agreement/sign-agreement:500-unknown-error'
        );
        visitCompanyPeopleOnboardingPageAndSelectPOM();

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-employment-services-agreement-field-isSigned"]'
        ).click();
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-employment-services-agreement-button-acknowledge"]'
        )
          .should('be.visible')
          .click();
      });

      it('should display error toast message 500 internal server error', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-employmentServices-toast-errorAlert"]'
        )
          .should('be.visible')
          .clickOutside();
      });
    });
  });

  describe('when open service agreement for POM and review later', () => {
    before(() => {
      cy.signInCompanyAndMockPeopleOnboardingCollection(false);
      cy.mocksUseRouteVariant(
        'people/v1/service-agreement/pom/get-by-hire-type:200-success-pom-in-review'
      );
      cy.mocksUseRouteVariant('people/v1/conversation/get-by-id:200-success');

      visitCompanyPeopleOnboardingPageAndSelectPOM();
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
