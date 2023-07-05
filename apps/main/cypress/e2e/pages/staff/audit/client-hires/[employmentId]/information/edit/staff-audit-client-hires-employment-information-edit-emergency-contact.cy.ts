import {
  closeEditModal,
  mockDataEditEmploymentId,
  submitEditModal,
} from '../config';

describe('staff/audit/client-hires/[employmentId] ', () => {
  describe('when access Information tab', () => {
    const openAndFillEmergencyContact = () => {
      cy.get(
        `[data-testid="staffAudit-clientHires-employmentId-informationForm.emergencyContact-button-edit"]`
      )
        .scrollIntoView()
        .click();

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.emergencyContact.fields.emergencyContactName"]'
      )
        .find('input')
        .clear()
        .type('Daniel')
        .should('have.value', 'Daniel');

      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.emergencyContact.fields.emergencyContactRelationship',
        'CHILD'
      );

      cy.typeAutocompleteClickOptionIndex(
        'staffAuditClientHires-employmentId-editInformation.emergencyContact.fields.emergencyContactNumberCountryCode',
        'singapore',
        0
      );

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.emergencyContact.fields.emergencyContactNumber"]'
      )
        .type('1234')
        .find('input')
        .should('have.value', '1234');
    };

    //EmergencyContact
    describe('when edit EmergencyContact failed - 400 error', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant('people/v1/worker-employment/patch:400-error');
        mockDataEditEmploymentId();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should open and update success edit modal', () => {
        openAndFillEmergencyContact();
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

    describe('when edit EmergencyContact failed - 500 error', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant('people/v1/worker-employment/patch:500-error');
        mockDataEditEmploymentId();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should open and update success edit modal', () => {
        openAndFillEmergencyContact();
        submitEditModal();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast-errorAlert"]'
        ).should('be.visible');
        closeEditModal();
      });
    });

    describe('when edit EmergencyContact success', () => {
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
        openAndFillEmergencyContact();
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
