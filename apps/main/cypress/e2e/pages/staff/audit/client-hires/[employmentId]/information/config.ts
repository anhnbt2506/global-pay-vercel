import { STAFF_ADMIN } from '@fixtures/users';

export const mockedId = '123';

export const submitEditModal = () => {
  cy.get(`[data-testid="staffAuditClientHires-editModal-submitButton"]`)
    .scrollIntoView()
    .click();
};

export const closeEditModal = () => {
  cy.get(
    `[data-testid="staffAuditClientHires-editModal-cancelButton"]`
  ).click();
};

export const mockDataEditEmploymentId = (countrySuffixes?: string) => {
  cy.mocksUseRouteVariant(
    `people/v1/worker-employment/get-by-employment-id:200-get-employee-success${
      countrySuffixes ? `-${countrySuffixes}` : ''
    }`
  );
  cy.mocksUseRouteVariant('people/v1/get-banks:200-success');
  cy.login(STAFF_ADMIN);
  cy.visit(`/staff/audit/client-hires/${mockedId}`);
};
