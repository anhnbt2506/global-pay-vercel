import { STAFF_ADMIN } from '@fixtures/users';

export const mockDataAndVisitEmploymentIdOnboarded = (mockedId: string) => {
  cy.mocksUseRouteVariant(
    'people/v1/worker-employment/get-by-employment-id:200-worker-onboarded-status-success'
  );
  cy.mocksUseRouteVariant('people/v1/get-banks:200-success');
  cy.login(STAFF_ADMIN);
  cy.visit(`/staff/audit/client-hires/${mockedId}`);
};

export const mockDataAndVisitEmploymentDocumentsAddendum = (
  mockedId: string
) => {
  cy.mocksUseRouteVariant(
    'people/v1/worker-employment/get-by-employment-id:200-worker-onboarded-status-success'
  );
  cy.mocksUseRouteVariant('people/v1/get-banks:200-success');
  cy.login(STAFF_ADMIN);
  cy.visit(
    `/staff/audit/client-hires/${mockedId}?tab=documents&folder=documents/addendum`
  );
};
