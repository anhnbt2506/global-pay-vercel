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

  describe('when create new hire country POM SG', () => {
    const mocksApiAndSelectCountry = () => {
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
      ).type('singapore');
      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
    };

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    describe('when access the SG country pom form', () => {
      before(() => {
        mocksApiAndSelectCountry();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show correct SG country pom form', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-payrollCycle"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-payrollCutOffDate"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-payrollDate"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-prorateSalaryFormula"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-cpfFilingNumber"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-cpfSubmissionPlatform"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-cpfPaymentMode"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-isAypAssistESubmission"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-isUsingDisbursementService"]'
        ).should('be.visible');
      });

      it('should close modal', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-button-close"]'
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
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-button-submit"]'
        ).click();
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-cpfFilingNumber-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-cpfSubmissionPlatform-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-cpfPaymentMode-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-isAypAssistESubmission-error"]'
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-isAypAssistESubmission-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-isUsingDisbursementService-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-payrollCycle-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-payrollCutOffDate-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-payrollDate-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-prorateSalaryFormula-error"]'
        ).should('be.visible');
      });
    });

    describe('when submit all initial display view', () => {
      before(() => {
        mocksApiAndSelectCountry();
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/create-country-service:200-success'
        );
      });

      it('should create successfully SG pom', () => {
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-payrollCycle',
          'MONTHLY'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-payrollCutOffDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-payrollDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-prorateSalaryFormula',
          'WORKING_DAYS'
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-cpfFilingNumber"]'
        )
          .type('123453')
          .find('input')
          .should('have.value', '123453');

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-cpfSubmissionPlatform',
          'CPF_EZPAY'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-cpfPaymentMode',
          'DIRECT_DEBIT_COMPANY'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-isAypAssistESubmission',
          '0'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-isUsingDisbursementService',
          '1'
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-button-submit"]'
        ).click();

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click();
        // TODO: need to adjust test cases for steps 2, 3, 4
      });
    });

    describe('when already submit hire country POM SG', () => {
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
        ).type('singapore');
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
          ).attachFile('company-people-onboarding-pom-sg.csv');

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
            'people/v1/worker-employment/csv-template:200-success-sg'
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
          ).attachFile('company-people-onboarding-pom-sg-row-exceeded.csv');
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
          ).attachFile('company-people-onboarding-pom-sg.csv');
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
          cy.get(
            '[data-testid="companyPeopleOnboardingCreate-toast-errorAlert"]'
          )
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

        it('should clear row highlight after edit data', () => {
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
          cy.typeAutocompleteClickOptionIndex(
            '1-WHC-countryCell',
            'Singapore',
            0
          );

          cy.get('[data-testId="1-DCC"]').scrollIntoView().dblclick();
          cy.typeAutocompleteClickOptionIndex(
            '1-DCC-dialingCodeCell',
            'Singapore',
            0
          );

          cy.get('[data-testId="1-WCSR"]').scrollIntoView().dblclick();
          cy.typeAutocompleteClickOptionIndex(
            '1-WCSR-currencyCell',
            'Singapore',
            0
          );

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
          cy.get(
            '[data-testid="companyPeopleOnboardingCreate-toast-errorAlert"]'
          )
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

    describe('when submit all additional fields', () => {
      before(() => {
        cy.mocksUseRouteVariant('people/v1/get-banks:200-success');
        mocksApiAndSelectCountry();
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/create-country-service:200-success'
        );
      });

      it('should create successfully SG pom and display notification', () => {
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-payrollCycle',
          'MONTHLY'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-payrollCutOffDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-payrollDate',
          '10'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-prorateSalaryFormula',
          'WORKING_DAYS'
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-cpfFilingNumber"]'
        )
          .type('123453')
          .find('input')
          .should('have.value', '123453');

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-cpfSubmissionPlatform',
          'CRIMSON_LOGIC'
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-crimsonLogicUsername"]'
        )
          .type('username')
          .find('input')
          .should('have.value', 'username');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-crimsonLogicPassword"]'
        )
          .type('password')
          .find('input')
          .should('have.value', 'password');

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-cpfPaymentMode',
          'DIRECT_DEBIT_COMPANY'
        );
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-isAypAssistESubmission',
          '1'
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-button-submit"]'
        )
          .scrollIntoView()
          .click();

        cy.get(
          '[data-testid="company-pom-sg-form-eSubmissionServices-error"]'
        ).should('be.visible');

        cy.get('input[type="checkbox"]')
          .check(['eSubmissionServices[0].CPF_SERVICES'])
          .should('be.checked');

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-isUsingDisbursementService',
          '0'
        );

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-field-isGenerateBankFile',
          '0'
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-SG-button-submit"]'
        ).click();
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        ).click();
        // TODO: need to adjust test cases for steps 2, 3, 4
      });
    });
  });
});
