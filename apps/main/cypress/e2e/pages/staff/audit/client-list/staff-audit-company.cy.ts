import { STAFF_ADMIN } from '@fixtures/users';

describe('staff/audit/client-list/[companyId]', () => {
  const mockedId = '123';

  const mockDataAndVisitCompanyDetail = (suffixes?: string) => {
    cy.mocksUseRouteVariant(
      `people/v1/company/information:200-success${
        suffixes ? `-${suffixes}` : ''
      }`
    );
    cy.mocksUseRouteVariant('people/v1/currency/get-currencies:200-success');
    cy.login(STAFF_ADMIN);
    cy.visit(`/staff/audit/client-list/${mockedId}`);
  };

  const fillCompanyInformationUpdatingForm = () => {
    cy.typeAutocompleteClickOptionIndex(
      'staffAuditClientList-editCompanyInformation.fields.country',
      'singapore',
      0
    );
    cy.get(
      '[data-testid="staffAuditClientList-editCompanyInformation.fields.addressLine"]'
    )
      .type('addressLine')
      .find('input')
      .should('have.value', 'addressLine');
    cy.get(
      '[data-testid="staffAuditClientList-editCompanyInformation.fields.city"]'
    )
      .type('city')
      .find('input')
      .should('have.value', 'city');
    cy.get(
      '[data-testid="staffAuditClientList-editCompanyInformation.fields.state"]'
    )
      .type('state')
      .find('input')
      .should('have.value', 'state');
    cy.get(
      '[data-testid="staffAuditClientList-editCompanyInformation.fields.postalCode"]'
    )
      .type('10000')
      .find('input')
      .should('have.value', '10000');
    cy.getSelectFieldClickOption(
      'staffAuditClientList-editCompanyInformation.fields.industry',
      'ntd93ugf'
    );
    cy.getSelectFieldClickOption(
      'staffAuditClientList-editCompanyInformation.fields.category',
      'DIRECT'
    );
  };

  const openEditCompanyStatusModalAndFillForm = () => {
    cy.get(
      '[data-testid="staffAuditClientList-companyId-optionsButton"]'
    ).click();
    cy.get(
      `[data-testid="staffAuditClientList-companyId-updateClientStatus"]`
    ).click();
    cy.getSelectFieldClickOption(
      'staffAuditClientList-companyId-updateStatus-field-status',
      'ONBOARDING'
    );
  };

  const openCompanyBillingModal = () => {
    cy.get(
      `[data-testid="staffAuditClientList-companyId-information.companyBilling-button-edit"]`
    ).click();
  };

  const closeCompanyBillingModal = () => {
    cy.get(
      `[data-testid="staffAuditClientList-editModal-cancelButton"]`
    ).click();
  };

  const selectCompanyRegisteredAddress = () => {
    cy.getSelectFieldClickOption(
      'staffAuditClientList-editCompanyBilling-fields-billingAddressType',
      'COMPANY_REGISTERED_ADDRESS'
    );
    cy.get(
      '[data-id="staffAuditClientList-editCompanyBilling-fields-country"]'
    ).should('not.exist');
  };

  const fillCompanyBillingUpdatingForm = () => {
    cy.getSelectFieldClickOption(
      'staffAuditClientList-editCompanyBilling-fields-billingAddressType',
      'ALTERNATE_ADDRESS'
    );
    cy.typeAutocompleteClickOptionIndex(
      'staffAuditClientList-editCompanyBilling-fields-country',
      'singapore',
      0
    );
    cy.get(
      '[data-testid="staffAuditClientList-editCompanyBilling-fields-addressLine"]'
    )
      .type('addressLine')
      .find('input')
      .should('have.value', 'addressLine');
    cy.get(
      '[data-testid="staffAuditClientList-editCompanyBilling-fields-city"]'
    )
      .type('city')
      .find('input')
      .should('have.value', 'city');
    cy.get(
      '[data-testid="staffAuditClientList-editCompanyBilling-fields-state"]'
    )
      .type('state')
      .find('input')
      .should('have.value', 'state');
    cy.get(
      '[data-testid="staffAuditClientList-editCompanyBilling-fields-postalCode"]'
    )
      .type('10000')
      .find('input')
      .should('have.value', '10000');
  };

  describe('when access staff/audit/client-list/:companyId', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail('cover-other-cases');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show company information correctly', () => {
      cy.url().should('include', `/staff/audit/client-list/${mockedId}`);

      // Verification
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.verification"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.verification.fields.status"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.verification.fields.entityLinkingId"]'
      )
        .scrollIntoView()
        .should('be.visible');

      // Company Registrant
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyRegistrant"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyRegistrant.fields.firstName"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyRegistrant.fields.lastName"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyRegistrant.fields.jobTitle"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyRegistrant.fields.email"]'
      )
        .scrollIntoView()
        .should('be.visible');

      // Company Information
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInformation"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInformation.fields.country"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInformation.fields.addressLine"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInformation.fields.city"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInformation.fields.state"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInformation.fields.postalCode"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInformation.fields.category"]'
      )
        .scrollIntoView()
        .should('be.visible');

      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInformation.fields.industry"]'
      )
        .scrollIntoView()
        .should('be.visible');

      // Company Billing
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyBilling"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyBilling.fields.billingInformation"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyBilling.fields.countryCode"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyBilling.fields.addressLine"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyBilling.fields.city"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyBilling.fields.state"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyBilling.fields.postalCode"]'
      )
        .scrollIntoView()
        .should('be.visible');

      // Company Invoicing
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInvoicing"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInvoicing.fields.registrationId"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInvoicing.fields.taxId"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInvoicing.fields.currency"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInvoicing.fields.hasSgEntity"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInvoicing.fields.sgEntityName"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInvoicing.fields.sgEntityUen"]'
      )
        .scrollIntoView()
        .should('be.visible');

      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInvoicing-button-edit"]'
      ).click();

      cy.get(
        '[data-testid="staffAuditClientList-editModal-cancelButton"]'
      ).click();
    });
  });

  describe('when access staff/audit/client-list/:companyId', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail('cover-other-cases');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show company information correctly', () => {
      cy.url().should('include', `/staff/audit/client-list/${mockedId}`);

      // Company Invoicing
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInvoicing"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInvoicing.fields.registrationId"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInvoicing.fields.taxId"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInvoicing.fields.currency"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInvoicing.fields.hasSgEntity"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInvoicing.fields.sgEntityName"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInvoicing.fields.sgEntityUen"]'
      )
        .scrollIntoView()
        .should('be.visible');

      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInvoicing-button-edit"]'
      ).click();

      cy.get(
        '[data-testid="staffAuditClientList-editModal-cancelButton"]'
      ).click();
    });
  });

  describe('when update company status success', () => {
    const closeEditModal = () => {
      cy.get(
        '[data-testid="staffAuditClientList-companyId-updateStatus-cancelButton"]'
      ).click();
    };

    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      cy.mocksUseRouteVariant('people/v1/company/update-by-id:200-success');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open and close edit modal', () => {
      openEditCompanyStatusModalAndFillForm();
      closeEditModal();
    });

    it('should update success and close modal', () => {
      openEditCompanyStatusModalAndFillForm();
      cy.get(
        '[data-testid="staffAuditClientList-companyId-updateStatus-submitButton"]'
      ).click();

      cy.get('[data-testid="staffAuditClientList-companyId-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast-successAlert"]'
      ).should('be.visible');
    });
  });

  describe('when update company status failed 403 forbidden', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      cy.mocksUseRouteVariant(
        'people/v1/company/update-by-id:403-forbidden-error'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast error message 403 forbidden', () => {
      openEditCompanyStatusModalAndFillForm();
      cy.get(
        '[data-testid="staffAuditClientList-companyId-updateStatus-submitButton"]'
      ).click();

      cy.get('[data-testid="staffAuditClientList-companyId-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast-errorAlert"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast"]'
      ).clickOutside();
    });
  });

  describe('when update company status failed 400 unknown', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      cy.mocksUseRouteVariant(
        'people/v1/company/update-by-id:400-unknown-error'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast error message 400 unknown', () => {
      openEditCompanyStatusModalAndFillForm();
      cy.get(
        '[data-testid="staffAuditClientList-companyId-updateStatus-submitButton"]'
      ).click();

      cy.get('[data-testid="staffAuditClientList-companyId-toast"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast-errorAlert"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-toast"]'
      ).clickOutside();
    });
  });

  describe('when update company information success', () => {
    const openEditModal = () => {
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInformation-button-edit"]'
      ).click();
    };

    const closeEditModal = () => {
      cy.get(
        '[data-testid="staffAuditClientList-editModal-cancelButton"]'
      ).click();
    };

    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      cy.mocksUseRouteVariant('people/v1/industry/selection:200-success');
      cy.mocksUseRouteVariant('people/v1/company/update-by-id:200-success');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open and close edit modal', () => {
      openEditModal();
      closeEditModal();
    });

    it('should update success and close modal', () => {
      openEditModal();
      fillCompanyInformationUpdatingForm();

      cy.get(
        '[data-testid="staffAuditClientList-editModal-submitButton"]'
      ).click();
    });
  });

  describe('when update company information failed', () => {
    const openEditModal = () => {
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information.companyInformation-button-edit"]'
      ).click();
    };

    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      cy.mocksUseRouteVariant('people/v1/industry/selection:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/company/update-by-id:403-forbidden-error'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast error message and close modal', () => {
      openEditModal();
      fillCompanyInformationUpdatingForm();

      cy.get(
        '[data-testid="staffAuditClientList-editModal-submitButton"]'
      ).click();

      cy.get(
        '[data-testid="staffAuditClientList-companyId-information-toast"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information-toast-errorAlert"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information-toast"]'
      ).clickOutside();
    });
  });

  // Company Billing Dialog
  describe('when update company billing success', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      cy.mocksUseRouteVariant('people/v1/company/update-by-id:200-success');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open and close edit modal', () => {
      openCompanyBillingModal();
      closeCompanyBillingModal();
    });

    it('should hide billing information fields when selected Company Registered Address', () => {
      openCompanyBillingModal();
      selectCompanyRegisteredAddress();
      closeCompanyBillingModal();
    });

    it('should update success and close modal', () => {
      openCompanyBillingModal();
      fillCompanyBillingUpdatingForm();
      cy.get(
        '[data-testid="staffAuditClientList-editModal-submitButton"]'
      ).click();
    });
  });

  describe('when update company billing failed', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      cy.mocksUseRouteVariant(
        'people/v1/company/update-by-id:403-forbidden-error'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open and close edit modal', () => {
      openCompanyBillingModal();
      closeCompanyBillingModal();
    });

    it('should hide billing information fields when selected company registered address', () => {
      openCompanyBillingModal();
      selectCompanyRegisteredAddress();
      closeCompanyBillingModal();
    });

    it('should show toast error message and close modal', () => {
      openCompanyBillingModal();
      fillCompanyBillingUpdatingForm();

      cy.get(
        '[data-testid="staffAuditClientList-editModal-submitButton"]'
      ).click();
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information-toast-errorAlert"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-information-toast"]'
      ).clickOutside();
    });
  });

  describe('when access staff/audit/client-list/:companyId service detail', () => {
    const selectTabServiceDetail = () => {
      cy.selectMuiTab(2);
    };

    const fillServiceDetailUpdatingForm = () => {
      cy.getSelectFieldClickOption(
        'staffAuditClientList-companyId-serviceDetail-updateService.field.hireType',
        'POM'
      );
      cy.typeAutocompleteClickOptionIndex(
        'staffAuditClientList-companyId-serviceDetail-updateService.field.country',
        'singapore',
        0
      );
      cy.getSelectFieldClickOption(
        'staffAuditClientList-companyId-serviceDetail-updateService.field.shouldDecrypt',
        '0'
      );
    };

    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should change tab to service detail', () => {
      selectTabServiceDetail();
    });

    it('should show service detail correct', () => {
      // Service
      cy.get(
        '[data-testid="staffAuditClientList-companyId-serviceDetail.service"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-serviceDetail.service.fields.hireType"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-serviceDetail.service.fields.country"]'
      )
        .scrollIntoView()
        .should('be.visible');
      cy.get(
        '[data-testid="staffAuditClientList-companyId-serviceDetail.service.fields.shouldDecrypt"]'
      )
        .scrollIntoView()
        .should('be.visible');
    });

    describe('when update service detail failed', () => {
      const openEditModal = () => {
        cy.get(
          '[data-testid="staffAuditClientList-companyId-serviceDetail.service-button-edit"]'
        ).click();
      };

      const closeEditModal = () => {
        cy.get(
          '[data-testid="staffAuditClientList-companyId-serviceDetail-updateService-cancelButton"]'
        ).click();
      };

      before(() => {
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/update-service:500-internal-server-error'
        );
      });

      it('should open and close edit modal', () => {
        openEditModal();
        closeEditModal();
      });

      it('should update failed and show error message', () => {
        openEditModal();
        fillServiceDetailUpdatingForm();

        cy.get(
          '[data-testid="staffAuditClientList-companyId-serviceDetail-updateService-submitButton"]'
        ).click();

        cy.get(
          '[data-testid="staffAuditClientList-companyId-toast-errorAlert"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffAuditClientList-companyId-toast-errorAlert"]'
        ).clickOutside();
      });
    });

    describe('when update service detail success', () => {
      const openEditModal = () => {
        cy.get(
          '[data-testid="staffAuditClientList-companyId-serviceDetail.service-button-edit"]'
        ).click();
      };

      before(() => {
        cy.clearCookies();
        mockDataAndVisitCompanyDetail();
        cy.mocksUseRouteVariant(
          'people/v1/company/hire-type/update-service:200-success'
        );
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should update success and close modal', () => {
        selectTabServiceDetail();
        openEditModal();
        fillServiceDetailUpdatingForm();

        cy.get(
          '[data-testid="staffAuditClientList-companyId-serviceDetail-updateService-submitButton"]'
        ).click();
      });
    });
  });

  describe('when access staff/audit/client-list/:companyId documents', () => {
    const selectTabDocuments = () => {
      cy.selectMuiTab(3);
    };

    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      cy.mocksUseRouteVariant('people/v1/file-management/get-list:200-success');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should change tab to documents and show list documents success', () => {
      selectTabDocuments();

      const columnNames = ['Name', 'Last modified', 'Last updated'];
      const firstRowData = [
        'company.ge4lmziiraes9vso.documents.Freelancer',
        '22/09/2022',
        '-',
      ];

      columnNames.forEach((name) => cy.contains(name));
      firstRowData.forEach((value) => cy.contains(value));
    });
  });
});
