interface DataGridExportCompanyPeopleWorkforceResponse {
  header: Record<string, unknown>;
  metadata: {
    contractType: Record<string, string>;
    isPermitRequired: Record<string, string>;
  };
}

describe('api/locales/[locale]/data-grid-export/company-people-workforce', () => {
  describe('when accessing the api/locales/en/data-grid-export/company-people-workforce', () => {
    it('should return correct response for company people workforce translation for English', () => {
      cy.request(
        '/api/locales/en/data-grid-export/company-people-workforce'
      ).as('api');
      cy.get<{
        status: number;
        body: DataGridExportCompanyPeopleWorkforceResponse;
      }>('@api').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.header).exist;
        expect(response.body.metadata.isPermitRequired).exist;
      });
    });
  });
});
