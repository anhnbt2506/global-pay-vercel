import { STAFF_ADMIN } from '@fixtures/users';

describe('staff/audit/client-list/[companyId]', () => {
  const mockedCompanyId = 'vdqb3hxkjayjahhn';

  const mockDataAndVisitCompanyDetail = () => {
    cy.mocksUseRouteVariant('people/v1/company/information:200-success');
    cy.mocksUseRouteVariant('people/v1/currency/get-currencies:200-success');
    cy.login(STAFF_ADMIN);
    cy.visit(`/staff/audit/client-list/${mockedCompanyId}`);
  };

  const mockApiAndVisitPage = (companyLinkStatus: string) => {
    cy.mocksUseRouteVariant(
      `people/v1/company/entity:200-success-${companyLinkStatus}`
    );
    cy.selectMuiTab(4);
  };

  const buttonCreateNewCompanyLinking = () => {
    cy.get(
      '[data-testid="entityManagementButton-createOrSelectEntity"]'
    ).should('be.visible');
    cy.get(
      '[data-testid="entityManagementButton-addNewCompanyLinking-Icon"]'
    ).should('be.visible');
  };

  const selectLinkEntityOption = () => {
    cy.get(
      '[data-testid="staffAudit-clientList-entityManagementButton-addNewCompanyLinking"]'
    ).click();
  };

  const fillFormExistingEntity = (linkingType: string) => {
    cy.getSelectFieldClickOption(
      'staffAudit-clientList-entityManagement-linkEntity-entityLinkOptions',
      'EXISTING_ENTITY'
    );
    cy.get(
      '[data-testid="staffAudit-clientList-entityManagement-linkEntity-existingEntity-linkingCompanyId"]'
    )
      .type('123asdasd2')
      .find('input')
      .should('have.value', '123asdasd2');
    cy.getSelectFieldClickOption(
      'staffAudit-clientList-entityManagement-linkEntity-existingEntity-linkingType',
      linkingType
    );
  };

  const fillFormLinkNewEntity = () => {
    cy.getSelectFieldClickOption(
      'staffAudit-clientList-entityManagement-linkEntity-entityLinkOptions',
      'NEW_ENTITY'
    );
    cy.getSelectFieldClickOption(
      'staffAudit-clientList-entityManagement-linkEntity-newEntity-linkingType',
      'SUBSIDIARY'
    );
    cy.get('[data-testid="companySignUp-firstNameField"]')
      .type('Tommy')
      .find('input')
      .should('have.value', 'Tommy');
    cy.get('[data-testid="companySignUp-lastNameField"]')
      .type('Nguyen')
      .find('input')
      .should('have.value', 'Nguyen');

    cy.get('[data-testid="companySignUp-companyNameField"]')
      .type('AYP-GROUP')
      .find('input')
      .should('have.value', 'AYP-GROUP');
    cy.wait(1_000);
    cy.typeAutocompleteClickOptionIndex(
      'companySignUp-countryField',
      'singapore',
      0
    );
    cy.get('[data-testid="companySignUp-jobTitleField"]')
      .scrollIntoView()
      .type('Developer')
      .find('input')
      .should('have.value', 'Developer');
    cy.get('[data-testid="companySignUp-emailField"]')
      .type('tommy.nguyen@ayp-group.com')
      .find('input')
      .should('have.value', 'tommy.nguyen@ayp-group.com');
    cy.get('[data-testid="companySignUp-passwordField"]')
      .type('Pwd12345')
      .find('input')
      .should('have.value', 'Pwd12345');
    cy.getSelectFieldClickOption('companySignUp-interestField', 'PARTNERSHIP');
    cy.getSelectFieldClickOption('companySignUp-industryField', 'ntd93ugf');
    cy.getSelectFieldClickOption('companySignUp-categoryField', 'DIRECT');
  };

  describe('when user access the page and click into entity management with entity linking status STANDALONE', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      mockApiAndVisitPage('standalone');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display a button create new company linking', () => {
      buttonCreateNewCompanyLinking();
    });
  });

  describe('when user access the page and click into entity management with entity linking status SUBSIDIARY', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      mockApiAndVisitPage('subsidiary');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display a button with status parent and the company name and country name', () => {
      cy.get('[data-testid="entityManagementButton-companyName"]')
        .should('be.visible')
        .contains('Meri company');
      cy.get('[data-testid="entityManagementButton-companyCountryName"]')
        .should('be.visible')
        .contains('Vietnam');
      cy.get('[data-testid="entityManagementButton-buttonType"]')
        .should('be.visible')
        .contains('parent');
    });
  });

  describe('when user access the page and click into entity management with entity linking status PARENT', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      mockApiAndVisitPage('parent');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display a button with status subsidiary and the company name and country name and create button', () => {
      buttonCreateNewCompanyLinking();

      const companyName = ['name', 'Meri sing'];
      const companyCountry = ['American Samoa', 'Andorra'];

      companyName.forEach((name) => cy.contains(name));
      companyCountry.forEach((name) => cy.contains(name));
    });
  });

  describe('when user unlink an entity link', () => {
    const selectUnlinkOption = () => {
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagementButton-itemOptions"]'
      )
        .first()
        .scrollIntoView()
        .click();
      cy.get(
        `[data-testid="staffAudit-clientList-entityManagementButton-unlinkEntity"]`
      ).click();
    };

    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      mockApiAndVisitPage('parent');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should display a confirmation unlink popup', () => {
      selectUnlinkOption();
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-unlinkEntityModal-title"]'
      ).should('be.visible');
    });

    it('should close modal when click button cancel', () => {
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-unlinkEntityModal-buttonCancel"]'
      ).click();
    });

    it('should close modal and show toast msg when unlink entity success', () => {
      cy.mocksUseRouteVariant(
        `people/v1/company/entity-link/unlink:200-success`
      );
      selectUnlinkOption();
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-unlinkEntityModal-buttonUnlink"]'
      ).click();

      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast-successAlert"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast"]'
      ).clickOutside();
    });

    it('should close modal and show toast msg when unlink entity failed', () => {
      cy.mocksUseRouteVariant(
        `people/v1/company/entity-link/unlink:500-internal-server-error`
      );
      selectUnlinkOption();
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-unlinkEntityModal-buttonUnlink"]'
      ).click();

      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast-errorAlert"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast"]'
      ).clickOutside();
    });

    it('should close modal and show toast msg when unlink entity failed with unknown error', () => {
      cy.mocksUseRouteVariant(
        `people/v1/company/entity-link/unlink:400-unknown-error`
      );
      selectUnlinkOption();
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-unlinkEntityModal-buttonUnlink"]'
      ).click();

      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast-errorAlert"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast"]'
      ).clickOutside();
    });
  });

  describe('when user link new entity success', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/industry/selection:200-success');
      cy.mocksUseRouteVariant('people/v1/company/new-client:200-success');
      mockDataAndVisitCompanyDetail();
      mockApiAndVisitPage('parent');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show modal to select option new entity or existing entity and close modal when click button cancel', () => {
      selectLinkEntityOption();
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-linkEntity-entityLinkOptions"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-linkEntity-buttonCancel"]'
      ).click();
    });

    it('should close modal and show toast msg when unlink entity success', () => {
      selectLinkEntityOption();
      fillFormLinkNewEntity();
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-linkEntity-buttonLink"]'
      ).click();

      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast-successAlert"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast"]'
      ).clickOutside();
    });
  });

  describe('when user link new entity failed with 403 forbidden error', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/industry/selection:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/company/new-client:403-forbidden-error'
      );
      mockDataAndVisitCompanyDetail();
      mockApiAndVisitPage('parent');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should close modal and show toast msg when unlink entity failed 403 forbidden error', () => {
      selectLinkEntityOption();
      fillFormLinkNewEntity();
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-linkEntity-buttonLink"]'
      ).click();

      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast-errorAlert"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast"]'
      ).clickOutside();
    });
  });

  describe('when user link new entity failed with 400 unknown error', () => {
    before(() => {
      cy.clearCookies();
      cy.mocksUseRouteVariant('people/v1/industry/selection:200-success');
      cy.mocksUseRouteVariant('people/v1/company/new-client:400-unknown-error');
      mockDataAndVisitCompanyDetail();
      mockApiAndVisitPage('standalone');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should close modal and show toast msg when unlink entity failed with 400 unknown error', () => {
      selectLinkEntityOption();
      fillFormLinkNewEntity();
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-linkEntity-buttonLink"]'
      ).click();

      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast-errorAlert"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast"]'
      ).clickOutside();
    });
  });

  describe('when user access the page and click into entity management with entity linking status STANDALONE', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      cy.mocksUseRouteVariant(
        'people/v1/company/entity-link/link-existing-entity:200-success'
      );
      mockApiAndVisitPage('standalone');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast message success and display the new entity linked', () => {
      buttonCreateNewCompanyLinking();
      selectLinkEntityOption();
      fillFormExistingEntity('PARENT');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-linkEntity-buttonLink"]'
      ).click();
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast-successAlert"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast"]'
      ).clickOutside();
    });
  });

  describe('when user access the page and click into entity management with entity linking status PARENT', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      cy.mocksUseRouteVariant(
        'people/v1/company/entity-link/link-existing-entity:200-success'
      );
      mockApiAndVisitPage('parent');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show toast message success and display the new entity linked', () => {
      buttonCreateNewCompanyLinking();
      selectLinkEntityOption();
      fillFormExistingEntity('SUBSIDIARY');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-linkEntity-buttonLink"]'
      ).click();
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast-successAlert"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast"]'
      ).clickOutside();
    });
  });

  describe('when user access the page and click into entity management with entity linking status PARENT', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      cy.mocksUseRouteVariant(
        'people/v1/company/entity-link/link-existing-entity:422-same-entity-id-cannot-be-linked'
      );
      mockApiAndVisitPage('parent');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('Should show the error message This entity cannot be linked to itself', () => {
      buttonCreateNewCompanyLinking();
      selectLinkEntityOption();
      fillFormExistingEntity('SUBSIDIARY');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-linkEntity-buttonLink"]'
      ).click();
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-linkEntity-existingEntity-linkingCompanyId-error"]'
      )
        .should('be.visible')
        .should('have.text', 'This entity cannot be linked to itself');
    });
  });

  describe('when user access the page and click into entity management with entity linking status PARENT', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      cy.mocksUseRouteVariant(
        'people/v1/company/entity-link/link-existing-entity:422-linking-company-is-not-found'
      );
      mockApiAndVisitPage('parent');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('Should show the error message This entity does not exist', () => {
      buttonCreateNewCompanyLinking();
      selectLinkEntityOption();
      fillFormExistingEntity('SUBSIDIARY');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-linkEntity-buttonLink"]'
      ).click();
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-linkEntity-existingEntity-linkingCompanyId-error"]'
      )
        .should('be.visible')
        .should('have.text', 'This entity does not exist');
    });
  });

  describe('when user access the page and click into entity management with entity linking status STANDALONE', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      cy.mocksUseRouteVariant(
        'people/v1/company/entity-link/link-existing-entity:422-linking-company-is-already-a-subsidiary'
      );
      mockApiAndVisitPage('standalone');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('Should show the error message This entity is already a subsidiary and is unable to be linked', () => {
      buttonCreateNewCompanyLinking();
      selectLinkEntityOption();
      fillFormExistingEntity('SUBSIDIARY');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-linkEntity-buttonLink"]'
      ).click();
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-linkEntity-existingEntity-linkingCompanyId-error"]'
      )
        .should('be.visible')
        .should(
          'have.text',
          'This entity is already a subsidiary and is unable to be linked'
        );
    });
  });

  describe('when user access the page and click into entity management with entity linking status STANDALONE', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      cy.mocksUseRouteVariant(
        'people/v1/company/entity-link/link-existing-entity:422-linking-company-is-already-a-parent'
      );
      mockApiAndVisitPage('standalone');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('Should show the error message This entity is already a parent and is unable to be linked', () => {
      buttonCreateNewCompanyLinking();
      selectLinkEntityOption();
      fillFormExistingEntity('SUBSIDIARY');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-linkEntity-buttonLink"]'
      ).click();
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-linkEntity-existingEntity-linkingCompanyId-error"]'
      )
        .should('be.visible')
        .should(
          'have.text',
          'This entity is already a parent and is unable to be linked'
        );
    });
  });

  describe('when user access the page and click into entity management with entity linking status STANDALONE', () => {
    before(() => {
      cy.clearCookies();
      mockDataAndVisitCompanyDetail();
      cy.mocksUseRouteVariant(
        'people/v1/company/entity-link/link-existing-entity:422-unprocessable-content'
      );
      mockApiAndVisitPage('standalone');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('Should show the error toast message unprocessable', () => {
      buttonCreateNewCompanyLinking();
      selectLinkEntityOption();
      fillFormExistingEntity('PARENT');
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-linkEntity-buttonLink"]'
      ).click();
      cy.get(
        '[data-testid="staffAudit-clientList-entityManagement-toast-errorAlert"]'
      ).should('be.visible');
    });
  });
});
