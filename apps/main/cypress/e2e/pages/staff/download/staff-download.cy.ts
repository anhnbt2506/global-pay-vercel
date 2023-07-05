import { STAFF_ADMIN } from '@fixtures/users';

describe('staff/download', () => {
  const redirectPath = '/staff/home';

  const downloadPathSuccess =
    'staff/download?filePath=export/data-grid-export-5e3p0il6-1675755914.csv';
  const downloadPathFail =
    'staff/download?filePath=export/data-grid-export-604m858m-1675756212.csv';

  describe('when accessing /download', () => {
    before(() => {
      cy.clearCookies();
      cy.login(STAFF_ADMIN);
      cy.visit(downloadPathSuccess);
    });

    it('should redirects to the staff download page', () => {
      cy.url().should('include', downloadPathSuccess);
    });
  });

  describe('when redirect to home page after download file successfully', () => {
    before(() => {
      cy.clearCookies();
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant('people/v1/file-management/get:200-success');
      cy.mocksUseRouteVariant('s3Api-download:200-success');
      cy.visit(downloadPathSuccess);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the staff/home', () => {
      cy.url().should('include', redirectPath);
    });
  });

  describe('when redirect to home page after download file failed - 404 error', () => {
    before(() => {
      cy.clearCookies();
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant('people/v1/file-management/get:404-error');
      cy.visit(downloadPathFail);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the staff/home', () => {
      cy.url().should('include', redirectPath);
    });
  });

  describe('when redirect to home page after download file failed - 403 error', () => {
    before(() => {
      cy.clearCookies();
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant('people/v1/file-management/get:403-error');
      cy.visit(downloadPathFail);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the staff/home', () => {
      cy.url().should('include', redirectPath);
    });
  });

  describe('when redirect to home page after download file failed - 500 error', () => {
    before(() => {
      cy.clearCookies();
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant('people/v1/file-management/get:500-error');
      cy.visit(downloadPathFail);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the staff/home', () => {
      cy.url().should('include', redirectPath);
    });
  });

  describe('when redirect to home page when URL does not have filePath', () => {
    before(() => {
      cy.clearCookies();
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant('people/v1/file-management/get:500-error');
      cy.visit('staff/download');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the staff/home', () => {
      cy.url().should('include', redirectPath);
    });
  });

  describe('when redirect to home page -unknown error', () => {
    before(() => {
      cy.clearCookies();
      cy.login(STAFF_ADMIN);
      cy.mocksUseRouteVariant('people/v1/file-management/get:unknown-error');
      cy.visit(downloadPathFail);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the staff/home', () => {
      cy.url().should('include', redirectPath);
    });
  });
});
