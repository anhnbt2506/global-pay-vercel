export const visitCompanyPeopleOnboardingPageAndSelectPEO = () => {
  cy.visit(`/company/people/onboarding/create`);
  cy.get('[data-testid="companyPeopleOnboardingCreate-selection-PEO"]')
    .should('be.visible')
    .click();
};

export const getSelectFieldClickOption = (
  dataTestId: string,
  option: string
) => {
  cy.get(`[data-testid="${dataTestId}"]`).click();
  cy.get(`[data-testid="${dataTestId}-optionId-${option}"]`).click();
};
