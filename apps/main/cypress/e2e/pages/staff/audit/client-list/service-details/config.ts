import { STAFF_ADMIN } from '@fixtures/users';

export const mockedCompanyId = 'vdqb3hxkjayjahhn';

export const selectHireTypeAndCountry = (
  hireType: string,
  country: string,
  shouldDecrypt: boolean
) => {
  cy.get(
    '[data-testid="staffAuditClientList-companyId-serviceDetail.service-button-edit"]'
  ).click();
  cy.getSelectFieldClickOption(
    'staffAuditClientList-companyId-serviceDetail-updateService.field.hireType',
    hireType
  );
  cy.typeAutocompleteClickOptionIndex(
    'staffAuditClientList-companyId-serviceDetail-updateService.field.country',
    country,
    0
  );

  if (shouldDecrypt) {
    cy.getSelectFieldClickOption(
      'staffAuditClientList-companyId-serviceDetail-updateService.field.shouldDecrypt',
      '1'
    );
    cy.get(
      '[data-testid="staffAuditClientList-companyId-serviceDetail-updateService.field.password"] > .MuiInputBase-input'
    ).type('12345678');
  } else {
    cy.getSelectFieldClickOption(
      'staffAuditClientList-companyId-serviceDetail-updateService.field.shouldDecrypt',
      '0'
    );
  }

  cy.get(
    '[data-testid="staffAuditClientList-companyId-serviceDetail-updateService-submitButton"]'
  ).click();
};

export const editBankAndSubmitForm = (country: string) => {
  cy.get(
    '[data-testid="staffAuditClientList-companyId-serviceDetail.details-button-edit"]'
  )
    .should('be.visible')
    .click();

  if (country !== 'TH') {
    cy.get(
      `[data-testid="companyPeopleOnboardingUpdate-bulkUploadMode-pom-${country}-field-bankAccount-bank"]  > .MuiFormControl-root > .MuiInputBase-root`
    )
      .scrollIntoView()
      .should('be.visible');
    cy.typeAutocompleteClickOptionIndex(
      `companyPeopleOnboardingUpdate-bulkUploadMode-pom-${country}-field-bankAccount-bank`,
      'Bank 01',
      0
    );
  }

  cy.get(
    `[data-testid="companyPeopleOnboardingUpdate-bulkUploadMode-pom-${country}-button-submit"]`
  ).click();
};

export const mockDataAndVisitCompanyDetail = () => {
  cy.mocksUseRouteVariant('people/v1/company/information:200-success');
  cy.mocksUseRouteVariant('people/v1/currency/get-currencies:200-success');
  cy.login(STAFF_ADMIN);
  cy.visit(`/staff/audit/client-list/${mockedCompanyId}`);
};
