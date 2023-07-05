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

  describe('when worker has invited, list bank is empty', () => {
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
        .type('+66');
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
        .type('thailand')
        .find('input')
        .should('have.value', 'thailand');
      cy.get('[data-testid="workerOnboarding-personalProfile-field-state"]')
        .type('thailand-ayp')
        .find('input')
        .should('have.value', 'thailand-ayp');
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
        '[data-testid="workerOnboarding-identification-field-workerIdentity.nationalId"]'
      )
        .type('TH')
        .find('input')
        .should('have.value', 'TH');
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
        .type('+66');
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

    const fillStep5 = () => {
      cy.get(
        '[data-testid="workerOnboarding-additionalInformation-field-additionalInfo.fatherAllowance"]'
      )
        .type('1000')
        .find('input')
        .should('have.value', '1,000');
      cy.get(
        '[data-testid="workerOnboarding-additionalInformation-field-additionalInfo.motherAllowance"]'
      )
        .type('1000')
        .find('input')
        .should('have.value', '1,000');
      cy.get(
        '[data-testid="workerOnboarding-additionalInformation-field-additionalInfo.spouseFatherAllowance"]'
      )
        .type('1000')
        .find('input')
        .should('have.value', '1,000');
      cy.get(
        '[data-testid="workerOnboarding-additionalInformation-field-additionalInfo.spouseMotherAllowance"]'
      )
        .type('1000')
        .find('input')
        .should('have.value', '1,000');
      cy.get(
        '[data-testid="workerOnboarding-additionalInformation-field-additionalInfo.insurancePremium"]'
      )
        .type('1234')
        .find('input')
        .should('have.value', '1,234');
      cy.get(
        '[data-testid="workerOnboarding-additionalInformation-field-additionalInfo.spouseInsurancePremium"]'
      )
        .type('1234')
        .find('input')
        .should('have.value', '1,234');
      cy.get(
        '[data-testid="workerOnboarding-additionalInformation-field-additionalInfo.fatherInsurancePremium"]'
      )
        .type('2234')
        .find('input')
        .should('have.value', '2,234');
      cy.get(
        '[data-testid="workerOnboarding-additionalInformation-field-additionalInfo.motherInsurancePremium"]'
      )
        .type('3333')
        .find('input')
        .should('have.value', '3,333');
      cy.get(
        '[data-testid="workerOnboarding-additionalInformation-field-additionalInfo.interestHousingLoan"]'
      )
        .type('232')
        .find('input')
        .should('have.value', '232');
      cy.get(
        '[data-testid="workerOnboarding-additionalInformation-field-additionalInfo.educationDonationAmount"]'
      )
        .type('111')
        .find('input')
        .should('have.value', '111');
      cy.get(
        '[data-testid="workerOnboarding-additionalInformation-field-additionalInfo.rmfAllowance"]'
      )
        .type('123')
        .find('input')
        .should('have.value', '123');
      cy.get(
        '[data-testid="workerOnboarding-additionalInformation-field-additionalInfo.ltfAllowance"]'
      )
        .type('999')
        .find('input')
        .should('have.value', '999');
      cy.get(
        '[data-testid="workerOnboarding-additionalInformation-field-additionalInfo.hospitalForUnemploymentInsurance"]'
      )
        .type('VINMEC')
        .find('input')
        .should('have.value', 'VINMEC');
      cy.get(
        '[data-testid="workerOnboarding-additionalInformation-field-additionalInfo.nationalIdFile"]'
      ).attachFile('test.pdf');
      cy.get(
        '[data-testid="workerOnboarding-additionalInformation-field-additionalInfo.houseRegistrationFile"]'
      ).attachFile('test.pdf');

      cy.wait(3_000);

      cy.get('[data-testid="workerOnboarding-nextButton"]').click();
    };

    before(() => {
      cy.clearCookies();
      cy.mocksSetCollection('base-worker-onboarding');
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-by-employment-id:200-employee-invited-status-th'
      );
      cy.mocksUseRouteVariant('people/v1/get-banks:200-success-empty');
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
      fillStep5();
    });
  });

  describe('when worker inreview', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksSetCollection('base-worker-inreview');
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-by-employment-id:200-employee-review-status-th'
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
