import { STAFF_ADMIN } from '@fixtures/users';
import {
  mockDataAndVisitEmploymentIdOnboarded,
  mockDataAndVisitEmploymentDocumentsAddendum,
} from '../config';

const openAddFileModal = () => {
  cy.get(
    '[data-testid="staffAudit-clientHires-employmentId-iconButton-options"]'
  ).click();
  cy.get(
    '[data-testid="staffAudit-clientHires-employmentId-addAddendumFile"]'
  ).click();
};

describe('staff/audit/client-hires/[employmentId]', () => {
  describe('when access Documents tabs', () => {
    const mockedId = '123';

    const selectTabDocuments = () => {
      cy.selectMuiTab(2);
    };

    const selectReUploadDocument = () => {
      cy.get('[data-testid="fileManagement-table-itemOptions"]')
        .first()
        .scrollIntoView()
        .click();
      cy.get(`[data-testid="fileManagement-table-reUpload"]`).click();
    };

    const selectDownloadDocument = () => {
      cy.get('[data-testid="fileManagement-table-itemOptions"]')
        .first()
        .scrollIntoView()
        .click();
      cy.get('[data-testid="fileManagement-table-download"]').click();
    };

    describe('when get documents success', () => {
      before(() => {
        cy.clearCookies();
        mockDataAndVisitEmploymentIdOnboarded(mockedId);
        cy.mocksUseRouteVariant(
          'people/v1/file-management/get-list-employment-documents:200-success'
        );
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should change tab to documents and show list documents success', () => {
        selectTabDocuments();

        const columnNames = ['Name', 'Last modified', 'Last updated'];
        const firstRowData = [
          'Government issued passport front & back',
          '22/09/2022',
          '-',
        ];

        columnNames.forEach((name) => cy.contains(name));
        firstRowData.forEach((value) => cy.contains(value));
      });

      it('should click a folder and click breadcumb to back to previous folder', () => {
        cy.get('[data-testid="fileManagement-table-row-folder-link"]')
          .first()
          .click();
        cy.get('[data-testid="fileManagement-breadCrumbs-0"]').click();

        cy.contains('Documents');
      });
    });

    describe('when enter link of addendum folder in url and get documents success', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant(
          'people/v1/file-management/get-list-employment-documents:200-success'
        );
        mockDataAndVisitEmploymentDocumentsAddendum(mockedId);
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should change tab to documents and show list documents success', () => {
        cy.contains('Documents');

        const columnNames = ['Name', 'Last modified', 'Last updated'];
        const firstRowData = [
          'test.pdf',
          '04/07/2023',
          'Staff Admin AYP Group',
        ];

        columnNames.forEach((name) => cy.contains(name));
        firstRowData.forEach((value) => cy.contains(value));
      });

      // TODO: should hide action menu re-upload in folder addendum
    });

    describe('when in documents tab and click add file', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant(
          'people/v1/file-management/get-list-employment-documents:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/get-by-employment-id:200-worker-onboarded-status-success'
        );
        cy.mocksUseRouteVariant('people/v1/get-banks:200-success');
        cy.login(STAFF_ADMIN);
        cy.visit(
          `/staff/audit/client-hires/${mockedId}?tab=documents&folder=documents`
        );
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show toast message about client addendum', () => {
        openAddFileModal();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-toast-errorAlert"]'
        ).should('be.visible');
        cy.contains('You can only upload files to the Addendum folder').should(
          'be.visible'
        );
      });

      // TODO: should hide action menu re-upload in folder addendum
    });

    describe('when enter link of addendum folder in url and get documents success', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant(
          'people/v1/file-management/get-list-employment-documents:200-success'
        );
        mockDataAndVisitEmploymentDocumentsAddendum(mockedId);
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should change tab to documents and show list documents success', () => {
        cy.contains('Documents');

        const columnNames = ['Name', 'Last modified', 'Last updated'];
        const firstRowData = [
          'test.pdf',
          '04/07/2023',
          'Staff Admin AYP Group',
        ];

        columnNames.forEach((name) => cy.contains(name));
        firstRowData.forEach((value) => cy.contains(value));
        openAddFileModal();
      });

      it('should show modal add file and close it', () => {
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-addAddendumFileModal-buttonCancel"]'
        ).click();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-addAddendumFileModal-buttonCancel"]'
        ).should('not.exist');
      });

      it('should show error in upload field', () => {
        openAddFileModal();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-addAddendumFileModal-buttonSubmit"]'
        ).click();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-addAddendumFileModal.form.addendumFiles-error"]'
        ).should('not.be.empty');
      });

      it('should allow to add and remove file', () => {
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-addAddendumFileModal.form.addendumFiles"]'
        ).attachFile(['test.pdf', 'test.csv', 'test2.pdf']);

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-addAddendumFileModal.form.addendumFiles-fileListItem.0-buttonRemove"]'
        ).click();
      });

      it('should show error icon when upload file failed', () => {
        cy.mocksUseRouteVariant(
          'people/v1/file-management/upload:500-internal-server-error'
        );
        cy.mocksUseRouteVariant('s3Api-upload:404-not-found');

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-addAddendumFileModal-buttonSubmit"]'
        ).click();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-toast-errorAlert"]'
        ).should('be.visible');
      });

      it('should show unknown error icon when upload file failed', () => {
        cy.mocksUseRouteVariant(
          'people/v1/file-management/upload:400-unknown-error'
        );

        openAddFileModal();
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-addAddendumFileModal.form.addendumFiles"]'
        ).attachFile(['test.pdf', 'test.csv', 'test2.pdf']);
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-addAddendumFileModal-buttonSubmit"]'
        ).click();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-toast-errorAlert"]'
        ).should('be.visible');
      });
    });

    describe('when upload file get error from server', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant(
          'people/v1/file-management/get-list-employment-documents:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/file-management/upload:200-upload-file-success'
        );
        mockDataAndVisitEmploymentDocumentsAddendum(mockedId);
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show unknown error icon when upload file failed', () => {
        openAddFileModal();
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-addAddendumFileModal.form.addendumFiles"]'
        ).attachFile(['test.pdf', 'test.csv', 'test2.pdf']);
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-addAddendumFileModal-buttonSubmit"]'
        ).click();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-toast-errorAlert"]'
        ).should('be.visible');
      });
    });

    describe('when upload files success', () => {
      before(() => {
        cy.clearCookies();
        cy.mocksUseRouteVariant(
          'people/v1/file-management/get-list-employment-documents:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/file-management:200-upload-file-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/patch:200-success'
        );
        cy.mocksUseRouteVariant('s3Api-upload:200-success');
        mockDataAndVisitEmploymentDocumentsAddendum(mockedId);
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show toast message and success', () => {
        openAddFileModal();
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-addAddendumFileModal.form.addendumFiles"]'
        ).attachFile(['test.pdf', 'test.csv', 'test2.pdf']);
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-addAddendumFileModal.form.comment"]'
        ).clear();
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-addAddendumFileModal-buttonSubmit"]'
        ).click();

        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-addAddendumFileModal.form.comment"]'
        ).type('test comment');
        cy.get(
          '[data-testid="staffAudit-clientHires-employmentId-addAddendumFileModal-buttonSubmit"]'
        ).click();
      });
    });

    describe('when get documents failed - 500-internal-server-error', () => {
      before(() => {
        cy.clearCookies();
        mockDataAndVisitEmploymentIdOnboarded(mockedId);
        cy.mocksUseRouteVariant(
          'people/v1/file-management/get-list-employment-documents:500-internal-server-error'
        );
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show toast error message when get list documents failed', () => {
        selectTabDocuments();

        cy.get('[data-testid="fileManagement-toast"]').should('be.visible');
        cy.get('[data-testid="fileManagement-toast-errorAlert"]').should(
          'be.visible'
        );
        cy.get(
          '[data-testid="fileManagement-toast-errorAlert"]'
        ).clickOutside();
      });
    });

    describe('when get documents failed - 400-unknown-error', () => {
      before(() => {
        cy.clearCookies();
        mockDataAndVisitEmploymentIdOnboarded(mockedId);
        cy.mocksUseRouteVariant(
          'people/v1/file-management/get-list-employment-documents:400-unknown-error'
        );
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show toast error message when get list documents failed', () => {
        selectTabDocuments();

        cy.get('[data-testid="fileManagement-toast"]').should('be.visible');
        cy.get('[data-testid="fileManagement-toast-errorAlert"]').should(
          'be.visible'
        );
        cy.get(
          '[data-testid="fileManagement-toast-errorAlert"]'
        ).clickOutside();
      });
    });

    describe('when re-upload document', () => {
      before(() => {
        cy.clearCookies();
        mockDataAndVisitEmploymentIdOnboarded(mockedId);
        cy.mocksUseRouteVariant(
          'people/v1/file-management/get-list-employment-documents:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/file-management:200-upload-file-success'
        );
        selectTabDocuments();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should display re-upload modal and close when click button cancel', () => {
        selectReUploadDocument();

        cy.get(
          '[data-testid="fileManagement-table-reUploadModal-title"]'
        ).should('be.visible');

        cy.get(
          '[data-testid="fileManagement-table-reUploadModal-buttonCancel"]'
        ).click();
      });

      it('should show toast success when upload success', () => {
        cy.mocksUseRouteVariant('s3Api-upload:200-success');
        selectReUploadDocument();
        cy.get(
          '[data-testid="fileManagement-table-reUploadModal-reUploadFile"]'
        ).attachFile('test.pdf');
        cy.get(
          '[data-testid="fileManagement-table-reUploadModal-buttonUpdate"]'
        ).click();

        cy.get('[data-testid="fileManagement-toast"]').should('be.visible');
        cy.get('[data-testid="fileManagement-toast-successAlert"]').should(
          'be.visible'
        );
        cy.get(
          '[data-testid="fileManagement-toast-successAlert"]'
        ).clickOutside();
      });

      it('should show toast success when upload failed - 404-not-found', () => {
        cy.mocksUseRouteVariant('s3Api-upload:404-not-found');
        selectReUploadDocument();
        cy.get(
          '[data-testid="fileManagement-table-reUploadModal-reUploadFile"]'
        ).attachFile('test.pdf');
        cy.get(
          '[data-testid="fileManagement-table-reUploadModal-buttonUpdate"]'
        ).click();

        cy.get('[data-testid="fileManagement-toast"]').should('be.visible');
        cy.get('[data-testid="fileManagement-toast-errorAlert"]').should(
          'be.visible'
        );
        cy.get(
          '[data-testid="fileManagement-toast-errorAlert"]'
        ).clickOutside();
      });
    });

    describe('when action download file', () => {
      before(() => {
        cy.clearCookies();
        mockDataAndVisitEmploymentIdOnboarded(mockedId);
        cy.mocksUseRouteVariant(
          'people/v1/file-management/get-list-employment-documents:200-success'
        );
        cy.mocksUseRouteVariant('people/v1/file-management/get:200-success');
        cy.mocksUseRouteVariant('s3Api-download:200-success');
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should download document when click on download icon then call the api s3 to download file', () => {
        cy.intercept(
          'GET',
          'https://gp-backend-uat-private.s3.ap-southeast-1.amazonaws.com/**'
        ).as('downloadFile');
        selectTabDocuments();
        selectDownloadDocument();
        cy.wait('@downloadFile');
        cy.get('@downloadFile').then((xhr) => {
          expect(xhr['request'].method).eq('GET');
          expect(xhr['request'].url).contains(
            'gp-backend-uat-private.s3.ap-southeast-1.amazonaws.com'
          );
        });
      });
    });
  });
});
