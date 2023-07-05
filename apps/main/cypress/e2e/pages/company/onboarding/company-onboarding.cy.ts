import { COMPANY_OWNER } from '@fixtures/users';

describe('company/onboarding', () => {
  const signInCompany = () => {
    cy.clearCookies();
    cy.mocksUseRouteVariant('people/v1/auth/check-email:200-has-set-password');

    cy.visit('/company/sign-in');
    cy.get('[data-testid="companySignIn-emailField"]')
      .type('alpha@example.com')
      .find('input')
      .should('have.value', 'alpha@example.com');

    cy.get('[data-testid="companySignIn-submitButton"]').click();

    cy.get('[data-testid="companySignIn-passwordField"]')
      .type('password')
      .find('input')
      .should('have.value', 'password');

    cy.login(COMPANY_OWNER);

    cy.get('[data-testid="companySignIn-submitButton"]').click();
  };

  describe('when company have onboarded', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');
      signInCompany();
    });

    after(() => {
      cy.logout({ callbackUrl: '/company/sign-in' });
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the company dashboard page', () => {
      cy.url().should('include', '/company/dashboard');
    });
  });

  describe('when company have NOT onboarded any step', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/tableau/request-token:400-redirect-onboarding-company-error'
      );
      cy.mocksUseRouteVariant(
        'people/v1/company/onboard:200-success-onboarding-step-information'
      );
      cy.mocksUseRouteVariant('people/v1/company/update:200-success');
      signInCompany();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirect to the company onboarding page', () => {
      cy.url().should('include', '/company/onboarding');
    });

    it('should contain correct page metadata', () => {
      cy.get('[data-testid="companyOnboarding-secondarySidebar-title"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="companyOnboarding-secondarySidebar-description"]'
      ).should('be.visible');

      cy.get('[data-testid="companyOnboarding-stepInformation-title"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="companyOnboarding-stepInformation-description"]'
      ).should('be.visible');

      // expect to see all steps in the SecondarySidebar
      cy.get('[data-testid="companyOnboarding-stepper-id-0"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companyOnboarding-stepper-id-1"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companyOnboarding-stepper-id-2"]').should(
        'be.visible'
      );
    });

    describe('when the company filling the onboarding form', () => {
      it('should complete onboarding', () => {
        // filling step 1 - Company Information
        cy.get('[data-testid="companyOnboarding-fields-addressLine"]')
          .type('line a')
          .find('input')
          .should('have.value', 'line a');
        cy.get('[data-testid="companyOnboarding-fields-city"]')
          .type('Acity')
          .find('input')
          .should('have.value', 'Acity');
        cy.get('[data-testid="companyOnboarding-fields-state"]')
          .type('abc')
          .find('input')
          .should('have.value', 'abc');
        cy.get('[data-testid="companyOnboarding-fields-postalCode"]')
          .type('123')
          .find('input')
          .should('have.value', '123');
        cy.get('[data-testid="companyOnboarding-nextButton"]').click();

        //try to go previous step and still see the value
        cy.get('[data-testid="companyOnboarding-previousButton"]').click();
        cy.get('[data-testid="companyOnboarding-fields-postalCode"]')
          .find('input')
          .should('have.value', '123');
        cy.get('[data-testid="companyOnboarding-nextButton"]').click();

        // filling step 2 - Company Invoicing
        cy.get('[data-testid="companyOnboarding-fields-registrationId"]')
          .type('111')
          .find('input')
          .should('have.value', '111');
        cy.get('[data-testid="companyOnboarding-fields-taxId"]')
          .type('987')
          .find('input')
          .should('have.value', '987');
        cy.get('[data-testid="companyOnboarding-fields-currency"]').type('USD');
        cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
        cy.get('[data-testid="companyOnboarding-fields-hasSgEntity"]').click();
        cy.get(
          `[data-testid=companyOnboarding-fields-hasSgEntity-optionId-1]`
        ).click();
        cy.get('[data-testid="companyOnboarding-fields-sgEntityUen"]')
          .type('Entity Uen')
          .find('input')
          .should('have.value', 'Entity Uen');
        cy.get('[data-testid="companyOnboarding-fields-sgEntityName"]')
          .type('name')
          .find('input')
          .should('have.value', 'name');
        cy.get('[data-testid="companyOnboarding-completeButton"]').click();

        // expect to see step 3 - In Review
        cy.get('[data-testid="companyOnboarding-inReview-title"]').should(
          'be.visible'
        );
        cy.get('[data-testid="companyOnboarding-inReview-description"]').should(
          'be.visible'
        );
      });

      it('should redirect to company sign in page when the logout button click', () => {
        cy.get(
          '[data-testid="companyOnboarding-secondaryAppLayout-topNavigation-iconButton-avatar"]'
        ).click();
        cy.get(
          '[data-testid="companyOnboarding-secondaryAppLayout-topNavigation-logout"]'
        )
          .last()
          .click();

        cy.url().should('include', '/company/sign-in');
      });
    });
  });

  describe('when company have NOT completed onboarding process and is at step Company Invoicing', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/tableau/request-token:400-redirect-onboarding-company-error'
      );
      cy.mocksUseRouteVariant(
        'people/v1/company/onboard:200-success-onboarding-step-invoicing'
      );
      signInCompany();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should contain correct page metadata', () => {
      cy.get('[data-testid="companyOnboarding-stepInvoicing-title"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="companyOnboarding-stepInvoicing-description"]'
      ).should('be.visible');
    });
  });

  describe('when company have completed onboarding form and waiting for reviewing', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/tableau/request-token:400-redirect-onboarding-company-error'
      );
      cy.mocksUseRouteVariant(
        'people/v1/company/onboard:200-success-onboarding-step-inreview'
      );
      signInCompany();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should contain correct page metadata', () => {
      cy.get('[data-testid="companyOnboarding-inReview-title"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companyOnboarding-inReview-description"]').should(
        'be.visible'
      );
    });

    it(
      'should contain correct page metadata in mobile',
      { viewportWidth: 400, viewportHeight: 800 },
      () => {
        cy.get('[data-testid="companyOnboarding-inReview-title"]').should(
          'be.visible'
        );
        cy.get('[data-testid="companyOnboarding-inReview-description"]').should(
          'be.visible'
        );
      }
    );
  });

  describe(
    'when accessing /company/onboarding on mobile',
    { viewportWidth: 400, viewportHeight: 800 },
    () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/tableau/request-token:400-redirect-onboarding-company-error'
        );
        cy.mocksUseRouteVariant(
          'people/v1/company/onboard:200-success-onboarding-step-information'
        );
        signInCompany();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should contain correct page metadata', () => {
        // expect not to see SecondaryAppLayout title and descritpion
        cy.get(
          '[data-testid="companyOnboarding-secondarySidebar-title"]'
        ).should('not.exist');
        cy.get(
          '[data-testid="companyOnboarding-secondarySidebar-description"]'
        ).should('not.exist');

        // expect see first step
        cy.get(
          '[data-testid="companyOnboarding-stepInformation-title"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyOnboarding-stepInformation-description"]'
        ).should('be.visible');
      });
    }
  );
});
