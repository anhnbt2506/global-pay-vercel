import { visitCompanyPeopleOnboardingPageAndSelectPEO } from './config';

const fillingStep0 = () => {
  cy.typeAutocompleteClickOptionIndex(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-country',
    'Hong Kong',
    0
  );
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-isHaveLegalEntity',
    '0'
  );
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
  ).click();
};

const requestAddendum = () => {
  it('should open and close request addendum modal', () => {
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-requestAddendumButton"]'
    ).click();
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal-buttonCancel"]'
    ).click();
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal-buttonCancel"]'
    ).should('not.exist');
  });

  it('should show error when submit without comment', () => {
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-requestAddendumButton"]'
    ).click();
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal-buttonSubmit"]'
    ).click();

    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal.form.comment-error"]'
    ).should('be.visible');
  });

  it('should allow to add and remove file', () => {
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal.form.addendumFiles"]'
    ).attachFile(['test.pdf', 'test.csv', 'test2.pdf']);

    cy.contains('test.csv').should('be.visible');

    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal.form.addendumFiles-fileListItem.0-buttonRemove"]'
    ).click();

    cy.contains('test.pdf').should('not.exist');
  });

  it('should show unknown error toast', () => {
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal.form.comment"]'
    ).type('test comment');
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal-buttonSubmit"]'
    ).click();

    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-toast-errorAlert"]'
    ).should('be.visible');
  });

  it('should show error from server toast', () => {
    cy.mocksUseRouteVariant(
      'people/v1/file-management:200-upload-file-success'
    );
    cy.mocksUseRouteVariant('s3Api-upload:200-success');
    cy.mocksUseRouteVariant('people/v1/worker-employment/patch:403-error');

    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-requestAddendumButton"]'
    ).click();
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal.form.addendumFiles"]'
    ).attachFile(['test.pdf', 'test.csv', 'test2.pdf']);
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal.form.comment"]'
    ).type('test comment');
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal-buttonSubmit"]'
    ).click();

    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-toast-errorAlert"]'
    ).should('be.visible');
  });

  it('should show error from server toast with undefined addendum file keys', () => {
    cy.mocksUseRouteVariant(
      'people/v1/file-management:200-upload-file-success'
    );
    cy.mocksUseRouteVariant('s3Api-upload:200-success');
    cy.mocksUseRouteVariant('people/v1/worker-employment/patch:403-error');

    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-requestAddendumButton"]'
    ).click();
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal.form.comment"]'
    ).type('test comment');
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal-buttonSubmit"]'
    ).click();

    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-toast-errorAlert"]'
    ).should('be.visible');
  });

  it('should show redirect to /company/people/onboarding', () => {
    cy.mocksUseRouteVariant('people/v1/worker-employment/sign:200-success');
    cy.mocksUseRouteVariant(
      'people/v1/file-management:200-upload-file-success'
    );
    cy.mocksUseRouteVariant('s3Api-upload:200-success');
    cy.mocksUseRouteVariant('people/v1/worker-employment/patch:200-success');

    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-requestAddendumButton"]'
    ).click();
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal.form.addendumFiles"]'
    ).attachFile(['test.pdf', 'test.csv', 'test2.pdf']);
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal.form.comment"]'
    ).type('test comment');
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal-buttonSubmit"]'
    ).click();

    cy.url().should('include', '/company/people/onboarding');
  });
};

const fillingStep1 = () => {
  cy.typeAutocompleteClickOptionIndex(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-nationality',
    'Hong Kong',
    0
  );
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-citizenshipStatus',
    'PERMIT_HOLDER'
  );
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-isWorkPermitActive',
    '0'
  );
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-isWorkPermitActive-detailedExplanation"]'
  ).should('be.visible');
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-isWorkPermitActive',
    '1'
  );
  cy.typeAutocompleteClickOptionIndex(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-currency',
    'HKD',
    0
  );
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
  ).click();
};

const fillingStep2 = (config?: { isRevalidateEmployeeId?: boolean }) => {
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-firstName"]'
  )
    .type('Thomas')
    .find('input')
    .should('have.value', 'Thomas');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-lastName"]'
  )
    .type('Vu')
    .find('input')
    .should('have.value', 'Vu');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-email"]'
  )
    .should('be.visible')
    .type('thomasvu@company.com')
    .find('input')
    .should('have.value', 'thomasvu@company.com');
  cy.wait(3_000);
  cy.typeTextEditor('description', 'Example');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-title"]'
  )
    .type('The title')
    .find('input')
    .should('have.value', 'The title');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-employeeId"]'
  )
    .should('be.visible')
    .type('S001')
    .find('input')
    .should('have.value', 'S001');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
  ).click();

  if (config?.isRevalidateEmployeeId) {
    cy.wait(1_000);

    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-previousButton"]'
    ).click();
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
    ).click();
  }
};

const fillingStep3 = (
  createDepartmentSuccess?: boolean,
  nameExistedError?: boolean
) => {
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-contractType',
    'INDEFINITE'
  );
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-endDate"]'
  ).should('not.exist');
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-contractType',
    'FIXED'
  );
  cy.chooseDatePicker(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-startDate"]',
    '1'
  );
  cy.chooseDatePicker(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-endDate"]',
    '2'
  );
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-employmentType',
    'PART_TIME'
  );
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-startAt"]'
  ).should('not.exist');
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-employmentType',
    'FULL_TIME'
  );
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-workingHoursPerWeek"]'
  )
    .type('40')
    .find('input')
    .should('have.value', '40');
  cy.chooseTimePicker(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-startAt"]',
    '09:00'
  );
  cy.chooseTimePicker(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-endAt"]',
    '18:00'
  );
  ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach((day) =>
    cy.getSelectFieldClickOption(
      `companyPeopleOnboardingCreate-guidedMode-peo-field-workerSchedule-${day}`,
      'FULL_DAY'
    )
  );
  ['saturday', 'sunday'].forEach((day) =>
    cy.getSelectFieldClickOption(
      `companyPeopleOnboardingCreate-guidedMode-peo-field-workerSchedule-${day}`,
      'OFF_DAY'
    )
  );
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-managerName"]'
  )
    .type('Manager name')
    .find('input')
    .should('have.value', 'Manager name');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-managerTitle"]'
  )
    .type('Manager title')
    .find('input')
    .should('have.value', 'Manager title');
  cy.typeAutocompleteClickOptionIndex(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-department',
    'Create',
    0
  );
  cy.get(
    '[data-testid="staffAuditClientList-companyId-departmentModal-field-name"]'
  )
    .type('technology')
    .find('input')
    .should('have.value', 'technology');
  cy.get(
    '[data-testid="staffAuditClientList-companyId-departmentModal-submitButton"]'
  ).click();

  if (createDepartmentSuccess) {
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-toast-successAlert"]'
    ).should('be.visible');
  } else if (nameExistedError) {
    cy.get(
      '[data-testid="staffAuditClientList-companyId-departmentModal-field-name-error"]'
    )
      .scrollIntoView()
      .should('be.visible');
    return;
  } else {
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-toast-errorAlert"]'
    ).should('be.visible');
  }

  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddressType',
    'COMPANY'
  );
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddress-addressLine"]'
  ).should('not.exist');
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddressType',
    'OTHERS'
  );
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddress-addressLine"]'
  )
    .type('Address line')
    .find('input')
    .should('have.value', 'Address line');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddress-city"]'
  )
    .type('City')
    .find('input')
    .should('have.value', 'City');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddress-state"]'
  )
    .type('State')
    .find('input')
    .should('have.value', 'State');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddress-postalCode"]'
  )
    .type('12000')
    .find('input')
    .should('have.value', '12000');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
  ).click();
};

const fillingStep4 = () => {
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-salaryPerMonth"]'
  )
    .type('1400')
    .find('input');
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-salaryPayableDate',
    '27'
  );
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-isEligibleForAdditionalIncome',
    '0'
  );
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-isEligibleForPaidExpenses',
    '0'
  );
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-isEntitledToOvertime',
    '0'
  );
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
  ).click();
};

const fillingStep5 = () => {
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-probationPeriod"]'
  )
    .type('60')
    .find('input')
    .should('have.value', '60');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-paidTimeOff"]'
  )
    .type('7')
    .find('input')
    .should('have.value', '7');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-sickTimeOff"]'
  )
    .type('14')
    .find('input')
    .should('have.value', '14');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-terminationNotice"]'
  )
    .type('1')
    .find('input')
    .should('have.value', '1');
  cy.getSelectFieldClickOption(
    'companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-isEligibleForInsurance',
    '0'
  );
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
  ).click();
};

const fillingStep6 = (isDocumentReference?: boolean) => {
  if (isDocumentReference) {
    cy.get(
      '[data-testid="companyPeopleOnboardingCreate-referenceDocuments-114-sd-1-uebungssatz01-m2zvwu01.pdf-button"]'
    ).click();
  }
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-isSigned"]'
  ).click();
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
  ).click();

  // completed
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-addNewHire"]'
  ).should('be.visible');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-downloadContract"]'
  ).should('be.visible');
  cy.get(
    '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-viewSummary"]'
  ).should('be.visible');
};

describe('company/people/onboarding/create', () => {
  describe('when create new hire PEO HongKong', () => {
    before(() => {
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/check:200-success-has-submitted'
      );
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/check-employee-id:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/department/selection:200-success');
      cy.mocksUseRouteVariant('people/v1/department/post:200-success');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should contain correct selections and select PEO selection', () => {
      visitCompanyPeopleOnboardingPageAndSelectPEO();
    });

    it(
      'should contain correct page metadata in mobile',
      { viewportWidth: 400, viewportHeight: 800 },
      () => {
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-title"]'
        ).should('be.visible');
      }
    );

    describe('when filling step by step', () => {
      it('should complete hiring details', () => {
        // step 0 - Classify your hire
        fillingStep0();
        // step 1 - Hiring details
        fillingStep1();
        // step 2 - Hiree details
        fillingStep2({ isRevalidateEmployeeId: true });
        // step 3 - Contract details
        fillingStep3(true);
        // step 4 - Remuneration details
        fillingStep4();
        // step 5 - Additional details salaryPayableDate
        fillingStep5();
        // step 6 - Employment contract
        fillingStep6();
      });
    });
  });

  describe('when create new hire PEO HongKong with request addendum', () => {
    before(() => {
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/check:200-success-has-submitted'
      );
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/check-employee-id:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/department/selection:200-success');
      cy.mocksUseRouteVariant('people/v1/department/post:200-success');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should contain correct selections and select PEO selection', () => {
      visitCompanyPeopleOnboardingPageAndSelectPEO();
    });

    describe('when filling step by step', () => {
      it('should complete hiring details', () => {
        // step 0 - Classify your hire
        fillingStep0();
        // step 1 - Hiring details
        fillingStep1();
        // step 2 - Hiree details
        fillingStep2();
        // step 3 - Contract details
        fillingStep3(true);
        // step 4 - Remuneration details
        fillingStep4();
        // step 5 - Additional details salaryPayableDate
        fillingStep5();
        // step 6 - Employment contract
      });
      requestAddendum();
    });
  });

  describe('when create new hire PEO HongKong failed by worker-employment/check-employee-id:200-fail', () => {
    before(() => {
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/check:200-success-has-submitted'
      );
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/check-employee-id:200-fail'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should contain correct selections and select PEO selection', () => {
      visitCompanyPeopleOnboardingPageAndSelectPEO();
    });

    describe('when filling step by step', () => {
      it('should show employee ID existed error', () => {
        // step 0 - Classify your hire
        fillingStep0();
        // step 1 - Hiring details
        fillingStep1();
        // step 2 - Hiree details
        fillingStep2();
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-employeeId-error"]'
        ).should('exist');
      });
    });
  });

  describe('when create new hire PEO HongKong failed by worker-employment/check-employee-id:400-unkown-error', () => {
    before(() => {
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/check:200-success-has-submitted'
      );
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/check-employee-id:400-unknown-error'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should contain correct selections and select PEO selection', () => {
      visitCompanyPeopleOnboardingPageAndSelectPEO();
    });

    describe('when filling step by step', () => {
      it('should show employee ID existed error', () => {
        // step 0 - Classify your hire
        fillingStep0();
        // step 1 - Hiring details
        fillingStep1();
        // step 2 - Hiree details
        fillingStep2();
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-toast"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-toast-errorAlert"]'
        )
          .should('be.visible')
          .clickOutside();
      });
    });
  });

  describe('when create new hire PEO HongKong failed by department api - department-name-existed-error', () => {
    before(() => {
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/check:200-success-has-submitted'
      );
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/check-employee-id:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/department/selection:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/department/post:400-department-name-existed-error'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should contain correct selections and select PEO selection', () => {
      visitCompanyPeopleOnboardingPageAndSelectPEO();
    });

    describe('when filling step by step', () => {
      it('should complete hiring details', () => {
        // step 0 - Classify your hire
        fillingStep0();
        // step 1 - Hiring details
        fillingStep1();
        // step 2 - Hiree details
        fillingStep2();
        // step 3 - Contract details
        fillingStep3(false, true);
      });
    });
  });

  describe('when create new hire PEO HongKong failed by department api - internal server error', () => {
    before(() => {
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/check:200-success-has-submitted'
      );
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/check-employee-id:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/department/selection:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/department/post:500-internal-server-error'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should contain correct selections and select PEO selection', () => {
      visitCompanyPeopleOnboardingPageAndSelectPEO();
    });

    describe('when filling step by step', () => {
      it('should complete hiring details', () => {
        // step 0 - Classify your hire
        fillingStep0();
        // step 1 - Hiring details
        fillingStep1();
        // step 2 - Hiree details
        fillingStep2();
        // step 3 - Contract details
        fillingStep3();
      });
    });
  });

  describe('when create new hire PEO HongKong failed by department api - unknown error', () => {
    before(() => {
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      cy.mocksUseRouteVariant(
        'people/v1/company/hire-type/check:200-success-has-submitted'
      );
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/check-employee-id:200-success'
      );
      cy.mocksUseRouteVariant('people/v1/department/selection:200-success');
      cy.mocksUseRouteVariant('people/v1/department/post:500-unknown-error');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should contain correct selections and select PEO selection', () => {
      visitCompanyPeopleOnboardingPageAndSelectPEO();
    });

    describe('when filling step by step', () => {
      it('should complete hiring details', () => {
        // step 0 - Classify your hire
        fillingStep0();
        // step 1 - Hiring details
        fillingStep1();
        // step 2 - Hiree details
        fillingStep2();
        // step 3 - Contract details
        fillingStep3();
      });
    });
  });

  describe('when visit worker employment with wrong step parameter', () => {
    before(() => {
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirect to the correct url when there is employmentId param', () => {
      cy.visit(
        '/company/people/onboarding/create?hireType=eor&mode=guided&employmentId=ual6fwu4kotvg13jb19vmtn05nt6mgh3&step=abc'
      );
      cy.url().should(
        'include',
        '/company/people/onboarding/create?hireType=eor&mode=guided&step=0'
      );
    });

    it('should redirect to the correct url when there is no employmentId param', () => {
      cy.visit(
        '/company/people/onboarding/create?hireType=eor&mode=guided&step=abc'
      );
      cy.url().should(
        'include',
        '/company/people/onboarding/create?hireType=eor&mode=guided&step=0'
      );
    });
  });

  describe('when edit an existing hire PEO HongKong and not able to fetch worker employment', () => {
    before(() => {
      cy.signInCompanyAndMockPeopleOnboardingCollection(true);
      cy.mocksUseRouteVariant(
        'people/v1/worker-employment/get-by-employment-id:400-error'
      );
      cy.mocksUseRouteVariant('people/v1/department/selection:200-success');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirect to the correct url', () => {
      cy.visit(
        '/company/people/onboarding/create?hireType=eor&mode=guided&employmentId=ual6fwu4kotvg13jb19vmtn05nt6mgh3&step=1'
      );

      cy.url().should(
        'include',
        '/company/people/onboarding/create?hireType=eor&mode=guided&step=0'
      );
    });
  });

  describe(
    'when edit an existing hire PEO HongKong',
    { viewportHeight: 800, viewportWidth: 400 },
    () => {
      before(() => {
        cy.signInCompanyAndMockPeopleOnboardingCollection(true);
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/check:200-success-has-submitted'
        );
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/get-by-employment-id:200-get-employee-success-hk-draft'
        );
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/patch:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/check-employee-id:200-success'
        );
        cy.mocksUseRouteVariant('people/v1/department/selection:200-success');
        cy.mocksUseRouteVariant('people/v1/department/post:200-success');

        cy.mocksUseRouteVariant('people/v1/file-management/get:200-success');
        cy.mocksUseRouteVariant('s3Api-download:200-success');

        cy.visit(
          '/company/people/onboarding/create?hireType=eor&mode=guided&employmentId=ual6fwu4kotvg13jb19vmtn05nt6mgh3&step=1'
        );
        cy.mocksUseRouteVariant(
          'people/v1/file-management:200-upload-file-success'
        );
        cy.mocksUseRouteVariant('s3Api-upload:200-success');
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/patch:200-success'
        );
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      describe('when filling step by step', () => {
        it('should complete hiring details', () => {
          const numberOfSteps = 5;
          Array.from(Array(numberOfSteps).keys()).forEach(() => {
            cy.get(
              '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
            ).click();
            cy.wait(1_000);
          });
          fillingStep6(true);
        });
      });
    }
  );

  describe(
    'when edit an existing hire PEO HongKong',
    { viewportHeight: 800, viewportWidth: 400 },
    () => {
      before(() => {
        cy.signInCompanyAndMockPeopleOnboardingCollection(true);
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/check:200-success-has-submitted'
        );
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/get-by-employment-id:200-get-employee-success-hk-draft'
        );
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/patch:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/check-employee-id:200-success'
        );
        cy.mocksUseRouteVariant('people/v1/department/selection:200-success');
        cy.mocksUseRouteVariant('people/v1/department/post:200-success');

        cy.visit(
          '/company/people/onboarding/create?hireType=eor&mode=guided&employmentId=ual6fwu4kotvg13jb19vmtn05nt6mgh3&step=1'
        );
        cy.mocksUseRouteVariant(
          'people/v1/file-management:200-upload-file-success'
        );
        cy.mocksUseRouteVariant('s3Api-upload:200-success');
        cy.mocksUseRouteVariant(
          'people/v1/worker-employment/patch:200-success'
        );
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      describe('when filling step by step', () => {
        it('should complete hiring details', () => {
          const numberOfSteps = 5;
          Array.from(Array(numberOfSteps).keys()).forEach(() => {
            cy.get(
              '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-nextButton"]'
            ).click();
            cy.wait(1_000);
          });
          cy.get(
            '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-requestAddendumButton"]'
          )
            .scrollIntoView()
            .click();
          cy.get(
            '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal.form.addendumFiles"]'
          )
            .scrollIntoView()
            .attachFile(['test.pdf', 'test.csv', 'test2.pdf']);
          cy.get(
            '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal.form.comment"]'
          ).type('test comment');
          cy.get(
            '[data-testid="companyPeopleOnboardingCreate-guidedMode-peo-request-addendum-modal-buttonSubmit"]'
          ).click();

          cy.url().should('include', '/company/people/onboarding');
        });
      });
    }
  );
});
