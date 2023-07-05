import {
  editBankAndSubmitForm,
  mockDataAndVisitCompanyDetail,
  mockedCompanyId,
  selectHireTypeAndCountry,
} from './config';

describe('Staff Audit Client List Company Service Details', () => {
  describe('show data only Staff Audit Client List Company Service Details', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/update-service:200-success'
      );
      mockDataAndVisitCompanyDetail();
      cy.selectMuiTab(2);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open and close modal', () => {
      cy.get(
        '[data-testid="staffAuditClientList-companyId-serviceDetail.service-button-edit"]'
      ).click();
      cy.get(
        '[data-testid="staffAuditClientList-companyId-serviceDetail-updateService-cancelButton"]'
      ).click();
    });

    it('should show the details of company without edit icon', () => {
      cy.url().should('include', `/staff/audit/client-list/${mockedCompanyId}`);
      selectHireTypeAndCountry('POM', 'Vietnam', false);
      const columnName = [
        'Bank Account Name',
        'Bank Account Number',
        'Branch Code',
      ];
      const columnValue = ['-', '-', '-', '-'];
      columnName.forEach((column) =>
        cy.contains(column).scrollIntoView().should('be.visible')
      );
      columnValue.forEach((value) =>
        cy.contains(value).scrollIntoView().should('be.visible')
      );
    });
  });

  describe('show data only Staff Audit Client List Company Service Details in case some null data', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/update-service:200-success-null-data'
      );
      mockDataAndVisitCompanyDetail();
      cy.selectMuiTab(2);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open and close modal', () => {
      cy.get(
        '[data-testid="staffAuditClientList-companyId-serviceDetail.service-button-edit"]'
      ).click();
      cy.get(
        '[data-testid="staffAuditClientList-companyId-serviceDetail-updateService-cancelButton"]'
      ).click();
    });

    it('should show the details of company without edit icon', () => {
      cy.url().should('include', `/staff/audit/client-list/${mockedCompanyId}`);
      selectHireTypeAndCountry('POM', 'Vietnam', false);
      const columnName = [
        'Bank Account Name',
        'Bank Account Number',
        'Branch Code',
      ];
      const columnValue = ['-', '-', '-'];
      columnName.forEach((column) =>
        cy.contains(column).scrollIntoView().should('be.visible')
      );
      columnValue.forEach((value) =>
        cy.contains(value).scrollIntoView().should('be.visible')
      );
    });
  });

  describe('No information has submitted by client for this country', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/update-service:404-not-found'
      );
      mockDataAndVisitCompanyDetail();
      cy.selectMuiTab(2);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show the details of company with edit icon after edit show the success toast message', () => {
      selectHireTypeAndCountry('POM', 'vietnam', false);
      cy.get(
        '[data-testid="staffAuditClientList-companyId-serviceDetail-updateService.field.country-error"]'
      ).should('be.visible');
    });
  });

  describe('Password entered is incorrect', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/update-service:403-forbidden'
      );
      mockDataAndVisitCompanyDetail();
      cy.selectMuiTab(2);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show the details of company with edit icon after edit show the success toast message', () => {
      selectHireTypeAndCountry('POM', 'Vietnam', true);
    });
  });

  describe('show 400-unknown-error Staff Audit Client List Company Service Details ', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/update-service:400-unknown-error'
      );
      mockDataAndVisitCompanyDetail();
      cy.selectMuiTab(2);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show the details of company with edit icon after edit show the success toast message', () => {
      selectHireTypeAndCountry('POM', 'Vietnam', false);
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast-errorAlert"]'
      ).should('be.visible');
    });
  });

  describe('show data and editable Staff Audit Client List Company Service Details', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/update-service:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/get-banks:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/update-service-details:200-success'
      );
      mockDataAndVisitCompanyDetail();
      cy.selectMuiTab(2);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open and close modal', () => {
      selectHireTypeAndCountry('POM', 'Vietnam', true);
      cy.get(
        '[data-testid="staffAuditClientList-companyId-serviceDetail.details-button-edit"]'
      )
        .should('be.visible')
        .click();
      cy.get(
        '[data-testid="companyPeopleOnboardingUpdate-bulkUploadMode-pom-VN-button-close"]'
      )
        .scrollIntoView()
        .click();

      cy.get(
        '[data-testid="companyPeopleOnboardingUpdate-bulkUploadMode-pom-VN-button-close"]'
      ).should('not.exist');
    });
  });

  describe('show data and editable Staff Audit Client List Company Service Details', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/update-service:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/get-banks:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/update-service-details:200-success'
      );
      mockDataAndVisitCompanyDetail();
      cy.selectMuiTab(2);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show the details of company with edit icon after edit show the success toast message', () => {
      selectHireTypeAndCountry('POM', 'Vietnam', true);
      editBankAndSubmitForm('VN');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast-successAlert"]'
      ).should('be.visible');
    });
  });

  describe('show data and editable Staff Audit Client List Company Service Details with 500-internal-server-error', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/update-service:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/get-banks:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/update-service-details:500-internal-server-error'
      );
      mockDataAndVisitCompanyDetail();
      cy.selectMuiTab(2);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show the details of company with edit icon after edit show the error toast message', () => {
      selectHireTypeAndCountry('POM', 'vietnam', true);
      editBankAndSubmitForm('VN');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast-errorAlert"]'
      ).should('be.visible');
    });
  });

  describe('show data and editable Staff Audit Client List Company Service Details with 400-unknown-error', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/update-service:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/get-banks:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/update-service-details:400-unknown-error'
      );
      mockDataAndVisitCompanyDetail();
      cy.selectMuiTab(2);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show the details of company with edit icon after edit show the error toast message', () => {
      selectHireTypeAndCountry('POM', 'vietnam', true);
      editBankAndSubmitForm('VN');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast-errorAlert"]'
      ).should('be.visible');
    });
  });
});
