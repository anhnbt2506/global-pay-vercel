const inputCorrectFieldButPasswordField = () => {
  cy.get('[data-testid="companySignUp-firstNameField"]')
    .type('Tommy')
    .find('input')
    .should('have.value', 'Tommy');
  cy.get('[data-testid="companySignUp-lastNameField"]')
    .type('Nguyen')
    .find('input')
    .should('have.value', 'Nguyen');

  cy.get('[data-testid="companySignUp-companyNameField"]')
    .type('AYP-GROUP')
    .find('input')
    .should('have.value', 'AYP-GROUP');
  cy.get('[data-testid="companySignUp-countryField"]').type('singapore');
  cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();

  cy.get('[data-testid="companySignUp-jobTitleField"]')
    .type('Developer')
    .find('input')
    .should('have.value', 'Developer');
  cy.get('[data-testid="companySignUp-emailField"]')
    .type('tommy.nguyen@ayp-group.com')
    .find('input')
    .should('have.value', 'tommy.nguyen@ayp-group.com');

  cy.get('[data-testid="companySignUp-interestField"]').click();
  cy.get(
    `[data-testid="companySignUp-interestField-optionId-PARTNERSHIP"]`
  ).click();
};

describe('company/sign-up', () => {
  describe('when accessing /company/sign-up', () => {
    before(() => {
      cy.clearCookies();

      cy.visit('/company/sign-up');
    });

    it('should redirects to the company sign-up page', () => {
      cy.url().should('include', '/company/sign-up');
    });

    it('should contain correct page metadata', () => {
      cy.get('[data-testid="companySignUp-title"]').should('be.visible');
      cy.get('[data-testid="companySignUp-description"]').should('be.visible');
      cy.get('[data-testid="companySignUp-sidebar-title"]').should(
        'be.visible'
      );
    });
  });

  describe(
    'when accessing /company/sign-up on mobile',
    { viewportWidth: 400, viewportHeight: 800 },
    () => {
      before(() => {
        cy.clearCookies();

        cy.visit('/company/sign-up');
      });

      it('should redirects to the company sign-up page', () => {
        cy.url().should('include', '/company/sign-up');
      });

      it('should contain correct page metadata', () => {
        cy.get('[data-testid="companySignUp-title"]').should('be.visible');
        cy.get('[data-testid="companySignUp-sidebar-title"]').should(
          'not.be.visible'
        );
      });
    }
  );

  describe('when input data and click submit button', () => {
    before(() => {
      cy.clearCookies();

      cy.visit('/company/sign-up');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display errors message when input nothing', () => {
      cy.get('[data-testid="companySignUp-submitButton"]').click();

      cy.get('[data-testid="companySignUp-firstNameField-error"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companySignUp-lastNameField-error"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companySignUp-companyNameField-error"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companySignUp-countryField-error"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companySignUp-jobTitleField-error"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companySignUp-emailField-error"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companySignUp-passwordField-error"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companySignUp-interestField-error"]').should(
        'be.visible'
      );
    });

    describe('when input with difference password field', () => {
      describe('when password meet requirements', () => {
        before(() => {
          cy.clearCookies();
          cy.visit('/company/sign-up');
          cy.mocksUseRouteVariant('people/v1/auth/register:200-success');

          inputCorrectFieldButPasswordField();
        });
        after(() => {
          cy.mocksRestoreRouteVariants();
        });

        it(
          'should sign up successfully and will show the email verify page ',
          {
            viewportHeight: 800,
            viewportWidth: 400,
          },
          () => {
            cy.get('[data-testid="companySignUp-passwordField"]')
              .type('password@123A')
              .find('input')
              .should('have.value', 'password@123A');

            cy.get('[data-testid="companySignUp-submitButton"]').click();

            cy.get(
              '[data-testid="companySignUp-emailVerificationTitle"]'
            ).should('be.visible');
            cy.get(
              '[data-testid="companySignUp-emailVerificationDescription"]'
            ).should('be.visible');
          }
        );
      });

      describe(' when password does not meet requirements', () => {
        before(() => {
          cy.clearCookies();
          cy.visit('/company/sign-up');
          cy.mocksUseRouteVariant('people/v1/auth/register:200-success');

          inputCorrectFieldButPasswordField();
        });
        after(() => {
          cy.mocksRestoreRouteVariants();
        });

        it('should show error', () => {
          cy.get('[data-testid="companySignUp-passwordField"]')
            .type('Ac2')
            .find('input')
            .should('have.value', 'Ac2');

          cy.get('[data-testid="companySignUp-submitButton"]').click();

          cy.get('[data-testid="companySignUp-passwordField-error"]').should(
            'be.visible'
          );
        });
      });
    });

    describe('when input email already exist', () => {
      before(() => {
        cy.clearCookies();
        cy.visit('/company/sign-up');
        cy.mocksUseRouteVariant(
          'people/v1/auth/register:400-email-already-exist'
        );

        inputCorrectFieldButPasswordField();
        cy.get('[data-testid="companySignUp-passwordField"]')
          .type('password@123A')
          .find('input')
          .should('have.value', 'password@123A');

        cy.get('[data-testid="companySignUp-submitButton"]').click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should should toast error message and still in company/sign-up page', () => {
        cy.get('[data-testid="companySignUp-toast-errorAlert"]').should(
          'be.visible'
        );
        cy.url().should('include', '/company/sign-up');
      });
    });

    describe('when API return internal server error', () => {
      before(() => {
        cy.clearCookies();
        cy.visit('/company/sign-up');
        cy.mocksUseRouteVariant(
          'people/v1/auth/register:500-internal-server-error'
        );

        inputCorrectFieldButPasswordField();
        cy.get('[data-testid="companySignUp-passwordField"]')
          .type('password@123A')
          .find('input')
          .should('have.value', 'password@123A');

        cy.get('[data-testid="companySignUp-submitButton"]').click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should should toast error message and still in company/sign-up page', () => {
        cy.get('[data-testid="companySignUp-toast-errorAlert"]').should(
          'be.visible'
        );
        cy.url().should('include', '/company/sign-up');
      });
    });

    describe('when API return unknown error', () => {
      before(() => {
        cy.clearCookies();
        cy.visit('/company/sign-up');
        cy.mocksUseRouteVariant('people/v1/auth/register:500-unknown-error');

        inputCorrectFieldButPasswordField();
        cy.get('[data-testid="companySignUp-passwordField"]')
          .type('password@123A')
          .find('input')
          .should('have.value', 'password@123A');

        cy.get('[data-testid="companySignUp-submitButton"]').click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should should toast error message and still in company/sign-up page', () => {
        cy.get('[data-testid="companySignUp-toast-errorAlert"]').should(
          'be.visible'
        );
        cy.url().should('include', '/company/sign-up');
      });

      it('should should close error message and still in company/sign-up page', () => {
        cy.get('[data-testid="companySignUp-title"]').click();
        cy.url().should('include', '/company/sign-up');
      });
    });
  });
});
