import { WORKER } from '@fixtures/users';

describe('worker/onboarding', () => {
  const signInWorker = () => {
    cy.visit('/worker/sign-in');
    cy.get('[data-testid="workerSignIn-emailField"]')
      .type('worker@ayp-group.com')
      .find('input')
      .should('have.value', 'worker@ayp-group.com');
    cy.get('[data-testid="workerSignIn-submitButton"]').click();
    cy.get('[data-testid="workerSignIn-passwordField"]')
      .type('Aypglobalpay22')
      .find('input')
      .should('have.value', 'Aypglobalpay22');
    cy.login(WORKER);
    cy.get('[data-testid="workerSignIn-submitButton"]').click();
  };

  after(() => {
    cy.mocksRestoreBaseCollection();
  });

  describe('when worker has invited', () => {
    const fillStep1 = () => {
      cy.get('[data-testid="workerOnboarding-personalProfile-field-firstName"]')
        .type('Thomas')
        .find('input')
        .should('have.value', 'Thomas');
      cy.get('[data-testid="workerOnboarding-personalProfile-field-lastName"]')
        .type('Shelby')
        .find('input')
        .should('have.value', 'Shelby');
      cy.chooseDatePicker(
        '[data-testid="workerOnboarding-personalProfile-field-dateOfBirth"]',
        '1'
      );
      cy.getSelectFieldClickOption(
        'workerOnboarding-personalProfile-field-gender',
        'MALE'
      );
      cy.getSelectFieldClickOption(
        'workerOnboarding-personalProfile-field-race',
        'CHINESE'
      );
      cy.getSelectFieldClickOption(
        'workerOnboarding-personalProfile-field-religion',
        'ATHEIST'
      );
      cy.getSelectFieldClickOption(
        'workerOnboarding-personalProfile-field-maritalStatus',
        'MARRIED'
      );
      cy.get(
        '[data-testid="workerOnboarding-personalProfile-field-dialingCode"]'
      )
        .click()
        .type('+60');
      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]')
        .should('be.visible')
        .click();
      cy.get(
        '[data-testid="workerOnboarding-personalProfile-field-contactNumber"]'
      )
        .type('85377884411')
        .find('input')
        .should('have.value', '85377884411');
      cy.get(
        '[data-testid="workerOnboarding-personalProfile-field-addressLine"]'
      )
        .type('example')
        .find('input')
        .should('have.value', 'example');
      cy.get('[data-testid="workerOnboarding-personalProfile-field-city"]')
        .type('Malaysia')
        .find('input')
        .should('have.value', 'Malaysia');
      cy.get('[data-testid="workerOnboarding-personalProfile-field-state"]')
        .type('Malaysia-ayp')
        .find('input')
        .should('have.value', 'Malaysia-ayp');
      cy.get(
        '[data-testid="workerOnboarding-personalProfile-field-postalCode"]'
      )
        .type('99111')
        .find('input')
        .should('have.value', '99111');

      cy.get('[data-testid="workerOnboarding-nextButton"]').click();
    };

    const fillStep2 = () => {
      cy.get(
        '[data-testid="workerOnboarding-identification-field-workerIdentity.passportNumber"]'
      )
        .type('MY')
        .find('input')
        .should('have.value', 'MY');
      cy.get(
        '[data-testid="workerOnboarding-identification-field-workerIdentity.taxId"]'
      )
        .type('abxiwpa21')
        .find('input')
        .should('have.value', 'abxiwpa21');

      cy.get('[data-testid="workerOnboarding-nextButton"]').click();
    };

    const fillStep3 = () => {
      cy.get(
        '[data-testid="workerOnboarding-emergencyContact-field-workerContact.emergencyContactName"]'
      )
        .type('Example')
        .find('input')
        .should('have.value', 'Example');
      cy.getSelectFieldClickOption(
        'workerOnboarding-emergencyContact-field-workerContact.emergencyContactRelationship',
        'FATHER'
      );
      cy.get(
        '[data-testid="workerOnboarding-emergencyContact-field-workerContact.emergencyContactNumberCountryCode"]'
      )
        .click()
        .type('+60');
      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]')
        .should('be.visible')
        .click();
      cy.get(
        '[data-testid="workerOnboarding-emergencyContact-field-workerContact.emergencyContactNumber"]'
      )
        .type('85377884411')
        .find('input')
        .should('have.value', '85377884411');

      cy.get('[data-testid="workerOnboarding-nextButton"]').click();
    };

    const fillStep4 = () => {
      cy.get(
        '[data-testid="workerOnboarding-bankDetails-field-workerUser.bankAccount.beneficiaryName"]'
      )
        .find('input')
        .clear()
        .type('Sample')
        .should('have.value', 'Sample');
      cy.get(
        '[data-testid="workerOnboarding-bankDetails-field-workerUser.bankAccount.accountNumber"]'
      )
        .clear()
        .type('123456')
        .find('input')
        .should('have.value', '123456');
      cy.typeAutocompleteClickOptionIndex(
        'workerOnboarding-bankDetails-field-workerUser.bankAccount.bank',
        'Bank 01',
        0
      );
      cy.get(
        '[data-testid="workerOnboarding-bankDetails-field-workerUser.bankAccount.branchCode"]'
      )
        .clear()
        .type('123456')
        .find('input')
        .should('have.value', '123456');

      cy.get('[data-testid="workerOnboarding-nextButton"]').click();
    };

    const fillStep5 = () => {
      cy.get(
        '[data-testid="workerOnboarding-additionalInformation-field-workerIdentity.passportFile"]'
      ).attachFile('test.pdf');

      cy.get(
        '[data-testid="workerOnboarding-additionalInformation-field-additionalInfo.epfId"]'
      )
        .type('epfId')
        .find('input')
        .should('have.value', 'epfId');

      cy.getSelectFieldClickOption(
        'workerOnboarding-additionalInformation-field-additionalInfo.isSpouseWorking',
        '1'
      );

      cy.get('[data-testid="workerOnboarding-nextButton"]').click();
    };

    const fillStep6 = () => {
      cy.get('[data-testid="workerOnboarding-inReviewForm"]').should(
        'be.visible'
      );
    };

    before(() => {
      cy.clearCookies();
      cy.mocksSetCollection('base-worker-onboarding');
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-by-employment-id:200-employee-invited-status-my'
      );
      cy.mocksUseRouteVariant('people/v1/get-banks:200-success');
      signInWorker();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirect them to worker/onboarding page after login', () => {
      cy.url().should('include', '/worker/onboarding');
      fillStep1();
      fillStep2();
      fillStep3();
      fillStep4();
      fillStep5();
      fillStep6();
    });
  });
  describe('when worker inreview', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksSetCollection('base-worker-inreview');
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-by-employment-id:200-employee-review-status-my'
      );
      signInWorker();
      cy.visit('/worker/home');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show in-review page', () => {
      cy.get('[data-testid="workerOnboarding-inReviewForm"]').should(
        'be.visible'
      );
    });
  });
});
