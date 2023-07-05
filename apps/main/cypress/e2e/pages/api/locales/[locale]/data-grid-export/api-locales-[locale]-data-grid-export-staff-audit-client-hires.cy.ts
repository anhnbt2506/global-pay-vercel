interface DataGridExportStaffAuditClientHiresResponse {
  header: Record<string, unknown>;
  metadata: {
    citizenshipStatus: Record<string, string>;
    isPermitRequired: Record<string, string>;
    status: Record<string, string>;
  };
}

describe('api/locales/[locale]/data-grid-export/staff-audit-client-hires', () => {
  describe('when accessing the api/locales/en/data-grid-export/staff-audit-client-hires', () => {
    it('should return correct response for staff audit client hires translation for English', () => {
      cy.request(
        '/api/locales/en/data-grid-export/staff-audit-client-hires'
      ).as('api');
      cy.get<{
        status: number;
        body: DataGridExportStaffAuditClientHiresResponse;
      }>('@api').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.header).exist;
        expect(response.body.metadata.citizenshipStatus).exist;
        expect(response.body.metadata.isPermitRequired).exist;
        expect(response.body.metadata.status).exist;
      });
    });
  });
});
