import { COMPANY_OWNER } from '@fixtures/users';

describe('company/download', () => {
  const redirectPath = '/company/dashboard';

  const downloadPathSuccess =
    'company/download?filePath=export/data-grid-export-5e3p0il6-1675755914.csv';
  const downloadPathFail =
    'company/download?filePath=export/data-grid-export-604m858m-1675756212.csv';

  describe('when accessing company/download', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');
      cy.login(COMPANY_OWNER);
      cy.visit(downloadPathSuccess);
    });

    it('should redirects to the staff download page', () => {
      cy.url().should('include', downloadPathSuccess);
    });
  });

  describe('when redirect to company dashboard after download file successfully', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');
      cy.login(COMPANY_OWNER);
      cy.mocksUseRouteVariant('people/v1/file-management/get:200-success');
      cy.mocksUseRouteVariant('s3Api-download:200-success');
      cy.visit(downloadPathSuccess);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the company dashboard', () => {
      cy.url().should('include', redirectPath);
    });
  });

  describe('when redirect to home page after download file failed - 404 error', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');
      cy.login(COMPANY_OWNER);
      cy.mocksUseRouteVariant('people/v1/file-management/get:404-error');
      cy.visit(downloadPathFail);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the company/dashboard', () => {
      cy.url().should('include', redirectPath);
    });
  });

  describe('when redirect to dashboard after download file failed - 403 error', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');
      cy.login(COMPANY_OWNER);
      cy.mocksUseRouteVariant('people/v1/file-management/get:403-error');
      cy.visit(downloadPathFail);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the company/dashboard', () => {
      cy.url().should('include', redirectPath);
    });
  });

  describe('when redirect to dashboard page after download file failed - 500 error', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');
      cy.login(COMPANY_OWNER);
      cy.mocksUseRouteVariant('people/v1/file-management/get:500-error');
      cy.visit(downloadPathFail);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the company/dashboard', () => {
      cy.url().should('include', redirectPath);
    });
  });

  describe('when redirect to home page when URL does not have filePath', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');
      cy.mocksUseRouteVariant('people/v1/file-management/get:500-error');
      cy.login(COMPANY_OWNER);
      cy.visit('company/download');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the company/dashboard', () => {
      cy.url().should('include', redirectPath);
    });
  });

  describe('when redirect to company/dashboard -unknown error', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/tableau/request-token:200-success');
      cy.mocksUseRouteVariant('people/v1/file-management/get:unknown-error');
      cy.login(COMPANY_OWNER);

      cy.visit(downloadPathFail);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the company/dashboard', () => {
      cy.url().should('include', redirectPath);
    });
  });
});
