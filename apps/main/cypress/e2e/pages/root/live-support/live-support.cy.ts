describe('live-support', () => {
  describe('when accessing /live-support', () => {
    before(() => {
      cy.visit('/live-support');
    });

    it('should redirects to the live-support page', () => {
      cy.url().should('include', '/live-support');
    });

    it('should contains correct page metadata', () => {
      cy.get('[data-testid="liveSupport-title"]').should('be.visible');
      cy.get('[data-testid="liveSupport-description"]').should('be.visible');
      cy.get('[data-testid="liveSupport-freepik"]').should('be.visible');
      cy.get('[data-testid="liveSupport-image"]').should('be.visible');
    });
  });

  describe(
    'when accessing /live-support on mobile',
    { viewportWidth: 400, viewportHeight: 800 },
    () => {
      before(() => {
        cy.visit('/live-support');
      });

      it('should redirects to the live-support page', () => {
        cy.url().should('include', '/live-support');
      });

      it('should correct css of layout', () => {
        cy.get('[data-testid="liveSupport-layoutText"]').should(
          'have.css',
          'order',
          '2'
        );
        cy.get('[data-testid="liveSupport-layoutImage"]').should(
          'have.css',
          'order',
          '1'
        );
      });
    }
  );
});
