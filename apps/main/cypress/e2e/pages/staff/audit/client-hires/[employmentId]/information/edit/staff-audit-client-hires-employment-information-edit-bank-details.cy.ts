import {
  closeEditModal,
  mockDataEditEmploymentId,
  submitEditModal,
} from '../config';

describe('staff/audit/client-hires/[employmentId] ', () => {
  describe('when access Information tab', () => {
    const openAndFillBankDetails = () => {
      cy.get(
        `[data-testid="staffAudit-clientHires-employmentId-informationForm.bankDetails-button-edit"]`
      )
        .scrollIntoView()
        .click();
      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.bankDetails.fields.beneficiaryName"]'
      )
        .clear()
        .type('David Lee')
        .find('input')
        .should('have.value', 'David Lee');
      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.bankDetails.fields.accountNumber"]'
      )
        .clear()
        .type('1234567')
        .find('input')
        .should('have.value', '1234567');
      cy.typeAutocompleteClickOptionIndex(
        'staffAuditClientHires-employmentId-editInformation.bankDetails.fields.bank',
        'Bank 01',
        0
      );
      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.bankDetails.fields.branchCode"]'
      )
        .clear()
        .type('PPBVN')
        .find('input')
        .should('have.value', 'PPBVN');
    };

    // Bank Details
    describe('when edit Bank Details failed - 400 error', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant('people/v1/worker-employment/patch:400-error');
        mockDataEditEmploymentId();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should open and update success edit modal', () => {
        openAndFillBankDetails();
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

    describe('when edit Bank Details failed - 500 error', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant('people/v1/worker-employment/patch:500-error');
        mockDataEditEmploymentId();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should open and update success edit modal', () => {
        openAndFillBankDetails();
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

    describe('when edit Bank Details success', () => {
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
        openAndFillBankDetails();
        submitEditModal();
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast"]'
        ).should('be.visible');
      });
    });
  });
});
