import { visitCompanyPeopleOnboardingPageAndSelectPEO } from './config';

describe('company/people/onboarding/create', () => {
  describe('when create new hire PEO PH', () => {
    before(() => {
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/check:200-success-has-submitted'
      );
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/check-employee-id:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/department/selection:200-success');
      cy.mocksUseRouteVariant('people/v1/department/post:200-success');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should contain correct selections and select PH selection', () => {
      visitCompanyPeopleOnboardingPageAndSelectPEO();
    });

    describe('when filling step by step', () => {
      it('should complete hiring details', () => {
        // step 0 - Classify your hire
        cy.typeAutocompleteClickOptionIndex(
          'companyPeopleOnboardingCreate-guidedMode-peo-field-country',
          'philippines',
          0
        );
        cy.getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-guidedMode-peo-field-isHaveLegalEntity',
          '0'
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
        ).click();

        // step 1 - Hiring details
        cy.typeAutocompleteClickOptionIndex(
          'companyPeopleOnboardingCreate-guidedMode-peo-field-nationality',
          'philippines',
          0
        );
        cy.getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-guidedMode-peo-field-citizenshipStatus',
          'CITIZEN'
        );
        cy.typeAutocompleteClickOptionIndex(
          'companyPeopleOnboardingCreate-guidedMode-peo-field-currency',
          'PHP',
          0
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
        ).click();
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
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(
          (day) =>
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
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
        ).click();

        // step 5 - Additional details salaryPayableDate
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-probationPeriod"]'
        )
          .type('180')
          .find('input')
          .should('have.value', '180');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-paidTimeOff"]'
        )
          .type('12')
          .find('input')
          .should('have.value', '12');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-sickTimeOff"]'
        )
          .type('14')
          .find('input')
          .should('have.value', '14');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-terminationNotice"]'
        )
          .type('1')
          .find('input')
          .should('have.value', '1');
        cy.getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-isEligibleForInsurance',
          '0'
        );

        cy.getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-fieldManagerialType',
          'FIELD_MANAGERIAL'
        );

        cy.getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-isEntitledToOvertimeDifferential',
          '1'
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-compassionateTimeOff"]'
        )
          .type('12')
          .find('input')
          .should('have.value', '12');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-monthlyAllowance"]'
        )
          .type('1400')
          .find('input');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
        ).click();

        // step 6 - Employment contract
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-isSigned"]'
        ).click();
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
        ).click();

        // completed
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-addNewHire"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-downloadContract"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-viewSummary"]'
        ).should('be.visible');
      });
    });
  });
});
