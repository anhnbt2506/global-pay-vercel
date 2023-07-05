import {
  closeEditModal,
  mockDataEditEmploymentId,
  submitEditModal,
} from '../config';

describe('staff/audit/client-hires/[employmentId] ', () => {
  describe('when access Information tab', () => {
    const openAndFillIdentificationForm = (isVietnam?: boolean): void => {
      cy.get(
        `[data-testid="staffAudit-clientHires-employmentId-informationForm.identification-button-edit"]`
      )
        .scrollIntoView()
        .click();

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.userContext.identification.fields.email"]'
      )
        .find('input')
        .clear()
        .type('agp@ayp-group.com')
        .should('have.value', 'agp@ayp-group.com');

      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.identification.fields.citizenshipStatus',
        'PERMIT_HOLDER'
      );

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.identification.fields.taxId"]'
      )
        .find('input')
        .clear()
        .type('1234')
        .should('have.value', '1234');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.identification.fields.nationalId"]'
      )
        .find('input')
        .clear()
        .type('1234')
        .should('have.value', '1234');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.identification.fields.nationalIdIssuedPlace"]'
      )
        .find('input')
        .clear()
        .type('Hanoi')
        .should('have.value', 'Hanoi');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.identification.fields.nationalIdIssuedPlaceAlternate"]'
      )
        .find('input')
        .clear()
        .type('Danang')
        .should('have.value', 'Danang');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.identification.fields.passportNumber"]'
      )
        .find('input')
        .clear()
        .type('1234')
        .should('have.value', '1234');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.identification.fields.passportIssuedPlace"]'
      )
        .find('input')
        .clear()
        .type('Frankfurt')
        .should('have.value', 'Frankfurt');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.identification.fields.passportIssuedPlaceAlternate"]'
      )
        .find('input')
        .clear()
        .type('Berlin')
        .should('have.value', 'Berlin');

      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.identification.fields.permitType',
        'EMPLOYMENT_PASS'
      );

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.identification.fields.permitId"]'
      )
        .find('input')
        .clear()
        .type('12')
        .should('have.value', '12');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.identification.fields.permitIssuedPlace"]'
      )
        .find('input')
        .clear()
        .type('Hamburg')
        .should('have.value', 'Hamburg');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.identification.fields.permitIssuedPlaceAlternate"]'
      )
        .find('input')
        .clear()
        .type('Rostock')
        .should('have.value', 'Rostock');

      if (isVietnam) {
        cy.get(
          '[data-testid="staffAuditClientHires-employmentId-editInformation.identification.fields.oldPermitId"]'
        )
          .find('input')
          .clear()
          .type('1234')
          .should('have.value', '1234');
      }
    };

    //Identification for Vietnam country
    describe('when edit Identification failed - 400 error', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant('people/v1/worker-employment/patch:400-error');
        mockDataEditEmploymentId('vn');
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should open and update success edit modal', () => {
        openAndFillIdentificationForm(true);
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

    describe('when edit Identification failed - 500 error', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant('people/v1/worker-employment/patch:500-error');
        mockDataEditEmploymentId('vn');
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should open and update success edit modal', () => {
        openAndFillIdentificationForm(true);
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

    describe('when edit Identification success', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/patch:200-success'
        );
        mockDataEditEmploymentId('vn');
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should open and update success edit modal', () => {
        openAndFillIdentificationForm(true);
        submitEditModal();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-information-toast-successAlert"]'
        ).should('be.visible');
      });
    });

    //Identification success for other countries
    describe('when edit Identification success', () => {
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
        openAndFillIdentificationForm();
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
