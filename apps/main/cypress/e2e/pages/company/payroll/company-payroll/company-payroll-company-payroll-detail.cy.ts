import { testEachViewport } from 'support/utils';

import {
  mockDataAndVisitCompanyPayrollDetail,
  mockedCompanyPayrollId,
} from './config';

describe('company/payroll/company-payroll/[id]', () => {
  describe(
    'When user access to company payroll detail on mobile',
    { viewportWidth: 400, viewportHeight: 800 },
    () => {
      before(() => {
        cy.clearCookies();
        mockDataAndVisitCompanyPayrollDetail();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should redirects to the company payroll detail page', () => {
        cy.url().should(
          'include',
          `/company/payroll/company-payroll/${mockedCompanyPayrollId}`
        );
      });
    }
  );

  describe('When user access to company payroll detail', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyPayrollDetail();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the company payroll detail page', () => {
      cy.url().should(
        'include',
        `/company/payroll/company-payroll/${mockedCompanyPayrollId}`
      );
    });

    it('should display correctly of title and action buttons', () => {
      const title = 'Indonesia - Regular cycle';
      const payrollStatus = 'Draft';
      const periodTime = '1 Jun 2023 - 30 Jun 2023';

      cy.contains(title);
      cy.contains(payrollStatus);
      cy.contains(periodTime);
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-title-payrollTitle"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-title-payrollStatus"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-title-payPeriodTimeView"]'
      ).should('be.visible');

      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-actions-buttonComment"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-actions-buttonAddFile"]'
      ).should('be.visible');
    });

    it('should display correctly column of files table', () => {
      const columnNames = ['File name', 'Created at', 'Created by'];
      const firstRowData = [
        'anh-ho-chieu-fru1szgv.jpg',
        '7 Jun 2023',
        'Staff Admin Mailinator',
      ];

      columnNames.forEach((value) => cy.contains(value));
      firstRowData.forEach((value) => cy.contains(value));
    });

    it('should back to Active payroll list when click back', () => {
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-breadCrumbItems-backToActivePayrollList"]'
      ).click();

      cy.url().should('include', `/company/payroll/company-payroll?tab=draft`);
    });
  });

  describe('When user access to company payroll detail with files empty', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyPayrollDetail('files-empty');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display state empty of files table', () => {
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-files-noFile.title"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-files-noFile.description"]'
      ).should('be.visible');
    });
  });

  describe('When user access to company payroll detail with error 500 internal server error', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyPayrollDetail();
      cy.mocksUseRouteVariant(
        'fintech/v1/company-payroll/get-by-id:500-internal-server-error'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display error message', () => {
      cy.get('[data-testid="companyPayroll-companyPayrollId-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-toast-errorAlert"]'
      ).should('be.visible');
    });
  });

  describe('When user access to company payroll detail with error 500 unknown error', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyPayrollDetail();
      cy.mocksUseRouteVariant(
        'fintech/v1/company-payroll/get-by-id:500-unknown-error'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display error message', () => {
      cy.get('[data-testid="companyPayroll-companyPayrollId-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-toast-errorAlert"]'
      ).should('be.visible');
    });
  });

  describe('When user download a file', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyPayrollDetail();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should download fail 500-internal-server-error', () => {
      cy.mocksUseRouteVariant(
        'fintech/v1/file-management/get:500-internal-server-error'
      );

      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-files-iconButtonOption"]'
      )
        .last()
        .click();
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-files-buttonDownload"]'
      ).click();

      cy.get('[data-testid="companyPayroll-companyPayrollId-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-toast-errorAlert"]'
      ).should('be.visible');
    });

    it('should download fail 500-unknown-error', () => {
      cy.mocksUseRouteVariant(
        'fintech/v1/file-management/get:500-unknown-error'
      );

      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-files-iconButtonOption"]'
      )
        .last()
        .click();
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-files-buttonDownload"]'
      ).click();

      cy.get('[data-testid="companyPayroll-companyPayrollId-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-toast-errorAlert"]'
      ).should('be.visible');
    });

    it('should download success', () => {
      cy.mocksUseRouteVariant('fintech/v1/file-management/get:200-success');
      cy.mocksUseRouteVariant('s3Api-download:200-success');
      cy.intercept(
        'GET',
        'https://gp-backend-uat-private.s3.ap-southeast-1.amazonaws.com/**'
      ).as('downloadFile');

      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-files-iconButtonOption"]'
      )
        .last()
        .click();
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-files-buttonDownload"]'
      ).click();

      cy.get('[data-testid="companyPayroll-companyPayrollId-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-toast-successAlert"]'
      ).should('be.visible');
    });
  });

  describe('when add payroll file', () => {
    before(() => {
      mockDataAndVisitCompanyPayrollDetail();
      cy.mocksUseRouteVariant('s3Api-upload:200-success');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show error when no file is selected', () => {
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-actions-buttonAddFile"]'
      ).click();
      cy.wait(1_000);

      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-addPayrollFileModal-buttonSubmit"]'
      ).click();
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-addPayrollFileModal.form.payrollFiles-error"]'
      ).should('not.be.empty');
    });

    it('should allow to add and remove file', () => {
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-addPayrollFileModal.form.payrollFiles"]'
      ).attachFile(['test.pdf', 'test.csv', 'test2.pdf']);

      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-addPayrollFileModal.form.payrollFiles-fileListItem.0-buttonRemove"]'
      ).click();
    });

    it('should show error icon when upload file failed', () => {
      cy.mocksUseRouteVariant('fintech/v1/file-management/upload:403-error');
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-addPayrollFileModal-buttonSubmit"]'
      ).click();
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-addPayrollFileModal.form.payrollFiles-fileListItem.0-errorIcon"]'
      ).should('be.visible');
    });

    it('should show error toast when add payroll file failed', () => {
      cy.mocksUseRouteVariant('fintech/v1/file-management/upload:200-success');
      cy.mocksUseRouteVariant(
        'fintech/v1/company-payroll/create-company-payroll-files:403-error'
      );
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-addPayrollFileModal-buttonSubmit"]'
      ).click();

      cy.get('[data-testid="companyPayroll-companyPayrollId-toast"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companyPayroll-companyPayrollId-toast-errorAlert"]')
        .should('be.visible')
        .clickOutside();
    });

    it('should show success toast success when upload success', () => {
      cy.mocksUseRouteVariant('fintech/v1/file-management/upload:200-success');
      cy.mocksUseRouteVariant(
        'fintech/v1/company-payroll/create-company-payroll-files:200-success'
      );
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-addPayrollFileModal-buttonSubmit"]'
      ).click();
      cy.get('[data-testid="companyPayroll-companyPayrollId-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-toast-successAlert"]'
      )
        .should('be.visible')
        .clickOutside();
    });
  });

  describe('when open comment drawer', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyPayrollDetail();
      cy.mocksUseRouteVariant('fintech/v1/conversation/get-by-id:200-success');
      cy.get(
        '[data-testid="companyPayroll-companyPayrollId-actions-buttonComment"]'
      ).click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    testEachViewport('', () => {
      it('should show comment input and list of comments', () => {
        cy.get('[data-testid="conversation-box-field-content"]').should(
          'be.visible'
        );

        cy.get('[data-testid="conversation-box-comments"]').should(
          'be.visible'
        );
      });
    });

    describe('when add comment', () => {
      before(() => {
        cy.mocksUseRouteVariant('fintech/v1/conversation/comment:200-success');
        cy.mocksUseRouteVariant(
          'fintech/v1/conversation/get-by-id:200-success-replying-comment'
        );
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should display new comments added', () => {
        cy.get('[data-testid="conversation-box-field-content"]').type(
          'We have acknowledged your changes.'
        );
        cy.get('[data-testid="conversation-box-button-comment"]').click();

        cy.get('[data-testid="conversation-box-comments"]').should(
          'be.visible'
        );
      });
    });

    describe('when close comment drawer', () => {
      it('should dismiss the drawer', () => {
        cy.get(
          '[data-testid="companyPayroll-companyPayrollId-payrollCommentSidebar-buttonClose"]'
        ).click();

        cy.get('[data-testid="conversation-box-field-content"]').should(
          'not.exist'
        );
      });
    });
  });
});
