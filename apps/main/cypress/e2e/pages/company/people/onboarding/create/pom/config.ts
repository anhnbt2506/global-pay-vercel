export const visitCompanyPeopleOnboardingPageAndSelectPOM = () => {
  cy.visit(`/company/people/onboarding/create`);
  cy.get('[data-testid="companyPeopleOnboardingCreate-selection-POM"]')
    .should('be.visible')
    .click();
};

export const getSelectFieldClickOption = (
  dataTestId: string,
  option: string
) => {
  cy.get(`[data-testid="${dataTestId}"]`)
    .scrollIntoView()
    .should('be.visible')
    .click();
  cy.get(`[data-testid="${dataTestId}-optionId-${option}"]`)
    .scrollIntoView()
    .should('be.visible')
    .click();
};
