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

  describe('when create new hire country POM PH', () => {
    const fillFormData = (
      payrollCycle: string,
      isFillAllAdditionalFields?: boolean
    ) => {
      getSelectFieldClickOption(
        'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-payrollCycle',
        `${payrollCycle}`
      );

      if (payrollCycle === 'SEMI_MONTHLY') {
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-statutoryDeductions',
          'MIDDLE_OF_THE_MONTH'
        );

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-secondPayrollCutOffDate',
          '10'
        );

        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-secondPayrollDate',
          '10'
        );
      }
      getSelectFieldClickOption(
        'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-payrollCutOffDate',
        '10'
      );
      getSelectFieldClickOption(
        'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-payrollDate',
        '10'
      );
      getSelectFieldClickOption(
        'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-prorateSalaryFormula',
        'WORKING_DAYS'
      );

      getSelectFieldClickOption(
        'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-isAypAssistESubmission',
        isFillAllAdditionalFields ? '1' : '0'
      );
      getSelectFieldClickOption(
        'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-isUsingDisbursementService',
        isFillAllAdditionalFields ? '0' : '1'
      );

      if (isFillAllAdditionalFields) {
        // e-submission
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-sssUserId"]'
        )
          .type('sssUserId')
          .find('input')
          .should('have.value', 'sssUserId');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-sssPassword"]'
        )
          .type('sssPassword')
          .find('input')
          .should('have.value', 'sssPassword');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-penId"]'
        )
          .type('penId')
          .find('input')
          .should('have.value', 'penId');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-penPassword"]'
        )
          .type('penPassword')
          .find('input')
          .should('have.value', 'penPassword');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-birTinId"]'
        )
          .type('birTinId')
          .find('input')
          .should('have.value', 'birTinId');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-birUsername"]'
        )
          .type('birUsername')
          .find('input')
          .should('have.value', 'birUsername');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-birPassword"]'
        )
          .type('birPassword')
          .find('input')
          .should('have.value', 'birPassword');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-birSecurityQuestionAnswer"]'
        )
          .type('birSecurityQuestionAnswer')
          .find('input')
          .should('have.value', 'birSecurityQuestionAnswer');

        //is generate bank
        getSelectFieldClickOption(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-isGenerateBankFile',
          '1'
        );

        // bank info
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-bankAccount-beneficiaryName"]'
        )
          .type('TEC2212')
          .find('input')
          .should('have.value', 'TEC2212');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-bankAccount-accountNumber"]'
        )
          .type('21321333')
          .find('input')
          .should('have.value', '21321333');

        cy.typeAutocompleteClickOptionIndex(
          'companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-bankAccount-bank',
          'Bank 01',
          0
        );

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-bankAccount-branchCode"]'
        )
          .type('TECH2122')
          .find('input')
          .should('have.value', 'TECH2122');
      }

      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-secRegistrationFile"]'
      ).attachFile('test.pdf');
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-bir2303File"]'
      ).attachFile('test.pdf');

      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-sssFile"]'
      ).attachFile('test.pdf');

      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-penFile"]'
      ).attachFile('test.pdf');
      cy.get(
        '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-pagFile"]'
      ).attachFile('test.pdf');
    };

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
      ).type('Philippines');
      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
    };

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    describe('when access PH country pom', () => {
      before(() => {
        mocksApiAndSelectCountry();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show correct PH country pom form and close the modal', () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-payrollCycle"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-prorateSalaryFormula"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-isAypAssistESubmission"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-isUsingDisbursementService"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-button-close"]'
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
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-button-submit"]'
        ).click();
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-payrollCycle-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-prorateSalaryFormula-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-isAypAssistESubmission-error"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-isUsingDisbursementService-error"]'
        );
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-secRegistrationFile-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-bir2303File-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-sssFile-error"]'
        )
          .scrollIntoView()
          .should('be.visible');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-penFile-error"]'
        )
          .scrollIntoView()
          .should('be.visible');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-field-pagFile-error"]'
        )
          .scrollIntoView()
          .should('be.visible');
      });
    });

    describe('when already submit hire country POM PH', () => {
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
        ).type('Philippines');
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
          ).attachFile('company-people-onboarding-pom-ph.csv');

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
            'people/v1/worker-employment/csv-template:200-success-ph'
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
          ).attachFile('company-people-onboarding-pom-ph-row-exceeded.csv');
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
          ).attachFile('company-people-onboarding-pom-ph.csv');
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
          cy.typeAutocompleteClickOptionIndex(
            '1-WHC-countryCell',
            'Philippines',
            0
          );

          cy.get('[data-testId="1-DCC"]').scrollIntoView().dblclick();
          cy.typeAutocompleteClickOptionIndex(
            '1-DCC-dialingCodeCell',
            'Philippines',
            0
          );

          cy.get('[data-testId="1-WCSR"]').scrollIntoView().dblclick();
          cy.typeAutocompleteClickOptionIndex('1-WCSR-currencyCell', 'PHP', 0);

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
          cy.getSelectFieldClickOption(
            '1-WPT-enumCell',
            'ALIEN_EMPLOYMENT_PERMIT'
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

      it('should create successfully TH pom', () => {
        fillFormData('MONTHLY');

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-button-submit"]'
        )
          .scrollIntoView()
          .click({ force: true });
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        )
          .scrollIntoView()
          .click({ force: true });
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

      it('should create successfully PH pom and display notification', () => {
        fillFormData('SEMI_MONTHLY', true);

        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-company-PH-button-submit"]'
        )
          .scrollIntoView()
          .click({ force: true });
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-bulkUploadMode-pom-nextButton"]'
        )
          .scrollIntoView()
          .click({ force: true });
        // TODO: need to adjust test cases for steps 2, 3, 4
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
      ).type('Philippines');
      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
    };

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    describe('when company/hire-type/POM/PH/check return InternalServerError error', () => {
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

    describe('when company/hire-type/POM/PH/check return UnknownError error', () => {
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
