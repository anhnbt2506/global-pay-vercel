import { INFORMATION_FIELDS } from '../config';
import { mockDataAndVisitEmploymentIdOnboarded } from '../config';

export const mockedId = '123';

describe('company/people/onboarding/[employmentId] ', () => {
  describe('when access Information tab', () => {
    const checkFields = (countryCode: string) => {
      cy.url().should('include', `/company/people/onboarding/${mockedId}`);

      // Verification info
      cy.get(
        '[data-testid="companyPeopleOnboarding-employmentId-informationForm.verification"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="companyPeopleOnboarding-employmentId-informationForm.verification.fields.currentStatus"]'
      )
        .scrollIntoView()
        .should('be.visible');

      // Employment details
      cy.get(
        '[data-testid="companyPeopleOnboarding-employmentId-informationForm.employmentDetails"]'
      )
        .scrollIntoView()
        .should('be.visible');

      INFORMATION_FIELDS.employmentDetails.map((field) => {
        cy.get(
          `[data-testid="companyPeopleOnboarding-employmentId-informationForm.employmentDetails.fields.${field.labelKey}"]`
        )
          .scrollIntoView()
          .should('be.visible');
      });

      // Add-on employment details
      cy.get(
        '[data-testid="companyPeopleOnboarding-employmentId-informationForm.addOnEmploymentDetails"]'
      )
        .scrollIntoView()
        .should('be.visible');
      INFORMATION_FIELDS.addOnEmploymentDetails[countryCode].map((field) => {
        cy.get(
          `[data-testid="companyPeopleOnboarding-employmentId-informationForm.addOnEmploymentDetails.${countryCode.toUpperCase()}.fields.${
            field.labelKey
          }"]`
        )
          .scrollIntoView()
          .should('be.visible');
      });

      // Personal profile
      cy.get(
        '[data-testid="companyPeopleOnboarding-employmentId-informationForm.personalProfile"]'
      )
        .scrollIntoView()
        .should('be.visible');
      INFORMATION_FIELDS.personalProfile.map((field) => {
        cy.get(
          `[data-testid="companyPeopleOnboarding-employmentId-informationForm.personalProfile.fields.${field.labelKey}"]`
        )
          .scrollIntoView()
          .should('be.visible');
      });

      // Identification
      cy.get(
        '[data-testid="companyPeopleOnboarding-employmentId-informationForm.identification"]'
      )
        .scrollIntoView()
        .should('be.visible');
      INFORMATION_FIELDS.identification.map((field) => {
        cy.get(
          `[data-testid="companyPeopleOnboarding-employmentId-informationForm.identification.fields.${field.labelKey}"]`
        )
          .scrollIntoView()
          .should('be.visible');
      });

      // Emergency contract
      cy.get(
        '[data-testid="companyPeopleOnboarding-employmentId-informationForm.emergencyContact"]'
      )
        .scrollIntoView()
        .should('be.visible');
      INFORMATION_FIELDS.emergencyContact.map((field) => {
        cy.get(
          `[data-testid="companyPeopleOnboarding-employmentId-informationForm.emergencyContact.fields.${field.labelKey}"]`
        )
          .scrollIntoView()
          .should('be.visible');
      });

      // Bank details
      cy.get(
        '[data-testid="companyPeopleOnboarding-employmentId-informationForm.bankDetails"]'
      )
        .scrollIntoView()
        .should('be.visible');
      INFORMATION_FIELDS.bankDetails.map((field) => {
        cy.get(
          `[data-testid="companyPeopleOnboarding-employmentId-informationForm.bankDetails.fields.${field.labelKey}"]`
        )
          .scrollIntoView()
          .should('be.visible');
      });
    };

    describe('when access employment country HongKong', () => {
      before(() => {
        cy.clearCookies();

        mockDataAndVisitEmploymentIdOnboarded(
          mockedId,
          '200-worker-onboarded-status-success'
        );
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show employment information correctly', () => {
        checkFields('hk');
      });
    });

    describe('when access employment country VN', () => {
      before(() => {
        cy.clearCookies();

        mockDataAndVisitEmploymentIdOnboarded(
          mockedId,
          '200-employee-review-status-vn'
        );
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show employment information correctly', () => {
        checkFields('vn');
      });

      it('should show Worker Social Insurance Book ID and Worker Local Hospital Declaration values', () => {
        cy.url().should('include', `/company/people/onboarding/${mockedId}`);
        cy.contains('1234567788').scrollIntoView().should('be.visible');
        cy.contains('Thu cuc Hospital').scrollIntoView().should('be.visible');
      });
    });
  });
});
