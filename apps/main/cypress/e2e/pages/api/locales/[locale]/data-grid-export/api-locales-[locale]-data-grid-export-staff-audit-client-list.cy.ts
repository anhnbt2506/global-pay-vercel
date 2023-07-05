interface DataGridExportStaffAuditClientListResponse {
  header: Record<string, unknown>;
  metadata: {
    category: Record<string, string>;
    industry: Record<string, string>;
    entityLinkStatus: Record<string, string>;
    status: Record<string, string>;
  };
}

describe('api/locales/[locale]/data-grid-export/staff-audit-client-list', () => {
  describe('when accessing the api/locales/en/data-grid-export/staff-audit-client-list', () => {
    it('should return correct response for staff audit client list translation for English', () => {
      cy.request('/api/locales/en/data-grid-export/staff-audit-client-list').as(
        'api'
      );
      cy.get<{
        status: number;
        body: DataGridExportStaffAuditClientListResponse;
      }>('@api').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.header).exist;
        expect(response.body.metadata.category).exist;
        expect(response.body.metadata.industry).exist;
        expect(response.body.metadata.entityLinkStatus).exist;
        expect(response.body.metadata.status).exist;
      });
    });
  });
});
