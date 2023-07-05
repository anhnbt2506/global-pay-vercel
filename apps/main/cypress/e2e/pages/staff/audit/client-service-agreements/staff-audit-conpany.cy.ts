import { STAFF_ADMIN } from '@fixtures/users';

describe('staff/audit/client-service-agreements/[serviceAgreementId]', () => {
  const mockedServiceAgreementId = '3l5x2nvoj4zi97cbciypbhqpdr7pir0r';

  const mockApiAndVisitPage = (
    serviceAgreementStatus: string,
    mockSuccessConversationApi: boolean
  ) => {
    cy.mocksUseRouteVariant(
      `people/v1/service-agreement/get-by-id:200-success-${serviceAgreementStatus}-status`
    );
    mockSuccessConversationApi
      ? cy.mocksUseRouteVariant('people/v1/conversation/get-by-id:200-success')
      : cy.mocksUseRouteVariant(
          'people/v1/conversation/get-by-id:404-not-found'
        );

    cy.login(STAFF_ADMIN);
    cy.visit(
      `/staff/audit/client-service-agreements/${mockedServiceAgreementId}`
    );
  };

  describe('when access the page that the service agreement has the status WAITING_CONFIRMATION', () => {
    before(() => {
      cy.clearCookies();
      mockApiAndVisitPage('waiting-confirmation', true);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show correct information', () => {
      cy.wait(2_000);

      cy.url().should(
        'include',
        `/staff/audit/client-service-agreements/${mockedServiceAgreementId}`
      );
      cy.typeTextEditor('content', 'Buoc Qua Nhau', true);
      cy.get(
        '[data-testid="staffAudit-clientServiceAgreement-id-update-button"]'
      ).should('be.disabled');
    });
  });

  describe('when access the page that the service agreement has the status IN_REVIEW', () => {
    before(() => {
      cy.clearCookies();
      mockApiAndVisitPage('in-review', true);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show correct information', () => {
      cy.wait(2_000);

      cy.url().should(
        'include',
        `/staff/audit/client-service-agreements/${mockedServiceAgreementId}`
      );
      cy.typeTextEditor('content', 'Buoc Qua Nhau', true);
      cy.get(
        '[data-testid="staffAudit-clientServiceAgreement-id-update-button"]'
      ).should('not.be.disabled');
      cy.clickOutside();
    });
  });

  describe('when update service agreement', () => {
    it('should show not found error message', () => {
      cy.mocksUseRouteVariant(
        'people/v1/service-agreement/update:404-not-found'
      );

      cy.typeTextEditor('content', ' Vu Vu');
      cy.typeTextEditor('content', 'Buoc Qua Nhau Vu Vu', true);
      cy.get(
        '[data-testid="staffAudit-clientServiceAgreement-id-update-button"]'
      ).click();

      cy.get(
        '[data-testid="staffAudit-clientServiceAgreement-id-errorAlert"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientServiceAgreement-id-update-button"]'
      ).should('not.be.disabled');
    });

    it('should show unknown error message', () => {
      cy.mocksUseRouteVariant('people/v1/service-agreement/update:500-unknown');

      cy.typeTextEditor('content', ' Vu Vu');
      cy.typeTextEditor('content', 'Buoc Qua Nhau Vu Vu', true);
      cy.get(
        '[data-testid="staffAudit-clientServiceAgreement-id-update-button"]'
      ).click();

      cy.get(
        '[data-testid="staffAudit-clientServiceAgreement-id-errorAlert"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientServiceAgreement-id-update-button"]'
      ).should('not.be.disabled');
    });

    it('should update service agreement', () => {
      cy.mocksUseRouteVariant('people/v1/service-agreement/update:200-success');

      cy.typeTextEditor('content', 'Buoc Qua Nhau Vu Vu', true);
      cy.get(
        '[data-testid="staffAudit-clientServiceAgreement-id-update-button"]'
      ).click();

      cy.get(
        '[data-testid="staffAudit-clientServiceAgreement-id-successAlert"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientServiceAgreement-id-update-button"]'
      ).should('be.disabled');
    });
  });

  describe('when GET conversation API return error', () => {
    before(() => {
      cy.clearCookies();
      mockApiAndVisitPage('in-review', false);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show error message', () => {
      cy.get(
        '[data-testid="staffAudit-clientServiceAgreement-id-errorAlert"]'
      ).should('be.visible');
    });
  });
});
