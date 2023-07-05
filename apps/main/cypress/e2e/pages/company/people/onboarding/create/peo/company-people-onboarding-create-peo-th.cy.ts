import { testEachViewport } from 'support/utils';
import { visitCompanyPeopleOnboardingPageAndSelectPEO } from './config';

const mockDataAndVisitCreatePeo = () => {
  cy.signInCompanyAndMockPeopleOnboardingCollection(true);

  cy.mocksUseRouteVariant(
    'people/v1/company/hire-type/check:200-success-has-submitted'
  );
  cy.mocksUseRouteVariant(
    'people/v1/worker-employment/check-employee-id:200-success'
  );
  cy.mocksUseRouteVariant('people/v1/department/selection:200-success');
  cy.mocksUseRouteVariant('people/v1/department/post:200-success');

  visitCompanyPeopleOnboardingPageAndSelectPEO();
};

const fillingStep0 = (
  enableLegalEntity?: boolean,
  changeSomeFields?: boolean
) => {
  // step 0 - Classify your hire
  if (enableLegalEntity) {
    // next button is disabled
    cy.typeAutocompleteClickOptionIndex(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-country',
      'Thailand',
      0
    );
    cy.getSelectFieldClickOption(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-isHaveLegalEntity',
      '1'
    );
    cy.getSelectFieldClickOption(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-isUseLegalEntity',
      '1'
    );
  } else if (changeSomeFields) {
    cy.typeAutocompleteClickOptionIndex(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-country',
      'Hong Kong',
      0
    );
    cy.getSelectFieldClickOption(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-isHaveLegalEntity',
      '1'
    );
    cy.getSelectFieldClickOption(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-isUseLegalEntity',
      '0'
    );

    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
    ).click();
  } else {
    // base options, then able to click next
    cy.typeAutocompleteClickOptionIndex(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-country',
      'Thailand',
      0
    );
    cy.getSelectFieldClickOption(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-isHaveLegalEntity',
      '0'
    );

    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
    ).click();
  }
};

const fillingStep1 = (skipNext?: boolean) => {
  // step 1 - Hiring details
  cy.typeAutocompleteClickOptionIndex(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-nationality',
    'Thailand',
    0
  );
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-citizenshipStatus',
    'CITIZEN'
  );
  cy.typeAutocompleteClickOptionIndex(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-currency',
    'THB',
    0
  );

  if (skipNext) return;

  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
  ).click();
};

const fillingStep2 = () => {
  // step 2 - Hiree details
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-firstName"]'
  )
    .type('Thomas')
    .find('input')
    .should('have.value', 'Thomas');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-lastName"]'
  )
    .type('Vu')
    .find('input')
    .should('have.value', 'Vu');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-email"]'
  )
    .should('be.visible')
    .type('thomasvu@company.com')
    .find('input')
    .should('have.value', 'thomasvu@company.com');
  cy.wait(3_000);
  cy.typeTextEditor('description', 'Example');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-title"]'
  )
    .type('The title')
    .find('input')
    .should('have.value', 'The title');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-employeeId"]'
  )
    .should('be.visible')
    .type('S001')
    .find('input')
    .should('have.value', 'S001');

  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
  ).click();
};

const fillingStep3 = () => {
  // step 3 - Contract details
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-contractType',
    'INDEFINITE'
  );
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-endDate"]'
  ).should('not.exist');
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-contractType',
    'FIXED'
  );
  cy.chooseDatePicker(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-startDate"]',
    '1'
  );
  cy.chooseDatePicker(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-endDate"]',
    '2'
  );
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-employmentType',
    'PART_TIME'
  );
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-startAt"]'
  ).should('not.exist');
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-employmentType',
    'FULL_TIME'
  );
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-workingHoursPerWeek"]'
  )
    .type('40')
    .find('input')
    .should('have.value', '40');
  cy.chooseTimePicker(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-startAt"]',
    '09:00'
  );
  cy.chooseTimePicker(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-endAt"]',
    '18:00'
  );
  ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach((day) =>
    cy.getSelectFieldClickOption(
      `companyPeopleOnboardingCreate-guidedMode-peo-field-workerSchedule-${day}`,
      'FULL_DAY'
    )
  );
  ['saturday', 'sunday'].forEach((day) =>
    cy.getSelectFieldClickOption(
      `companyPeopleOnboardingCreate-guidedMode-peo-field-workerSchedule-${day}`,
      'OFF_DAY'
    )
  );
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-managerName"]'
  )
    .type('Manager name')
    .find('input')
    .should('have.value', 'Manager name');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-managerTitle"]'
  )
    .type('Manager title')
    .find('input')
    .should('have.value', 'Manager title');
  cy.typeAutocompleteClickOptionIndex(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-department',
    'Create',
    0
  );
  cy.get(
    '[data-testid="staffAuditClientList-companyId-departmentModal-field-name"]'
  )
    .type('technology')
    .find('input')
    .should('have.value', 'technology');

  cy.get(
    '[data-testid="staffAuditClientList-companyId-departmentModal-submitButton"]'
  ).click();

  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-toast-successAlert"]'
  ).should('be.visible');

  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddressType',
    'COMPANY'
  );
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddress-addressLine"]'
  ).should('not.exist');
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddressType',
    'OTHERS'
  );
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddress-addressLine"]'
  )
    .type('Address line')
    .find('input')
    .should('have.value', 'Address line');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddress-city"]'
  )
    .type('City')
    .find('input')
    .should('have.value', 'City');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddress-state"]'
  )
    .type('State')
    .find('input')
    .should('have.value', 'State');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddress-postalCode"]'
  )
    .type('12000')
    .find('input')
    .should('have.value', '12000');

  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
  ).click();
};

const fillingStep4 = (fillYesForExtraFields?: boolean, skipNext?: boolean) => {
  // step 4 - Remuneration details
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-salaryPerMonth"]'
  )
    .type('1400')
    .find('input');
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-salaryPayableDate',
    '27'
  );

  if (fillYesForExtraFields) {
    cy.getSelectFieldClickOption(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-isEligibleForAdditionalIncome',
      '1'
    );
    cy.getSelectFieldClickOption(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-isEligibleForPaidExpenses',
      '1'
    );
    cy.getSelectFieldClickOption(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-isEntitledToOvertime',
      '1'
    );
  } else {
    cy.getSelectFieldClickOption(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-isEligibleForAdditionalIncome',
      '0'
    );
    cy.getSelectFieldClickOption(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-isEligibleForPaidExpenses',
      '0'
    );
    cy.getSelectFieldClickOption(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-isEntitledToOvertime',
      '0'
    );
  }

  if (skipNext) return;

  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
  ).click();
};

const fillingStep5 = (fillYesForExtraFields?: boolean, skipNext?: boolean) => {
  // step 5 - Additional details salaryPayableDate
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-probationPeriod"]'
  )
    .find('input')
    .clear()
    .type('60')
    .should('have.value', '60');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-paidTimeOff"]'
  )
    .find('input')
    .clear()
    .type('6')
    .should('have.value', '6');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-sickTimeOff"]'
  )
    .find('input')
    .clear()
    .type('30')
    .should('have.value', '30');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-terminationNotice"]'
  )
    .find('input')
    .clear()
    .type('1')
    .should('have.value', '1');
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-isEligibleForInsurance',
    '0'
  );

  if (fillYesForExtraFields) {
    cy.getSelectFieldClickOption(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-isEligibleForVariablePay',
      '1'
    );
    cy.getSelectFieldClickOption(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-isEligibleForAnnualBonus',
      '1'
    );
    cy.getSelectFieldClickOption(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-isEligibleForCommission',
      '1'
    );
  } else {
    cy.getSelectFieldClickOption(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-isEligibleForVariablePay',
      '0'
    );
    cy.getSelectFieldClickOption(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-isEligibleForAnnualBonus',
      '0'
    );
    cy.getSelectFieldClickOption(
      'companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-isEligibleForCommission',
      '0'
    );
  }

  if (skipNext) return;

  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
  ).click();
};

const fillingStep6 = () => {
  // step 6 - Employment contract
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-isSigned"]'
  ).click();

  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
  ).click();
};

const checkIsProcessFinalAndAddNewHire = () => {
  // completed
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-downloadContract"]'
  ).should('be.visible');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-viewSummary"]'
  ).should('be.visible');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-addNewHire"]'
  )
    .should('be.visible')
    .click();
};

const checkIsProcessFinalAndDownloadContract = () => {
  // completed
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-addNewHire"]'
  ).should('be.visible');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-viewSummary"]'
  ).should('be.visible');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-downloadContract"]'
  )
    .should('be.visible')
    .click();
};

const checkIsProcessFinalAndViewSummary = () => {
  // completed
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-addNewHire"]'
  ).should('be.visible');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-downloadContract"]'
  ).should('be.visible');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-viewSummary"]'
  )
    .should('be.visible')
    .click();
};

const clickPrevious = () => {
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-previousButton"]'
  ).click();
};

describe('company/people/onboarding/create', () => {
  describe('when create new hire PEO Thailand', () => {
    describe('when filling step by step: complete step 2 then back and select another country', () => {
      before(() => {
        mockDataAndVisitCreatePeo();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should able to change some fields in the first step', () => {
        fillingStep0();
        fillingStep1(true);
        clickPrevious();
        fillingStep0(false, true);
      });
    });

    describe('when filling step 1 enable useLegalEntity', () => {
      before(() => {
        mockDataAndVisitCreatePeo();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should able to change some fields in the first step', () => {
        fillingStep0(true, false);
      });
    });

    testEachViewport('when filling step by step', () => {
      before(() => {
        mockDataAndVisitCreatePeo();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should complete hiring details', () => {
        fillingStep0();
        fillingStep1();
        fillingStep2();
        fillingStep3();
        fillingStep4(true, true);
        fillingStep4();
        fillingStep5(true, true);
        fillingStep5();
        fillingStep6();
        checkIsProcessFinalAndViewSummary();
      });
    });

    describe('when filling step by step and add new hire after done', () => {
      before(() => {
        mockDataAndVisitCreatePeo();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should complete hiring details and add new hire', () => {
        fillingStep0();
        fillingStep1();
        fillingStep2();
        fillingStep3();
        fillingStep4();
        fillingStep5();
        fillingStep6();
        checkIsProcessFinalAndAddNewHire();
      });
    });

    describe('when filling step by step and add download contract after done', () => {
      before(() => {
        mockDataAndVisitCreatePeo();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should complete hiring details and add download contract', () => {
        fillingStep0();
        fillingStep1();
        fillingStep2();
        fillingStep3();
        fillingStep4();
        fillingStep5();
        fillingStep6();
        checkIsProcessFinalAndDownloadContract();
      });
    });
  });
});
