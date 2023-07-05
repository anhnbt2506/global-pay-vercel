import { mockDataEditEmploymentId, submitEditModal } from '../config';

describe('staff/audit/client-hires/[employmentId] ', () => {
  describe('when access Information tab', () => {
    const openAndFillInEmploymentDetails = () => {
      cy.get(
        '[data-testid="staffAudit-clientHires-employmentId-informationForm.employmentDetails-button-edit"]'
      )
        .scrollIntoView()
        .click();

      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.hireType',
        'EOR'
      );

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.title"]'
      )
        .clear()
        .type('Developer')
        .find('input')
        .should('have.value', 'Developer');
      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.titleAlternate"]'
      )
        .clear()
        .type('Developer')
        .find('input')
        .should('have.value', 'Developer');
      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.contractType',
        'FIXED'
      );

      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.employmentType',
        'FULL_TIME'
      );

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.workingHoursPerWeek"]'
      )
        .clear()
        .type('40')
        .find('input')
        .should('have.value', '40');

      cy.chooseTimePicker(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.startAt"]',
        '09:00'
      );
      cy.chooseTimePicker(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.endAt"]',
        '17:30'
      );

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.managerName"]'
      )
        .clear()
        .type('David Lee')
        .find('input')
        .should('have.value', 'David Lee');
      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.managerTitle"]'
      )
        .clear()
        .type('CTO')
        .find('input')
        .should('have.value', 'CTO');
      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.salaryPerMonth"]'
      )
        .clear()
        .type('4000')
        .find('input')
        .should('have.value', '4,000.00');

      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForInsurance',
        '1'
      );
      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEntitledToOvertime',
        '1'
      );
      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForPaidExpenses',
        '1'
      );
      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForAdditionalIncome',
        '1'
      );
      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForVariablePay',
        '1'
      );
      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForAnnualBonus',
        '1'
      );
      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForCommission',
        '1'
      );
    };

    const openAndFillInEmploymentDetailsOtherCases = () => {
      cy.get(
        '[data-testid="staffAudit-clientHires-employmentId-informationForm.employmentDetails-button-edit"]'
      )
        .scrollIntoView()
        .click();

      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.hireType',
        'EOR'
      );

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.title"]'
      )
        .clear()
        .type('Developer')
        .find('input')
        .should('have.value', 'Developer');
      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.titleAlternate"]'
      )
        .clear()
        .type('Developer')
        .find('input')
        .should('have.value', 'Developer');
      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.contractType',
        'INDEFINITE'
      );

      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.employmentType',
        'PART_TIME'
      );

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.workingHoursPerWeek"]'
      )
        .clear()
        .type('40')
        .find('input')
        .should('have.value', '40');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.managerName"]'
      )
        .clear()
        .type('David Lee')
        .find('input')
        .should('have.value', 'David Lee');
      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.managerTitle"]'
      )
        .clear()
        .type('CTO')
        .find('input')
        .should('have.value', 'CTO');
      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.salaryPerMonth"]'
      )
        .clear()
        .type('4000')
        .find('input')
        .should('have.value', '4,000.00');

      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForInsurance',
        '1'
      );
      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEntitledToOvertime',
        '0'
      );
      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForPaidExpenses',
        '0'
      );
      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForAdditionalIncome',
        '0'
      );
      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForVariablePay',
        '0'
      );
      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForAnnualBonus',
        '0'
      );
      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForCommission',
        '0'
      );
    };

    //Employment Details
    describe('when input nothing and submit modal', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant('people/v1/worker-employment/patch:400-error');
        mockDataEditEmploymentId();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show the required error helper text', () => {
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-informationForm.employmentDetails-button-edit"]'
        )
          .scrollIntoView()
          .click();

        submitEditModal();

        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForCommission-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
      });
    });

    describe('when edit Employment Details failed - 400 error', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant('people/v1/worker-employment/patch:400-error');
        mockDataEditEmploymentId();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should open edit modal and fail to update', () => {
        openAndFillInEmploymentDetailsOtherCases();
        submitEditModal();
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast-errorAlert"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast"]'
        ).clickOutside();
      });
    });

    describe('when edit Employment Details failed - 500 error', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant('people/v1/worker-employment/patch:500-error');
        mockDataEditEmploymentId();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should open edit modal and fail to update', () => {
        openAndFillInEmploymentDetails();
        submitEditModal();
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast-errorAlert"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast"]'
        ).clickOutside();
      });
    });

    describe('when edit Employment Details success', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/patch:200-success'
        );
        mockDataEditEmploymentId();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should open and update success edit modal', () => {
        openAndFillInEmploymentDetails();
        submitEditModal();
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast-successAlert"]'
        ).should('be.visible');
      });
    });
  });
});
