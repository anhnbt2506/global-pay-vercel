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

    after(() => {
      cy.mocksRestoreRouteVariants();
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

      after(() => {
        cy.mocksRestoreRouteVariants();
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

  describe('when create new hire country POM MY', () => {
    const mockApiAndSelectCountry = () => {
      cy.clearCookies();
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/check:200-success-has-not-submitted'
      );
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/create-country-service:200-success'
      );
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);

      visitCompanyPeopleOnboardingPageAndSelectPOM();

      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-field-country"]'
      )
        .click()
        .type('malaysia');
      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
    };

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    describe('when access MY country pom form', () => {
      before(() => {
        mockApiAndSelectCountry();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show correct MY country pom form', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-payrollCycle"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-payrollCutOffDate"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-payrollDate"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-prorateSalaryFormula"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-epfNumber"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-socsoNumber"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-eisNumber"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-isAypAssistESubmission"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-isUsingDisbursementService"]'
        ).should('be.visible');
      });
    });

    describe('when access MY country pom form', () => {
      before(() => {
        mockApiAndSelectCountry();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should close modal', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-button-close"]'
        ).click();
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-field-country"]'
        ).should('be.visible');
      });
    });

    describe('when clicking submit button without filling data', () => {
      before(() => {
        mockApiAndSelectCountry();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show errors', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-button-submit"]'
        ).click();
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-epfNumber-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-socsoNumber-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-eisNumber-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-isAypAssistESubmission-error"]'
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-isAypAssistESubmission-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-isUsingDisbursementService-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-payrollCycle-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-payrollCutOffDate-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-payrollDate-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-prorateSalaryFormula-error"]'
        ).should('be.visible');
      });
    });

    describe('when submit all initial display view', () => {
      before(() => {
        mockApiAndSelectCountry();
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/create-country-service:200-success'
        );
      });

      it('should create successfully MY pom', () => {
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-payrollCycle',
          'MONTHLY'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-payrollCutOffDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-payrollDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-prorateSalaryFormula',
          '26_DAYS'
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-epfNumber"]'
        )
          .type('123453')
          .find('input')
          .should('have.value', '123453');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-socsoNumber"]'
        )
          .type('123453')
          .find('input')
          .should('have.value', '123453');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-eisNumber"]'
        )
          .type('123453')
          .find('input')
          .should('have.value', '123453');
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-isAypAssistESubmission',
          '0'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-isUsingDisbursementService',
          '1'
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-button-submit"]'
        ).click();

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click();
        // TODO: need to adjust test cases for steps 2, 3, 4
      });
    });

    describe('when submit all additional fields', () => {
      before(() => {
        cy.mocksUseRouteVariant('people/v1/get-banks:200-success');
        mockApiAndSelectCountry();
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/create-country-service:200-success'
        );
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should create successfully MY pom and display notification', () => {
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-payrollCycle',
          'MONTHLY'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-payrollCutOffDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-payrollDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-prorateSalaryFormula',
          '26_DAYS'
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-epfNumber"]'
        )
          .type('123453')
          .find('input')
          .should('have.value', '123453');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-socsoNumber"]'
        )
          .type('123453')
          .find('input')
          .should('have.value', '123453');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-eisNumber"]'
        )
          .type('123453')
          .find('input')
          .should('have.value', '123453');
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-isAypAssistESubmission',
          '1'
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-socsoEmail"]'
        )
          .type('example@gmail.com')
          .find('input')
          .should('have.value', 'example@gmail.com');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-socsoPassword"]'
        )
          .type('password')
          .find('input')
          .should('have.value', 'password');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-epfUserId"]'
        )
          .type('userEpfId')
          .find('input')
          .should('have.value', 'userEpfId');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-epfPassword"]'
        )
          .type('password')
          .find('input')
          .should('have.value', 'password');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-cp39UserId"]'
        )
          .type('usernameCP')
          .find('input')
          .should('have.value', 'usernameCP');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-cp39Password"]'
        )
          .type('passwordCP')
          .find('input')
          .should('have.value', 'passwordCP');
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-isUsingDisbursementService',
          '0'
        );

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-isGenerateBankFile',
          '1'
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-bankAccount-beneficiaryName"]'
        )
          .type('TEC2212')
          .find('input')
          .should('have.value', 'TEC2212');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-bankAccount-accountNumber"]'
        )
          .type('21321333')
          .find('input')
          .should('have.value', '21321333');

        cy.typeAutocompleteClickOptionIndex(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-bankAccount-bank',
          'Bank 01',
          0
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-bankAccount-branchCode"]'
        )
          .type('TECH2122')
          .find('input')
          .should('have.value', 'TECH2122');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-button-submit"]'
        ).click();
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click();
        // TODO: need adjust test cases for steps 2, 3, 4
      });
    });
  });

  describe('when already submit hire country POM MY', () => {
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
      ).type('Malaysia');
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
        ).attachFile('company-people-onboarding-pom-my.csv');

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
          'people/v1/worker-employment/csv-template:200-success-my'
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
        ).attachFile('company-people-onboarding-pom-my-row-exceeded.csv');
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
        ).attachFile('company-people-onboarding-pom-my.csv');
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
        cy.typeAutocompleteClickOptionIndex('1-WHC-countryCell', 'Malaysia', 0);

        cy.get('[data-testId="1-DCC"]').scrollIntoView().dblclick();
        cy.typeAutocompleteClickOptionIndex(
          '1-DCC-dialingCodeCell',
          'Malaysia',
          0
        );

        cy.get('[data-testId="1-WCSR"]').scrollIntoView().dblclick();
        cy.typeAutocompleteClickOptionIndex('1-WCSR-currencyCell', 'MYR', 0);

        cy.get('[data-testId="1-WFN"]').dblclick();
        cy.get('[data-testid="1-WFN-stringCell"]')
          .clear()
          .find('input')
          .type('test')
          .clickOutside();

        cy.get('[data-testId="1-WAD"]').scrollIntoView().dblclick();
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
        cy.getSelectFieldClickOption('1-WPT-enumCell', 'EMPLOYMENT_PASS');

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
    const mockApiAndSelectCountry = () => {
      cy.clearCookies();
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      visitCompanyPeopleOnboardingPageAndSelectPOM();
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-field-country"]'
      )
        .click()
        .type('malaysia');

      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
    };

    describe('when company/hire-type/POM/MY/check return InternalServerError error', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/check:500-internal-server-error'
        );
        mockApiAndSelectCountry();
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

    describe('when company/hire-type/POM/MY/check return UnknownError error', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/check:400-unknown-error'
        );
        mockApiAndSelectCountry();
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

    describe('when company/hire-type/POM/MY/create-country-service return error', () => {
      const fillFormData = () => {
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-payrollCycle',
          'MONTHLY'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-payrollCutOffDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-payrollDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-prorateSalaryFormula',
          '26_DAYS'
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-epfNumber"]'
        )
          .type('123453')
          .find('input')
          .should('have.value', '123453');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-socsoNumber"]'
        )
          .type('123453')
          .find('input')
          .should('have.value', '123453');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-eisNumber"]'
        )
          .type('123453')
          .find('input')
          .should('have.value', '123453');
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-isAypAssistESubmission',
          '0'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-field-isUsingDisbursementService',
          '1'
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-MY-button-submit"]'
        ).click();
      };

      describe('when api return InternalServerError', () => {
        before(() => {
          cy.mocksUseRouteVariant(
            'people/v1/company/hire-type/check:200-success-has-not-submitted'
          );
          mockApiAndSelectCountry();
          cy.mocksUseRouteVariant(
            'people/v1/company/hire-type/create-country-service:500-internal-server-error'
          );
        });

        after(() => {
          cy.mocksRestoreRouteVariants();
        });

        it('should display InternalServerError toast message', () => {
          fillFormData();

          cy.get(
            '[data-testid="companyPeopleOnboardingCreate-toast-errorAlert"]'
          ).should('be.visible');
        });
      });

      describe('when api return InternalServerError', () => {
        before(() => {
          cy.mocksUseRouteVariant(
            'people/v1/company/hire-type/check:200-success-has-not-submitted'
          );
          mockApiAndSelectCountry();
          cy.mocksUseRouteVariant(
            'people/v1/company/hire-type/create-country-service:400-unknown-error'
          );
        });

        after(() => {
          cy.mocksRestoreRouteVariants();
        });

        it('should display UNKNOWN_ERROR_MESSAGE toast message', () => {
          fillFormData();

          cy.get(
            '[data-testid="companyPeopleOnboardingCreate-toast-errorAlert"]'
          ).should('be.visible');
        });
      });
    });
  });
});
