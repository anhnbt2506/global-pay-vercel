import { STAFF_AUDITOR } from '@fixtures/users';

describe('staff/payroll/calendar', () => {
  describe('when accessing /staff/payroll/calendar', () => {
    before(() => {
      cy.login(STAFF_AUDITOR);
      cy.visit('/staff/payroll/calendar');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the staff payroll calendar page', () => {
      cy.url().should('include', '/staff/payroll/calendar');
      cy.get(
        '[data-testid="staffPayrollCalendar-calendarHeader-todayButton"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffPayrollCalendar-calendarHeader-prevButton"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffPayrollCalendar-calendarHeader-nextButton"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffPayrollCalendar-calendarHeader-title"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="staffPayrollCalendar-calendarHeader-selectMonth"]'
      ).should('be.visible');
      cy.get('.fc-scrollgrid').should('be.visible');
    });
  });

  describe('when select calendar then get clients failed', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/company-calendar/clients:500-internal-server-error'
      );
      cy.login(STAFF_AUDITOR);
      cy.visit('/staff/payroll/calendar');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open modal for selecting calendar', () => {
      cy.get('[data-testid="staffPayrollCalendar-selectionButton"]').click();
      cy.get('[data-testid="staffPayrollCalendar-toast"]').should('be.visible');
      cy.get('[data-testid="staffPayrollCalendar-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when select calendar then get calendars generated failed', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/company-calendar/clients:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/company-calendar/get-calendars-generated:500-internal-server-error'
      );
      cy.login(STAFF_AUDITOR);
      cy.visit('/staff/payroll/calendar');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open modal for selecting calendar', () => {
      cy.get('[data-testid="staffPayrollCalendar-selectionButton"]').click();
      cy.get(
        '[data-testid="staffPayrollCalendar-selectionModal-field-client"]'
      ).click();
      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();

      cy.get('[data-testid="staffPayrollCalendar-toast"]').should('be.visible');
      cy.get('[data-testid="staffPayrollCalendar-toast-errorAlert"]').should(
        'be.visible'
      );
    });
  });

  describe('when select calendar', () => {
    before(() => {
      cy.mocksUseRouteVariant('people/v1/company-calendar/clients:200-success');
      cy.mocksUseRouteVariant(
        'people/v1/company-calendar/get-calendars-generated:200-success'
      );
      cy.mocksUseRouteVariant(
        'people/v1/company-calendar/get-company-events:200-success'
      );
      cy.login(STAFF_AUDITOR);
      cy.visit('/staff/payroll/calendar');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open modal for selecting calendar', () => {
      // select calendar
      cy.get('[data-testid="staffPayrollCalendar-selectionButton"]').click();
      cy.get(
        '[data-testid="staffPayrollCalendar-selectionModal-field-client"]'
      ).click();
      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
      cy.get(
        '[data-testid="staffPayrollCalendar-selectionModal-field-calendar"]'
      ).click();
      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
      cy.get(
        '[data-testid="staffPayrollCalendar-selectionModal-submitButton"]'
      ).click();

      // calendar view
      const mockedData = {
        title: '[Biscuits & Co.] POM - Thailand',
        event1: 'TH event',
        event2: 'TH event 2',
      };
      cy.contains(mockedData.title);
      cy.contains(mockedData.event1);
      cy.contains(mockedData.event2);
    });
  });
});
