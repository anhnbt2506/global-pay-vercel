describe('api/health', () => {
  describe('when accessing the /api/health', () => {
    it('should return correct response with unknown version', () => {
      cy.request('/api/health').as('api');
      cy.get<{ status: number; body: Record<string, unknown> }>('@api').then(
        (response) => {
          expect(response.status).to.eq(200);
          expect(response.body.container).to.eq('OK');
          expect(response.body.version).to.eq('UNKNOWN');
        }
      );
    });
  });
});
