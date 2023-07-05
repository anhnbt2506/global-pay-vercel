import { STAFF_ADMIN } from '@fixtures/users';

describe('staff/email-templates', () => {
  describe('when accessing /staff/email-templates', () => {
    before(() => {
      cy.login(STAFF_ADMIN);
      cy.visit('/staff/email-templates');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the staff email templates page', () => {
      cy.url().should('include', '/staff/email-templates');
      cy.get('[data-testid="staffEmailTemplates-selectionButton"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffEmailTemplates-textField-subjectPart"]'
      ).should('be.visible');
      cy.get('[data-testid="staffEmailTemplates-submitButton"]').should(
        'be.visible'
      );
    });
  });

  describe('when open selection modal then load email templates', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/email-template/get:200-success');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open modal and show list email templates', () => {
      cy.get('[data-testid="staffEmailTemplates-selectionButton"]').click();

      cy.typeAutocompleteClickOptionIndex(
        'staffEmailTemplates-sectionNameSelectField',
        'Bulk upload',
        0
      );
      cy.get('[data-testid="staffEmailTemplates-sectionNameSelectField"]')
        .find('input')
        .should('have.value', 'Bulk upload summary');
    });

    it('should close modal', () => {
      cy.get(
        '[data-testid="staffEmailTemplates-selectTemplates-closeButton"]'
      ).click();
      cy.get('[data-testid="staffEmailTemplates-selectionButton"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffEmailTemplates-textField-subjectPart"]'
      ).should('be.visible');
    });
  });

  describe('when load and submit successfully template agreement ', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/email-template/get:200-success');
      cy.mocksUseRouteVariant('people/v1/email-template/patch:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/email-template/get-detail:200-success'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should get successfully all email templates', () => {
      cy.get('[data-testid="staffEmailTemplates-selectionButton"]').click();
      cy.typeAutocompleteClickOptionIndex(
        'staffEmailTemplates-sectionNameSelectField',
        'Bulk upload',
        0
      );
      cy.get(
        '[data-testid="staffEmailTemplates-selectTemplates-submitButton"]'
      ).click();

      const mockData = {
        htmlPart: '{{companyId}}',
        subjectPart: 'Amazon Bulk Upload Summary',
      };
      cy.wait(3_000);
      cy.typeTextEditor('htmlPart', `${mockData.htmlPart}`, true);
      cy.get('[data-testid="staffEmailTemplates-textField-subjectPart"]')
        .find('input')
        .should('have.value', `${mockData.subjectPart}`);
    });

    it('should submit successfully a new email template', () => {
      cy.wait(3_000);
      cy.typeTextEditor('htmlPart', 'testing');
      cy.get('[data-testid="staffEmailTemplates-submitButton"]').click();
      cy.get('[data-testid="staffEmailTemplates-toast"]').should('be.visible');
      cy.get('[data-testid="staffEmailTemplates-toast-successAlert"]').should(
        'be.visible'
      );
    });

    it('should close  toast', () => {
      cy.get(
        '[data-testid="staffEmailTemplates-toast-successAlert"]'
      ).clickOutside();
      cy.get('[data-testid="staffEmailTemplates-toast-successAlert"]').should(
        'not.exist'
      );
    });
  });

  describe('when load and submit successfully template agreement with email cc fields', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/email-template/get:200-success');
      cy.mocksUseRouteVariant('people/v1/email-template/patch:200-success-cc');
      cy.mocksUseRouteVariant(
        'people/v1/email-template/get-detail:200-success-cc'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should get successfully all email templates', () => {
      cy.get('[data-testid="staffEmailTemplates-selectionButton"]').click();
      cy.typeAutocompleteClickOptionIndex(
        'staffEmailTemplates-sectionNameSelectField',
        'Staff Manual Payroll Comment',
        0
      );
      cy.get(
        '[data-testid="staffEmailTemplates-selectTemplates-submitButton"]'
      ).click();

      const mockData = {
        htmlPart: '{{comment}}',
        subjectPart: 'Staff Manual Payroll Comment',
      };
      cy.wait(3_000);
      cy.typeTextEditor('htmlPart', `${mockData.htmlPart}`, true);
      cy.get('[data-testid="staffEmailTemplates-textField-subjectPart"]')
        .find('input')
        .should('have.value', `${mockData.subjectPart}`);
    });

    it('should submit successfully a new email template', () => {
      cy.wait(3_000);
      cy.get('[data-testid="staffEmailTemplates-email-cc"]').type(
        'test3{enter}'
      );
      cy.get(
        '[data-testid="staffEmailTemplates-textField-subjectPart"]'
      ).click();
      cy.get('[data-testid="staffEmailTemplates-email-cc-error"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffEmailTemplates-email-cc-chip-test3"] > [data-testid="CancelIcon"]'
      ).click();
      cy.get('[data-testid="staffEmailTemplates-email-cc"]').type(
        'test3@gmail.com{enter}'
      );
      cy.typeTextEditor('htmlPart', 'testing');
      cy.get('[data-testid="staffEmailTemplates-submitButton"]').click();
      cy.get('[data-testid="staffEmailTemplates-toast"]').should('be.visible');
      cy.get('[data-testid="staffEmailTemplates-toast-successAlert"]').should(
        'be.visible'
      );
    });

    it('should close  toast', () => {
      cy.get(
        '[data-testid="staffEmailTemplates-toast-successAlert"]'
      ).clickOutside();
      cy.get('[data-testid="staffEmailTemplates-toast-successAlert"]').should(
        'not.exist'
      );
    });
  });

  describe('when failed to load a email template - 500-internal-server error', () => {
    before(() => {
      cy.clearCookies();

      cy.mocksUseRouteVariant('people/v1/email-template/get:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/email-template/get-detail:500-internal-server-error'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should failed when load error agreement template content', () => {
      cy.get('[data-testid="staffEmailTemplates-selectionButton"]').click();

      cy.typeAutocompleteClickOptionIndex(
        'staffEmailTemplates-sectionNameSelectField',
        'Calendar',
        0
      );
      cy.wait(1_000);
      cy.get(
        '[data-testid="staffEmailTemplates-selectTemplates-submitButton"]'
      ).click();

      cy.wait(3_000);
      cy.typeTextEditor('htmlPart', '', true);
      cy.get('[data-testid="staffEmailTemplates-textField-subjectPart"]')
        .find('input')
        .should('have.value', '');
    });
  });

  describe('when submitting new email template returns error ', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/email-template/get:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/email-template/get-detail:200-success'
      );
      cy.mocksUseRouteVariant(
        'people/v1/email-template/patch:500-internal-server-error'
      );
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should get successfully a email template', () => {
      cy.get('[data-testid="staffEmailTemplates-selectionButton"]').click();
      cy.typeAutocompleteClickOptionIndex(
        'staffEmailTemplates-sectionNameSelectField',
        'Bulk upload',
        0
      );
      cy.get(
        '[data-testid="staffEmailTemplates-selectTemplates-submitButton"]'
      ).click();

      const mockData = {
        htmlPart: '{{companyId}}',
        subjectPart: 'Amazon Bulk Upload Summary',
      };
      cy.wait(3_000);
      cy.typeTextEditor('htmlPart', `${mockData.htmlPart}`, true);
    });

    it('should show toast error message when submit a new email template', () => {
      cy.wait(3_000);
      cy.typeTextEditor('htmlPart', 'testing');
      cy.get('[data-testid="staffEmailTemplates-submitButton"]').click();
      cy.get('[data-testid="staffEmailTemplates-toast"]').should('be.visible');
      cy.get('[data-testid="staffEmailTemplates-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when load and submit successfully - template staff addendum manual request', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/email-template/get:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/email-template/patch:200-success-by-hk'
      );
      cy.mocksUseRouteVariant(
        'people/v1/email-template/get-detail:200-success-by-hk'
      );
      cy.mocksUseRouteVariant('people/v1/country/get-countries:200-success');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should get successfully all email templates', () => {
      cy.get('[data-testid="staffEmailTemplates-selectionButton"]').click();
      cy.typeAutocompleteClickOptionIndex(
        'staffEmailTemplates-sectionNameSelectField',
        'staff addendum manual request',
        0
      );
      cy.get(
        '[data-testid="staffEmailTemplates-selectTemplates-submitButton"]'
      ).click();

      const mockData = {
        htmlPart: '{{comment}}',
        subjectPart:
          'UAT - New Hong Kong addendum request from {{companyName}} for {{employeeFirstName}} {{employeeLastName}} {{employeeHireType}} hiring',
      };
      cy.wait(3_000);
      cy.typeAutocompleteClickOptionIndex(
        'staffEmailTemplates-country',
        'Hong Kong',
        0
      );
      cy.typeTextEditor('htmlPart', `${mockData.htmlPart}`, true);
      cy.get('[data-testid="staffEmailTemplates-textField-subjectPart"]')
        .find('input')
        .should('have.value', `${mockData.subjectPart}`);
    });

    it('should submit successfully a new email template', () => {
      cy.get('[data-testid="staffEmailTemplates-submitButton"]').click();
      cy.get('[data-testid="staffEmailTemplates-toast"]').should('be.visible');
      cy.get('[data-testid="staffEmailTemplates-toast-successAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when load and submit failed with error 403 - template staff addendum manual request', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/email-template/get:200-success');
      cy.mocksUseRouteVariant('people/v1/email-template/get-detail:403-error');
      cy.mocksUseRouteVariant('people/v1/country/get-countries:200-success');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should get email template data fail', () => {
      cy.get('[data-testid="staffEmailTemplates-selectionButton"]').click();
      cy.typeAutocompleteClickOptionIndex(
        'staffEmailTemplates-sectionNameSelectField',
        'staff addendum manual request',
        0
      );

      cy.get(
        '[data-testid="staffEmailTemplates-selectTemplates-submitButton"]'
      ).click();

      cy.get('[data-testid="staffEmailTemplates-textField-subjectPart"]')
        .find('input')
        .should('have.value', '');
    });
  });
});
