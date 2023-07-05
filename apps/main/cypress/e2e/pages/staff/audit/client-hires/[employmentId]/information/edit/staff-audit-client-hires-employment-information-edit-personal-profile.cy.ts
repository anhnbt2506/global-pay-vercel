import {
  closeEditModal,
  mockDataEditEmploymentId,
  submitEditModal,
} from '../config';

describe('staff/audit/client-hires/[employmentId] ', () => {
  describe('when access Information tab', () => {
    const openAndFillPersonalProfileForm = () => {
      cy.get(
        `[data-testid="staffAudit-clientHires-employmentId-informationForm.personalProfile-button-edit"]`
      ).click();

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.firstName"]'
      )
        .find('input')
        .clear()
        .type('123')
        .should('have.value', '123');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.lastName"]'
      )
        .find('input')
        .clear()
        .type('123')
        .should('have.value', '123');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.firstNameAlternate"]'
      )
        .find('input')
        .clear()
        .type('123')
        .should('have.value', '123');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.lastNameAlternate"]'
      )
        .find('input')
        .clear()
        .type('123')
        .should('have.value', '123');

      cy.typeAutocompleteClickOptionIndex(
        'staffAuditClientHires-employmentId-editInformation.personalProfile.fields.nationalityCode',
        'singapore',
        0
      );

      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.personalProfile.fields.gender',
        'MALE'
      );

      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.personalProfile.fields.race',
        'AFRICAN'
      );

      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.personalProfile.fields.religion',
        'ATHEIST'
      );

      cy.getSelectFieldClickOption(
        'staffAuditClientHires-employmentId-editInformation.personalProfile.fields.maritalStatus',
        'SINGLE'
      );

      cy.typeAutocompleteClickOptionIndex(
        'staffAuditClientHires-employmentId-editInformation.personalProfile.fields.contactNumberCountryCode',
        'singapore',
        0
      );

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.contactNumber"]'
      )
        .type('1234')
        .find('input')
        .should('have.value', '1234');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.addressLine"]'
      )
        .find('input')
        .clear()
        .type('1234')
        .should('have.value', '1234');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.city"]'
      )
        .find('input')
        .clear()
        .type('1234')
        .should('have.value', '1234');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.state"]'
      )
        .find('input')
        .clear()
        .type('VN')
        .should('have.value', 'VN');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.postalCode"]'
      )
        .find('input')
        .clear()
        .type('10')
        .should('have.value', '10');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.addressLineAlternate"]'
      )
        .find('input')
        .clear()
        .type('a')
        .should('have.value', 'a');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.cityAlternate"]'
      )
        .find('input')
        .clear()
        .type('a')
        .should('have.value', 'a');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.stateAlternate"]'
      )
        .find('input')
        .clear()
        .type('a')
        .should('have.value', 'a');

      cy.get(
        '[data-testid="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.postalCodeAlternate"]'
      )
        .find('input')
        .clear()
        .type('10')
        .should('have.value', '10');
    };

    //Personal Profile
    describe('when edit Personal Profile failed - 400 error', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant('people/v1/worker-employment/patch:400-error');
        mockDataEditEmploymentId();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should open and update success edit modal', () => {
        openAndFillPersonalProfileForm();
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

    describe('when edit Personal Profile failed - 500 error', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant('people/v1/worker-employment/patch:500-error');
        mockDataEditEmploymentId();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should open and update success edit modal', () => {
        openAndFillPersonalProfileForm();
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

    describe('when edit Personal Profile success', () => {
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
        openAndFillPersonalProfileForm();
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
