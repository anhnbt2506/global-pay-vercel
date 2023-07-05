export const visitCompanyPeopleOnboardingPageAndSelectPeoEor = () => {
  cy.visit(`/company/people/onboarding/create`);
  cy.get('[data-testid="companyPeopleOnboardingCreate-selection-PEO"]')
    .should('be.visible')
    .click();
};
