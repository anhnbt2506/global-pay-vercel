import { visitCompanyPeopleOnboardingPageAndSelectPeoEor } from './config';

const inputCompanyPeoEorServiceDetailForm = () => {
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-companyPeoEor-serviceDetail-TH-fields-payrollCycle',
    'MONTHLY'
  );
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-companyPeoEor-serviceDetail-TH-fields-payrollDate',
    '25'
  );
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-companyPeoEor-serviceDetail-TH-fields-prorateSalaryFormula',
    'WORKING_DAYS'
  );
};

describe('company/people/onboarding/create company country TH', () => {
  after(() => {
    cy.mocksRestoreBaseCollection();
  });

  describe('When accessing company/people/onboarding/create and select PEO-EOR', () => {
    before(() => {
      cy.clearCookies();
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      visitCompanyPeopleOnboardingPageAndSelectPeoEor();
    });

    it('should redirects to the company /company/people/onboarding/create page', () => {
      cy.url().should('include', '/company/people/onboarding/create');
    });

    it('should contain correct page metadata', () => {
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-country"]'
      ).should('be.visible');
    });
  });

  describe('when already submit hire country PEO-EOR TH', () => {
    before(() => {
      cy.clearCookies();
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/check:200-success-has-submitted'
      );

      visitCompanyPeopleOnboardingPageAndSelectPeoEor();

      cy.typeAutocompleteClickOptionIndex(
        'companyPeopleOnboardingCreate-guidedMode-peo-field-country',
        'Thailand',
        0
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should does not show company PEO-EOR service detail form', () => {
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-companyPeoEor-serviceDetail-TH-fields-payrollCycle"]'
      ).should('not.exist');
    });
  });

  describe('When check submit hire country PEO-EOR TH failed - 500-internal-server-error', () => {
    before(() => {
      cy.clearCookies();
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/check:500-internal-server-error'
      );

      visitCompanyPeopleOnboardingPageAndSelectPeoEor();

      cy.typeAutocompleteClickOptionIndex(
        'companyPeopleOnboardingCreate-guidedMode-peo-field-country',
        'Thailand',
        0
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show error message', () => {
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-toast-errorAlert"]'
      )
        .should('be.visible')
        .clickOutside();
    });
  });

  describe('When check submit hire country PEO-EOR TH failed - 400-unknown-error', () => {
    before(() => {
      cy.clearCookies();
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/check:400-unknown-error'
      );

      visitCompanyPeopleOnboardingPageAndSelectPeoEor();

      cy.typeAutocompleteClickOptionIndex(
        'companyPeopleOnboardingCreate-guidedMode-peo-field-country',
        'Thailand',
        0
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show error message', () => {
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-toast-errorAlert"]'
      )
        .should('be.visible')
        .clickOutside();
    });
  });

  describe('When create new hire country PEO-EOR TH and close modal', () => {
    before(() => {
      cy.clearCookies();
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/check:200-success-has-not-submitted'
      );

      visitCompanyPeopleOnboardingPageAndSelectPeoEor();
      cy.typeAutocompleteClickOptionIndex(
        'companyPeopleOnboardingCreate-guidedMode-peo-field-country',
        'Thailand',
        0
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should close modal', () => {
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-companyPeoEor-serviceDetail-TH-button-close"]'
      ).click();

      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-country"]'
      ).should('be.visible');
    });
  });

  describe('When create new hire country PEO-EOR TH', () => {
    before(() => {
      cy.clearCookies();
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/check:200-success-has-not-submitted'
      );

      visitCompanyPeopleOnboardingPageAndSelectPeoEor();
      cy.typeAutocompleteClickOptionIndex(
        'companyPeopleOnboardingCreate-guidedMode-peo-field-country',
        'Thailand',
        0
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show correct TH country PEO-EOR form', () => {
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-companyPeoEor-serviceDetail-TH-fields-payrollCycle"]'
      ).should('be.visible');

      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-companyPeoEor-serviceDetail-TH-fields-payrollDate"]'
      ).should('be.visible');

      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-companyPeoEor-serviceDetail-TH-fields-prorateSalaryFormula"]'
      ).should('be.visible');
    });

    describe('When clicking submit button without filling data', () => {
      it('should show errors', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-companyPeoEor-serviceDetail-TH-button-submit"]'
        ).click();

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-companyPeoEor-serviceDetail-TH-fields-payrollCycle-error"]'
        )
          .scrollIntoView()
          .should('be.visible');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-companyPeoEor-serviceDetail-TH-fields-payrollDate-error"]'
        )
          .scrollIntoView()
          .should('be.visible');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-companyPeoEor-serviceDetail-TH-fields-prorateSalaryFormula-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
      });
    });

    describe('When create PEO-EOR TH', () => {
      before(() => {
        inputCompanyPeoEorServiceDetailForm();
      });

      it('should show error message - 500-internal-server-error', () => {
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/create-country-service:500-internal-server-error'
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-companyPeoEor-serviceDetail-TH-button-submit"]'
        ).click();

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-toast-errorAlert"]'
        )
          .should('be.visible')
          .clickOutside();
      });

      it('should show error message - 400-unknown-error', () => {
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/create-country-service:400-unknown-error'
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-companyPeoEor-serviceDetail-TH-button-submit"]'
        ).click();

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-toast-errorAlert"]'
        )
          .should('be.visible')
          .clickOutside();
      });

      it('Should show successfully message', () => {
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/create-country-service:200-success'
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-companyPeoEor-serviceDetail-TH-button-submit"]'
        ).click();

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-toast-successAlert"]'
        )
          .should('be.visible')
          .clickOutside();
      });
    });
  });
});
