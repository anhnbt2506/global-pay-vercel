import { STAFF_ADMIN } from '@fixtures/users';

import { INFORMATION_FIELDS } from '../../config';
import { mockDataAndVisitEmploymentIdOnboarded } from '../config';
import { mockedId } from './config';

describe('staff/audit/client-hires/[employmentId] ', () => {
  describe('when access Information tab', () => {
    const checkFields = (countryCode: string) => {
      cy.url().should('include', `/staff/audit/client-hires/${mockedId}`);

      // Verification info
      cy.get(
        '[data-testid="staffAudit-clientHires-employmentId-informationForm.verification"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientHires-employmentId-informationForm.verification.fields.currentStatus"]'
      )
        .scrollIntoView()
        .should('be.visible');

      // Employment details
      cy.get(
        '[data-testid="staffAudit-clientHires-employmentId-informationForm.employmentDetails"]'
      )
        .scrollIntoView()
        .should('be.visible');

      INFORMATION_FIELDS.employmentDetails.map((field) => {
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-informationForm.employmentDetails.fields.${field.labelKey}"]`
        )
          .scrollIntoView()
          .should('be.visible');
      });

      // Add-on employment details
      cy.get(
        '[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails"]'
      )
        .scrollIntoView()
        .should('be.visible');
      INFORMATION_FIELDS.addOnEmploymentDetails[countryCode].map((field) => {
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-informationForm.addOnEmploymentDetails.${countryCode.toUpperCase()}.fields.${
            field.labelKey
          }"]`
        )
          .scrollIntoView()
          .should('be.visible');
      });

      // Personal profile
      cy.get(
        '[data-testid="staffAudit-clientHires-employmentId-informationForm.personalProfile"]'
      )
        .scrollIntoView()
        .should('be.visible');
      INFORMATION_FIELDS.personalProfile.map((field) => {
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-informationForm.personalProfile.fields.${field.labelKey}"]`
        )
          .scrollIntoView()
          .should('be.visible');
      });

      // Identification
      cy.get(
        '[data-testid="staffAudit-clientHires-employmentId-informationForm.identification"]'
      )
        .scrollIntoView()
        .should('be.visible');
      INFORMATION_FIELDS.identification.map((field) => {
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-informationForm.identification.fields.${field.labelKey}"]`
        )
          .scrollIntoView()
          .should('be.visible');
      });

      // Emergency contract
      cy.get(
        '[data-testid="staffAudit-clientHires-employmentId-informationForm.emergencyContact"]'
      )
        .scrollIntoView()
        .should('be.visible');
      INFORMATION_FIELDS.emergencyContact.map((field) => {
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-informationForm.emergencyContact.fields.${field.labelKey}"]`
        )
          .scrollIntoView()
          .should('be.visible');
      });

      // Bank details
      cy.get(
        '[data-testid="staffAudit-clientHires-employmentId-informationForm.bankDetails"]'
      )
        .scrollIntoView()
        .should('be.visible');
      INFORMATION_FIELDS.bankDetails.map((field) => {
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-informationForm.bankDetails.fields.${field.labelKey}"]`
        )
          .scrollIntoView()
          .should('be.visible');
      });
    };

    describe('when HongKong country', () => {
      before(() => {
        cy.clearCookies();
        mockDataAndVisitEmploymentIdOnboarded(mockedId);
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show employment information correctly', () => {
        checkFields('hk');
      });
    });

    describe('when update employee status', () => {
      before(() => {
        cy.clearCookies();
        mockDataAndVisitEmploymentIdOnboarded(mockedId);
      });

      it('should show toast error message', () => {
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/update:403-forbidden-error'
        );
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-iconButton-options"]`
        ).click();
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-updateClientStatus"]`
        ).click();
        cy.getSelectFieldClickOption(
          'staffAudit-clientHires-employmentId-updateClientStatus-fields.status',
          'DRAFT'
        );
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-updateClientStatus-button-submit"]'
        ).click();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-toast"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-toast-errorAlert"]'
        ).should('be.visible');
      });

      it('should update success and close modal', () => {
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/update:200-success'
        );
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-iconButton-options"]`
        ).click();
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-updateClientStatus"]`
        ).click();
        cy.getSelectFieldClickOption(
          'staffAudit-clientHires-employmentId-updateClientStatus-fields.status',
          'DRAFT'
        );
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-updateClientStatus-button-submit"]'
        ).click();
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-toast"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-toast-successAlert"]'
        ).should('be.visible');
      });
    });

    describe('when download contract with status is not onboarded', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/get-by-employment-id:200-employee-review-status'
        );
        cy.login(STAFF_ADMIN);
        cy.visit(`/staff/audit/client-hires/${mockedId}`);
      });

      it('should show toast error message', () => {
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-iconButton-options"]`
        ).click();
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-downloadContract"]`
        ).click();
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-toast"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-toast-errorAlert"]'
        ).should('be.visible');
      });
    });

    describe('when download contract with status is onboarded', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/get-by-employment-id:200-worker-onboarded-status-success'
        );

        // create a single stub we will use
        const stub = cy.stub().as('open');
        cy.on('window:before:load', (win) => {
          cy.stub(win, 'open').callsFake(stub);
        });

        cy.login(STAFF_ADMIN);
        cy.visit(`/staff/audit/client-hires/${mockedId}`);
      });

      it('should open a new tab', () => {
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-iconButton-options"]`
        ).click();
        cy.get(
          `[data-testid="staffAudit-clientHires-employmentId-downloadContract"]`
        ).click();

        cy.get('@open').should('have.been.calledOnce');
      });
    });

    describe('when access country VN', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/get-by-employment-id:200-employee-review-status-vn'
        );
        cy.login(STAFF_ADMIN);
        cy.visit(`/staff/audit/client-hires/${mockedId}`);
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show employment information correctly', () => {
        checkFields('vn');
      });

      it('should show Worker Social Insurance Book ID and Worker Local Hospital Declaration values', () => {
        cy.url().should('include', `/staff/audit/client-hires/${mockedId}`);
        cy.contains('1234567788').scrollIntoView().should('be.visible');
        cy.contains('Thu cuc Hospital').scrollIntoView().should('be.visible');
      });
    });
  });
});
