import {
  getSelectFieldClickOption,
  visitCompanyPeopleOnboardingPageAndSelectPOM,
} from './config';

describe('company/people/onboarding/create', () => {
  after(() => {
    cy.mocksRestoreBaseCollection();
  });
  describe('when accessing company/people/onboarding/create and select POM', () => {
    before(() => {
      cy.clearCookies();
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      visitCompanyPeopleOnboardingPageAndSelectPOM();
    });

    it('should redirects to the company /company/people/onboarding/create page', () => {
      cy.url().should('include', '/company/people/onboarding/create');
    });

    it('should contain correct page metadata', () => {
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-field-country"]'
      ).should('be.visible');
    });
  });

  describe(
    'when accessing company/people/onboarding/create and select POM on mobile',
    { viewportWidth: 400, viewportHeight: 800 },
    () => {
      before(() => {
        cy.clearCookies();
        cy.signInCompanyAndMockPeopleOnboardingCollection(true);
        visitCompanyPeopleOnboardingPageAndSelectPOM();
      });

      it('should redirects to the company /company/people/onboarding/create page', () => {
        cy.url().should('include', '/company/people/onboarding/create');
      });

      it('should contain correct page metadata', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-field-country"]'
        ).should('be.visible');
      });
    }
  );

  describe('when create new hire country POM VN', () => {
    const mocksApiAndSelectCountry = () => {
      cy.clearCookies();
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/check:200-success-has-not-submitted'
      );
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/create-country-service:200-success'
      );
      cy.mocksUseRouteVariant(
        'people/v1/file-management:200-upload-file-success'
      );
      cy.mocksUseRouteVariant('s3Api-upload:200-success');

      visitCompanyPeopleOnboardingPageAndSelectPOM();

      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-field-country"]'
      ).type('vietnam');
      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
    };
    describe('when access POM form', () => {
      before(() => {
        mocksApiAndSelectCountry();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show correct VN country pom form', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-payrollCycle"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-payrollCutOffDate"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-payrollDate"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-prorateSalaryFormula"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-shuiCode"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-shuiProvider"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-isAypAssistESubmission"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-isUsingDisbursementService"]'
        )
          .scrollIntoView()
          .should('be.visible');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-button-close"]'
        ).click();
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-field-country"]'
        ).should('be.visible');
      });
    });

    describe('when clicking submit button without filling data', () => {
      before(() => {
        mocksApiAndSelectCountry();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show errors', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-button-submit"]'
        ).click();
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-payrollCycle-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-payrollCutOffDate-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-payrollDate-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-prorateSalaryFormula-error"]'
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-shuiCode-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-shuiProvider-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-isAypAssistESubmission-error"]'
        )
          .scrollIntoView()
          .should('be.visible');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-isUsingDisbursementService-error"]'
        )
          .scrollIntoView()
          .should('be.visible');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-businessLicenceFile-error"]'
        )
          .scrollIntoView()
          .should('be.visible');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-payrollReportFile-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-pitReportSinceQ1File-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-pitReportLastYearFile-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-shuiReportFile-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-labourContractsFile-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
      });
    });

    describe('when submit all initial display view', () => {
      before(() => {
        mocksApiAndSelectCountry();
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/create-country-service:200-success'
        );
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should create successfully VN pom', () => {
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-payrollCycle',
          'MONTHLY'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-payrollCutOffDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-payrollDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-prorateSalaryFormula',
          'WORKING_DAYS'
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-shuiCode"]'
        )
          .type('12345')
          .find('input')
          .should('have.value', '12345');

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-shuiProvider',
          'TS24'
        );

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-isAypAssistESubmission',
          '0'
        );

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-isUsingDisbursementService',
          '1'
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-businessLicenceFile"]'
        ).attachFile('test.pdf');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-payrollReportFile"]'
        ).attachFile('test.pdf');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-pitReportSinceQ1File"]'
        ).attachFile('test.pdf');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-pitReportLastYearFile"]'
        ).attachFile('test.pdf');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-shuiReportFile"]'
        )
          .scrollIntoView()
          .attachFile('test.pdf');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-labourContractsFile"]'
        ).attachFile('test.pdf');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-button-submit"]'
        ).click({ force: true });
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click({ force: true });
        // TODO: need to adjust test cases for steps 2, 3, 4
      });
    });

    describe('when submit all additional fields', () => {
      before(() => {
        cy.mocksUseRouteVariant('people/v1/get-banks:200-success');
        mocksApiAndSelectCountry();
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/create-country-service:200-success'
        );
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should create successfully VN pom and display notification', () => {
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-payrollCycle',
          'MONTHLY'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-payrollCutOffDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-payrollDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-prorateSalaryFormula',
          'WORKING_DAYS'
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-shuiCode"]'
        )
          .type('12345')
          .find('input')
          .should('have.value', '12345');

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-shuiProvider',
          'TS24'
        );

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-isAypAssistESubmission',
          '1'
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-shuiUserId"]'
        )
          .type('shuiUserId')
          .find('input')
          .should('have.value', 'shuiUserId');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-shuiPassword"]'
        )
          .type('shuiPassword')
          .find('input')
          .should('have.value', 'shuiPassword');

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-isUsingDisbursementService',
          '0'
        );

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-isGenerateBankFile',
          '1'
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-bankAccount-beneficiaryName"]'
        )
          .type('TPBank')
          .find('input')
          .should('have.value', 'TPBank');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-bankAccount-accountNumber"]'
        )
          .type('123456')
          .find('input')
          .should('have.value', '123456');

        cy.typeAutocompleteClickOptionIndex(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-bankAccount-bank',
          'Bank 01',
          0
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-bankAccount-branchCode"]'
        )
          .type('123456')
          .find('input')
          .should('have.value', '123456');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-businessLicenceFile"]'
        ).attachFile('test.pdf');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-payrollReportFile"]'
        ).attachFile('test.pdf');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-pitReportSinceQ1File"]'
        ).attachFile('test.pdf');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-pitReportLastYearFile"]'
        ).attachFile('test.pdf');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-shuiReportFile"]'
        ).attachFile('test.pdf');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-field-labourContractsFile"]'
        ).attachFile('test.pdf');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-VN-button-submit"]'
        ).click({ force: true });
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click({ force: true });
        // TODO: need to adjust test cases for steps 2, 3, 4
      });
    });
  });

  describe('when already submit hire country POM VN', () => {
    before(() => {
      cy.clearCookies();
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/check:200-success-has-submitted'
      );
      cy.mocksUseRouteVariant('people/v1/get-banks:200-success');

      visitCompanyPeopleOnboardingPageAndSelectPOM();

      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-field-country"]'
      ).type('vietnam');
      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    describe('when get csv template fail', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/csv-template:404-not-found-error'
        );
      });

      it('should show unknown error', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-field-country"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click();

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-onboard-employees-file"]'
        ).attachFile('company-people-onboarding-pom-vn.csv');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click();

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-onboard-employees-file-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-toast-errorAlert"]'
        ).should('be.visible');
      });
    });

    describe('when get csv template success', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/csv-template:200-success-vn'
        );
      });

      it('should show error when upload file with column is not supported,', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-onboard-employees-file-error"]'
        ).should('be.visible');
      });

      it('should show error when upload file has more than supported rows,', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-onboard-employees-file"]'
        ).attachFile('company-people-onboarding-pom-vn-row-exceeded.csv');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click();

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-onboard-employees-file-error"]'
        ).should('be.visible');
      });

      it('should upload file success and move to step 3', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-onboard-employees-file"]'
        ).attachFile('company-people-onboarding-pom-vn.csv');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click();

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-title"]'
        ).should('be.visible');
      });
    });

    describe('when validate an invalid csv in step 3', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/validate:200-fail'
        );
      });

      it('should show error toast', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click();

        cy.get('[data-testid="companyPeopleOnboardingCreate-toast"]').should(
          'be.visible'
        );
        cy.get('[data-testid="companyPeopleOnboardingCreate-toast-errorAlert"]')
          .should('be.visible')
          .clickOutside();
      });

      it('should highlight invalid row', () => {
        cy.get('[data-id="1"][role="row"]').should(
          'have.class',
          'gridRowError'
        );
      });

      it('should show error tooltip', () => {
        cy.get('[data-testid="1-WFN-errorTooltip"]').click();
      });

      it('should should clear row highlight after edit data', () => {
        cy.get('[data-testid="1-WFN"]').dblclick();
        cy.get('[data-testid="1-WFN-stringCell"]')
          .clear()
          .find('input')
          .type('test')
          .clickOutside();

        cy.get('[data-id="1"][role="row"]').should(
          'not.have.class',
          'gridRowError'
        );
      });
    });

    describe('when validate a valid csv in step 3', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/validate:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/bulk-upload:200-success'
        );
      });

      it('should change data in custom fields in DataGrid', () => {
        cy.get('[data-testId="1-WHC"]').dblclick();
        cy.typeAutocompleteClickOptionIndex('1-WHC-countryCell', 'Vietnam', 0);

        cy.get('[data-testId="1-DCC"]').scrollIntoView().dblclick();
        cy.typeAutocompleteClickOptionIndex(
          '1-DCC-dialingCodeCell',
          'Vietnam',
          0
        );

        cy.get('[data-testId="1-WCSR"]').scrollIntoView().dblclick();
        cy.typeAutocompleteClickOptionIndex('1-WCSR-currencyCell', 'Viet', 0);

        cy.get('[data-testId="1-WFN"]').dblclick();
        cy.get('[data-testid="1-WFN-stringCell"]')
          .clear()
          .find('input')
          .type('test')
          .clickOutside();

        cy.get('[data-testId="1-WAD"]')
          .scrollIntoView()
          .dblclick({ force: true });
        cy.get('[data-testid="1-WAD-textCell-textAreaAutoSize"]')
          .click()
          .clear()
          .type('description', { force: true });
        cy.get(
          '[data-testid="1-WAD-textCell-editDialogDataGrid-update"]'
        ).click();

        cy.get('[data-testId="1-WHRW"]').scrollIntoView().dblclick();
        cy.get('[data-testid="1-WHRW-floatCell"]')
          .clear()
          .find('input')
          .type('2')
          .clickOutside();

        cy.get('[data-testId="1-WTN"]').scrollIntoView().dblclick();
        cy.get('[data-testid="1-WTN-intCell"]')
          .clear()
          .find('input')
          .type('2')
          .clickOutside();

        cy.chooseDatePickerDataGrid(
          '1-WED',
          '1-WED-dateCell-editDialogDataGrid',
          '1-WED-dateCell-editDialogDataGrid-update',
          '2'
        );

        cy.chooseTimePickerDataGrid(
          '1-WFST',
          '1-WFST-timeCell-editDialogDataGrid',
          '1-WFST-timeCell-editDialogDataGrid-update',
          '11:30'
        );

        cy.get('[data-testId="1-WRP"]').dblclick();
        cy.getSelectFieldClickOption('1-WRP-booleanCell', 0);

        cy.get('[data-testId="1-WGEN"]').scrollIntoView().dblclick();
        cy.getSelectFieldClickOption('1-WGEN-enumCell', 'MALE');

        cy.get('[data-testId="1-WES"]').scrollIntoView().dblclick();
        cy.getSelectFieldClickOption('1-WES-enumCell', 'ONBOARDED');

        cy.get('[data-testId="1-WPT"]').scrollIntoView().dblclick();
        cy.getSelectFieldClickOption('1-WPT-enumCell', 'DN_VISA');

        cy.get('[data-testId="1-WBN"]').scrollIntoView().dblclick();
        cy.typeAutocompleteClickOptionIndex('1-WBN-bankCell', 'Bank 01', 0);
      });

      it('should show success toast', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click();
        cy.get('[data-testid="companyPeopleOnboardingCreate-toast"]').should(
          'be.visible'
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-toast-successAlert"]'
        )
          .should('be.visible')
          .clickOutside();
      });
    });

    describe('when submit csv fail', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/bulk-upload:404-not-found-error'
        );
      });

      it('should should error toast', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click();
        cy.get('[data-testid="companyPeopleOnboardingCreate-toast"]').should(
          'be.visible'
        );
        cy.get('[data-testid="companyPeopleOnboardingCreate-toast-errorAlert"]')
          .should('be.visible')
          .clickOutside();
      });
    });

    describe('when submit csv success', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/bulk-upload:200-success'
        );
      });

      it('should should success screen', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click();

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-notified-message"]'
        ).should('be.visible');
      });
    });
  });

  describe('when API return error', () => {
    const mocksApiAndSelectCountry = () => {
      cy.clearCookies();
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      visitCompanyPeopleOnboardingPageAndSelectPOM();
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-field-country"]'
      ).type('thailand');
      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
    };

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    describe('when company/hire-type/POM/VN/check return InternalServerError error', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/check:500-internal-server-error'
        );
        mocksApiAndSelectCountry();
      });
      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should display InternalServerError toast message', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-toast-errorAlert"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-sidebar-title"]'
        ).click();
      });
    });

    describe('when company/hire-type/POM/VN/check return UnknownError error', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/check:400-unknown-error'
        );
        mocksApiAndSelectCountry();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should display UnknownError toast message', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-toast-errorAlert"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-sidebar-title"]'
        ).click();
      });
    });
  });
});
