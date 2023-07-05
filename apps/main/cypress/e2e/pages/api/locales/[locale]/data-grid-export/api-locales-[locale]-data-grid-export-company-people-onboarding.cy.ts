interface DataGridExportCompanyPeopleOnboardingResponse {
  header: Record<string, unknown>;
  metadata: {
    employmentType: Record<string, string>;
    status: Record<string, string>;
  };
}

describe('api/locales/[locale]/data-grid-export/company-people-onboarding', () => {
  describe('when accessing the api/locales/en/data-grid-export/company-people-onboarding', () => {
    it('should return correct response for company people onboarding translation for English', () => {
      cy.request(
        '/api/locales/en/data-grid-export/company-people-onboarding'
      ).as('api');
      cy.get<{
        status: number;
        body: DataGridExportCompanyPeopleOnboardingResponse;
      }>('@api').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.header).exist;
        expect(response.body.metadata.employmentType).exist;
        expect(response.body.metadata.status).exist;
      });
    });
  });
});
