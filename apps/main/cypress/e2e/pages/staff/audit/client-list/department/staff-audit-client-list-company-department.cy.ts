import { STAFF_ADMIN } from '@fixtures/users';

const mockedCompanyId = 'vdqb3hxkjayjahhn';

const mockDataAndVisitCompanyDetail = () => {
  cy.mocksUseRouteVariant('people/v1/company/information:200-success');
  cy.mocksUseRouteVariant('people/v1/currency/get-currencies:200-success');
  cy.login(STAFF_ADMIN);
  cy.visit(`/staff/audit/client-list/${mockedCompanyId}`);
  cy.mocksUseRouteVariant(
    'people/v1/worker-employment/unassigned-department:200-success'
  );
};

const mockApiAndVisitDepartmentTab = () => {
  cy.mocksUseRouteVariant('people/v1/department/selection:200-success');

  cy.selectMuiTab(5);
};

const openDepartmentModalAndSubmit = (fillData?: boolean) => {
  cy.get(
    '[data-testid="staffAuditClientList-companyId-optionsButton"]'
  ).click();
  cy.get(
    `[data-testid="staffAuditClientList-companyId-newDepartment"]`
  ).click();
  cy.get(
    '[data-testid="staffAuditClientList-companyId-departmentModal-title"]'
  ).should('be.visible');

  if (fillData) {
    cy.get(
      '[data-testid="staffAuditClientList-companyId-departmentModal-field-name"]'
    )
      .clear()
      .find('input')
      .type('Sample')
      .should('have.value', 'Sample');
  }

  cy.get(
    '[data-testid="staffAuditClientList-companyId-departmentModal-submitButton"]'
  ).click();
};

const closeDepartmentModal = () => {
  cy.get(
    '[data-testid="staffAuditClientList-companyId-departmentModal-cancelButton"]'
  ).click();
};

const selectEditDepartmentAndSubmit = () => {
  cy.get('.MuiDataGrid-virtualScroller').scrollTo('right');
  cy.get(
    '[data-testid="staffAuditClientList-companyId-departmentRow-itemOptions"]'
  )
    .first()
    .scrollIntoView()
    .click();
  cy.get(
    `[data-testid="staffAuditClientList-companyId-departmentRow-itemOptions-editDepartment"]`
  ).click();

  cy.get(
    '[data-testid="staffAuditClientList-companyId-departmentModal-title"]'
  ).should('be.visible');
  cy.get(
    '[data-testid="staffAuditClientList-companyId-departmentModal-field-name"]'
  )
    .clear()
    .find('input')
    .type('Sample')
    .should('have.value', 'Sample');

  cy.get(
    '[data-testid="staffAuditClientList-companyId-departmentModal-submitButton"]'
  ).click();
};

const openModalAndSelectManageEmployees = () => {
  cy.get('.MuiDataGrid-virtualScroller').scrollTo('right');
  cy.get(
    '[data-testid="staffAuditClientList-companyId-departmentRow-itemOptions"]'
  )
    .first()
    .scrollIntoView()
    .click();
  cy.get(
    `[data-testid="staffAuditClientList-companyId-departmentRow-itemOptions-manageEmployees"]`
  ).click();
};

const clickSubmitButton = () => {
  cy.get(
    '[data-testid="staffAuditClientList-companyId-departmentModal-submitButton"]'
  ).click();
};

const addEmployees = (employees: string[]) => {
  employees.forEach((employee) => {
    cy.get(
      '[data-testid="staffAuditClientList-companyId-departmentModal-assignedEmployeeOptions"]'
    )
      .click()
      .type(employee);
    cy.get(
      `[data-testid=staffAuditClientList-companyId-departmentModal-assignedEmployeeOptions-${employee.replace(
        ' ',
        ''
      )}]`
    ).click();
  });
};

describe('staff/audit/client-list/[companyId]/department', () => {
  describe('When accessing department tab', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/department:200-success');
      mockDataAndVisitCompanyDetail();
      mockApiAndVisitDepartmentTab();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the company detail page', () => {
      cy.url().should('include', `/staff/audit/client-list/${mockedCompanyId}`);
    });

    it('should display correctly column of table', () => {
      const columnNames = [
        'Department',
        'Number of Employees',
        'Created Date',
        'Created By',
        'Last Updated Date',
        'Last Updated By',
      ];
      const firstRowData = [
        'Sample 1',
        '2',
        '27/04/2023',
        'Ngoc Hai Jerry',
        '28/04/2023',
        'Ngoc Hai Jerry',
      ];
      columnNames.forEach((value) => cy.contains(value));
      firstRowData.forEach((value) => cy.contains(value));
    });

    it('should move between pages when click next, previously button', () => {
      cy.get('[data-testid="KeyboardArrowRightIcon"]').click();
      cy.contains('26–50 of 50').should('be.visible');
      cy.get('[data-testid="KeyboardArrowLeftIcon"]').click();
      cy.contains('1–25 of 50').should('be.visible');
    });
  });

  describe('When accessing department tab - get list with 500 error', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/department:500-internal-server-error');
      mockDataAndVisitCompanyDetail();
      mockApiAndVisitDepartmentTab();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast error message ', () => {
      cy.get('[data-testid="staffAuditClientList-companyId-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast-errorAlert"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast-errorAlert"]'
      ).clickOutside();
    });
  });

  describe('When accessing department tab - get list with 400 error', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/department:400-unknown-error');
      mockDataAndVisitCompanyDetail();
      mockApiAndVisitDepartmentTab();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast error message ', () => {
      cy.get('[data-testid="staffAuditClientList-companyId-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast-errorAlert"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast-errorAlert"]'
      ).clickOutside();
    });
  });

  describe('When add new department', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/department:200-success');
      mockDataAndVisitCompanyDetail();
      mockApiAndVisitDepartmentTab();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display add new department modal and close it', () => {
      openDepartmentModalAndSubmit();

      cy.get(
        '[data-testid="staffAuditClientList-companyId-departmentModal-field-name-error"]'
      )
        .scrollIntoView()
        .should('be.visible');

      closeDepartmentModal();
    });

    it('should show toast success message ', () => {
      cy.mocksUseRouteVariant('people/v1/department/post:200-success');

      openDepartmentModalAndSubmit(true);

      cy.get('[data-testid="staffAuditClientList-companyId-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast-successAlert"]'
      ).should('be.visible');
      cy.clickOutside();
    });

    it('should show toast error message - 500 internal error', () => {
      cy.mocksUseRouteVariant(
        'people/v1/department/post:500-internal-server-error'
      );

      openDepartmentModalAndSubmit(true);

      cy.get('[data-testid="staffAuditClientList-companyId-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast-errorAlert"]'
      ).should('be.visible');
    });

    it('should show toast error message - 500 unknown error', () => {
      cy.mocksUseRouteVariant('people/v1/department/post:500-unknown-error');

      openDepartmentModalAndSubmit(true);

      cy.get('[data-testid="staffAuditClientList-companyId-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast-errorAlert"]'
      ).should('be.visible');
    });
  });

  describe('When edit department', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/department:200-success');
      mockDataAndVisitCompanyDetail();
      mockApiAndVisitDepartmentTab();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast edit success message ', () => {
      cy.mocksUseRouteVariant('people/v1/department/patch:200-success');

      selectEditDepartmentAndSubmit();

      cy.get('[data-testid="staffAuditClientList-companyId-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast-successAlert"]'
      ).should('be.visible');
      cy.clickOutside();
    });

    it('should show toast edit error message - 500 internal error', () => {
      cy.mocksUseRouteVariant(
        'people/v1/department/patch:500-internal-server-error'
      );

      selectEditDepartmentAndSubmit();

      cy.get('[data-testid="staffAuditClientList-companyId-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast-errorAlert"]'
      ).should('be.visible');
    });

    it('should show validation message - 400 bad request', () => {
      cy.mocksUseRouteVariant('people/v1/department/patch:400-bad-request');

      selectEditDepartmentAndSubmit();

      cy.get(
        '[data-testid="staffAuditClientList-companyId-departmentModal-field-name-error"]'
      )
        .scrollIntoView()
        .should('be.visible');
    });
  });
});

describe('staff/audit/client-list/[companyId]/department', () => {
  describe('When add new employee', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/department:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/department/departmentId/employees:200-success'
      );
      mockDataAndVisitCompanyDetail();
      mockApiAndVisitDepartmentTab();
      openModalAndSelectManageEmployees();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display add new employee modal and close it', () => {
      cy.get(
        '[data-testid="staffAuditClientList-companyId-departmentModal-cancelButton"]'
      ).click();
    });

    it('should display toast success save changes', () => {
      openModalAndSelectManageEmployees();
      const employees = ['test 01', 'test 02', 'test 03'];

      cy.get(
        '[data-testid="staffAuditClientList-companyId-departmentModal-title"]'
      ).should('be.visible');
      addEmployees(employees);
      clickSubmitButton();
    });

    it('should show validation message - 400 bad request', () => {
      cy.mocksUseRouteVariant(
        'people/v1/department/departmentId/employees:400-bad-request'
      );
      openModalAndSelectManageEmployees();
      const employees = ['test 01'];
      addEmployees(employees);
      clickSubmitButton();
    });

    it('should show validation message - 500 unknown error', () => {
      cy.mocksUseRouteVariant(
        'people/v1/department/departmentId/employees:500-unknown-error'
      );
      openModalAndSelectManageEmployees();
      const employees = ['test 01'];
      addEmployees(employees);
      clickSubmitButton();
    });

    it('should show validation message - 500 500 internal server error', () => {
      cy.mocksUseRouteVariant(
        'people/v1/department/departmentId/employees:500-internal-server-error'
      );
      openModalAndSelectManageEmployees();
      const employees = ['test 01'];
      addEmployees(employees);
      clickSubmitButton();
    });

    it('should show validation message - 422 unprocessable', () => {
      cy.mocksUseRouteVariant(
        'people/v1/department/departmentId/employees:422-unprocessable'
      );
      openModalAndSelectManageEmployees();
      clickSubmitButton();

      cy.get(
        '[data-testid="staffAuditClientList-companyId-departmentModal-assignedEmployeeOptions-error"]'
      ).should('be.visible');
    });
  });
});
