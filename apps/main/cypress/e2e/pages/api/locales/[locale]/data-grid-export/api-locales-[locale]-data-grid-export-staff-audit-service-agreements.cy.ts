interface DataGridExportStaffAuditClientServiceAgreementsResponse {
  header: Record<string, unknown>;
  metadata: {
    status: Record<string, string>;
  };
}

describe('api/locales/[locale]/data-grid-export/staff-audit-client-service-agreements', () => {
  describe('when accessing the api/locales/en/data-grid-export/staff-audit-client-service-agreements', () => {
    it('should return correct response for staff audit client service agreements translation for English', () => {
      cy.request(
        '/api/locales/en/data-grid-export/staff-audit-client-service-agreements'
      ).as('api');
      cy.get<{
        status: number;
        body: DataGridExportStaffAuditClientServiceAgreementsResponse;
      }>('@api').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.header).exist;
        expect(response.body.metadata.status).exist;
      });
    });
  });
});
