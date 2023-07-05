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

  describe('when create new hire country POM HK', () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/check:200-success-has-not-submitted'
      );
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/create-country-service:200-success'
      );

      visitCompanyPeopleOnboardingPageAndSelectPOM();

      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-field-country"]'
      ).type('hong kong');
      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show correct HK country pom form', () => {
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-payrollCycle"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-payrollCutOffDate"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-payrollDate"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-prorateSalaryFormula"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-mpfProvider"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-mpfSubSchemeNumber"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-isAypAssistESubmission"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-isUsingDisbursementService"]'
      )
        .scrollIntoView()
        .should('be.visible');
    });

    it('should close modal', () => {
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-button-close"]'
      ).click();
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-field-country"]'
      ).should('be.visible');
    });

    describe('when clicking submit button without filling data', () => {
      it('should show errors', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-button-submit"]'
        ).click();
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-payrollCycle-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-payrollCutOffDate-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-payrollDate-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-prorateSalaryFormula-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-mpfProvider-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-mpfSubSchemeNumber-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-isAypAssistESubmission-error"]'
        ).should('be.visible');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-isUsingDisbursementService-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
      });
    });

    describe('when submit all initial display view', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/create-country-service:200-success'
        );
      });

      it('should create successfully HK pom', () => {
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-payrollCycle',
          'MONTHLY'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-payrollCutOffDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-payrollDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-prorateSalaryFormula',
          'WORKING_DAYS'
        );

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-mpfProvider',
          'AIA_COMPANY_TRUSTEE_LIMITED'
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-mpfSubSchemeNumber"]'
        )
          .type('12345')
          .find('input')
          .should('have.value', '12345');

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-isAypAssistESubmission',
          '0'
        );

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-isUsingDisbursementService',
          '1'
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-button-submit"]'
        ).click({ force: true });
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click({ force: true });

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-toast-errorAlert"]'
        ).should('not.exist');
      });
    });

    describe('when submit all additional fields', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/create-country-service:200-success'
        );
        cy.mocksUseRouteVariant('people/v1/get-banks:200-success');
      });

      it('should create successfully HK pom and go to onboard employees form', () => {
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-payrollCycle',
          'MONTHLY'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-payrollCutOffDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-payrollDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-prorateSalaryFormula',
          'WORKING_DAYS'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-mpfProvider',
          'AIA_COMPANY_TRUSTEE_LIMITED'
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-mpfSubSchemeNumber"]'
        )
          .type('12345')
          .find('input')
          .should('have.value', '12345');

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-isAypAssistESubmission',
          '1'
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-mpfUsername"]'
        )
          .type('mpfUsername')
          .find('input')
          .should('have.value', 'mpfUsername');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-mpfPassword"]'
        )
          .type('mpfPassword')
          .find('input')
          .should('have.value', 'mpfPassword');

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-isUsingDisbursementService',
          '0'
        );

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-isGenerateBankFile',
          '1'
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-bankAccount-beneficiaryName"]'
        )
          .type('Hong Kong')
          .find('input')
          .should('have.value', 'Hong Kong');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-bankAccount-accountNumber"]'
        )
          .type('123456')
          .find('input')
          .should('have.value', '123456');

        cy.typeAutocompleteClickOptionIndex(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-bankAccount-bank',
          'Bank 01',
          0
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-field-bankAccount-branchCode"]'
        )
          .type('123456')
          .find('input')
          .should('have.value', '123456');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-HK-button-submit"]'
        ).click({ force: true });
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click({ force: true });

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-toast-errorAlert"]'
        ).should('not.exist');
      });
    });
  });

  describe('when already submit hire country POM HK', () => {
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
      ).type('hong kong');
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

      it('should find and click button to fire ga cp_add_pom_service_step1_leave action', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-backToHiringServicesButton"]'
        )
          .should('be.visible')
          .click();
      });

      it('should select POM mode and display Payroll step view', () => {
        cy.get('[data-testid="companyPeopleOnboardingCreate-selection-POM"]')
          .should('be.visible')
          .click();

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-title"]'
        )
          .should('be.visible')
          .contains('Payroll country');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-field-country"]'
        ).should('be.visible');
      });

      it('should display correct Onboarded employee step view', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-field-country"]'
        ).type('hong kong');
        cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click();

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-title"]'
        ).should('be.visible');
      });

      it('should show unknown error', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-onboard-employees-file"]'
        ).attachFile('company-people-onboarding-pom-sg.csv');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click();

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-onboard-employees-file-error"]'
        ).should('be.visible');
        cy
          .get('[data-testid="companyPeopleOnboardingCreate-toast-errorAlert"]')
          .should('be.visible').clickOutside;
      });

      it('should find and click button to fire ga cp_add_pom_service_done_payroll action', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-backToHiringServicesButton"]'
        )
          .should('be.visible')
          .click();
      });
    });

    describe('when get csv template success', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/csv-template:200-success-hk'
        );
      });

      it('should show error when upload file with column is not supported,', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click();
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-onboard-employees-file"]'
        ).attachFile('company-people-onboarding-pom-sg.csv');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click();

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-onboard-employees-file-error"]'
        ).should('be.visible');
      });

      it('should show error when upload file has more than supported rows,', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-onboard-employees-file"]'
        ).attachFile('company-people-onboarding-pom-hk-row-exceeded.csv');
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
        ).attachFile('company-people-onboarding-pom-hk.csv');
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
        cy.typeAutocompleteClickOptionIndex('1-WHC-countryCell', 'Hong', 0);

        cy.get('[data-testId="1-WFN"]').dblclick();
        cy.get('[data-testid="1-WFN-stringCell"]')
          .clear()
          .find('input')
          .type('test')
          .clickOutside();

        cy.get('[data-testId="1-WGEN"]').scrollIntoView().dblclick();
        cy.getSelectFieldClickOption('1-WGEN-enumCell', 'MALE');

        cy.get('[data-testId="1-WRP"]').dblclick();
        cy.getSelectFieldClickOption('1-WRP-booleanCell', 0);

        cy.get('[data-testId="1-WCSR"]').scrollIntoView().dblclick();
        cy.typeAutocompleteClickOptionIndex('1-WCSR-currencyCell', 'Hong', 0);

        cy.get('[data-testId="1-DCC"]').scrollIntoView().dblclick();
        cy.typeAutocompleteClickOptionIndex('1-DCC-dialingCodeCell', 'Hong', 0);

        cy.get('[data-testId="1-WHRW"]').scrollIntoView().dblclick();
        cy.get('[data-testid="1-WHRW-floatCell"]')
          .clear()
          .find('input')
          .type('0')
          .clickOutside();

        cy.get('[data-testId="1-WTN"]').scrollIntoView().dblclick();
        cy.get('[data-testid="1-WTN-intCell"]')
          .clear()
          .find('input')
          .type('0')
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
        ).clickOutside();

        cy.get('[data-testId="1-WAD"]').scrollIntoView().dblclick();
        cy.get('[data-testid="1-WAD-textCell-textAreaAutoSize"]')
          .click()
          .clear()
          .type('description', { force: true });
        cy.get(
          '[data-testid="1-WAD-textCell-editDialogDataGrid-update"]'
        ).click();
        cy.clickOutside();

        cy.get('[data-testId="1-WES"]').scrollIntoView().dblclick();
        cy.getSelectFieldClickOption('1-WES-enumCell', 'ONBOARDED');

        cy.get('[data-testId="1-WPT"]').scrollIntoView().dblclick();
        cy.getSelectFieldClickOption(
          '1-WPT-enumCell',
          'GENERAL_EMPLOYMENT_POLICY'
        );

        cy.get('[data-testId="1-WBN"]').scrollIntoView().dblclick();
        cy.typeAutocompleteClickOptionIndex('1-WBN-bankCell', 'Bank 01', 0);
      });

      it('should show success toast', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click({ force: true });
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

      it('should redirect to people/workforce page', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click();

        cy.url().should('include', 'company/people/workforce');
      });
    });
  });

  describe('when API return error', () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      visitCompanyPeopleOnboardingPageAndSelectPOM();
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-field-country"]'
      ).type('hong kong');
      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    describe(
      'when API get hireTypes return error on mobile',
      { viewportWidth: 400, viewportHeight: 800 },
      () => {
        beforeEach(() => {
          cy.clearCookies();
          cy.signInCompanyAndMockPeopleOnboardingCollection(true);
        });

        after(() => {
          cy.mocksRestoreRouteVariants();
        });

        it('should display error toast message 404 not found', () => {
          cy.mocksUseRouteVariant(
            'people/v1/service-agreement/pom/get-by-hire-type:404-not-found'
          );

          visitCompanyPeopleOnboardingPageAndSelectPOM();
          cy.get(
            '[data-testid="companyPeopleOnboardingCreate-employmentServices-toast-errorAlert"]'
          )
            .should('be.visible')
            .clickOutside();
        });

        it('should display error toast message 500 unknown', () => {
          cy.mocksUseRouteVariant(
            'people/v1/service-agreement/pom/get-by-hire-type:500-unknown'
          );

          visitCompanyPeopleOnboardingPageAndSelectPOM();
          cy.get(
            '[data-testid="companyPeopleOnboardingCreate-employmentServices-toast-errorAlert"]'
          ).should('be.visible');
        });
      }
    );

    describe('when company/hire-type/POM/HK/check return InternalServerError error', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/check:500-internal-server-error'
        );
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

    describe('when company/hire-type/POM/HK/check return UnknownError error', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/check:400-unknown-error'
        );
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

    describe('when company/hire-type/POM/HK/create-country-service return error', () => {
      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/check:200-success-has-not-submitted'
        );
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });
    });
  });
});
