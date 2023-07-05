import { format } from 'date-fns';

import { COMPANY_OWNER } from '@fixtures/users';

describe('company/payroll/calendar', () => {
  describe('when accessing /company/payroll/calendar', () => {
    before(() => {
      cy.login(COMPANY_OWNER);
      cy.visit('/company/payroll/calendar');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should redirects to the company payroll calendar page', () => {
      cy.url().should('include', '/company/payroll/calendar');
      cy.get(
        '[data-testid="companyPayrollCalendar-calendarHeader-todayButton"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPayrollCalendar-calendarHeader-prevButton"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPayrollCalendar-calendarHeader-nextButton"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPayrollCalendar-calendarHeader-title"]'
      ).should('be.visible');
      cy.get(
        '[data-testid="companyPayrollCalendar-calendarHeader-selectMonth"]'
      ).should('be.visible');
      cy.get('.fc-scrollgrid').should('be.visible');
    });
  });

  describe('when does not have a calendar generated at all', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/company-calendar/get-calendars-generated:200-empty-success'
      );
      cy.login(COMPANY_OWNER);
      cy.visit('/company/payroll/calendar');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should show error toast', () => {
      cy.get('[data-testid="companyPayrollCalendar-selectionButton"]').click();
      cy.get('[data-testid="companyPayrollCalendar-toast"]').should(
        'be.visible'
      );
      cy.get('[data-testid="companyPayrollCalendar-toast-errorAlert"]').should(
        'be.visible'
      );
    });
    it('should close  toast', () => {
      cy.get(
        '[data-testid="companyPayrollCalendar-toast-errorAlert"]'
      ).clickOutside();
    });
  });

  const openAndSelectingCalendar = () => {
    cy.get('[data-testid="companyPayrollCalendar-selectionButton"]').click();

    cy.get(
      '[data-testid="companyPayrollCalendar-selectionModal-title"]'
    ).should('be.visible');

    cy.get(
      '[data-testid="companyPayrollCalendar-selectionModal-description"]'
    ).should('be.visible');

    cy.get(
      '[data-testid="companyPayrollCalendar-selectionModal-field-calendar"]'
    ).should('be.visible');

    cy.get(
      '[data-testid="companyPayrollCalendar-selectionModal-submitButton"]'
    ).should('be.visible');
  };

  describe('when have at least has 1 calendar generated previously', () => {
    const calendarTitleTimeFormat = 'MMMM yyyy';

    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/company-calendar/get-calendars-generated:200-success'
      );
      cy.mocksUseRouteVariant(
        'people/v1/company-calendar/get-company-events:200-success'
      );
      cy.login(COMPANY_OWNER);
      cy.visit('/company/payroll/calendar');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open modal for selecting calendar ', () => {
      openAndSelectingCalendar();
    });

    it('should open modal for selecting calendar and submit successfully', () => {
      cy.get(
        '[data-testid="companyPayrollCalendar-selectionModal-field-calendar"]'
      ).click();
      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();

      cy.get(
        '[data-testid="companyPayrollCalendar-selectionModal-submitButton"]'
      ).click();

      const mockedData = {
        title: 'POM - Thailand',
        event1: 'TH event',
        event2: 'TH event 2',
      };
      cy.contains(mockedData.title);
      cy.contains(mockedData.event1);
      cy.contains(mockedData.event2);
    });

    it('should close modal successfully', () => {
      cy.get('[data-testid="companyPayrollCalendar-selectionButton"]').click();
      cy.get(
        '[data-testid="companyPayrollCalendar-selectionModal-close"]'
      ).click();
    });

    it('should contain this month when click today button', () => {
      cy.get(
        '[data-testid="companyPayrollCalendar-calendarHeader-todayButton"]'
      ).click();

      cy.get(
        '[data-testid="companyPayrollCalendar-calendarHeader-title"]'
      ).contains(format(new Date(), calendarTitleTimeFormat));
    });

    it('should contains next month in title when click next button', () => {
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      cy.get(
        '[data-testid="companyPayrollCalendar-calendarHeader-nextButton"]'
      ).click();

      cy.get(
        '[data-testid="companyPayrollCalendar-calendarHeader-title"]'
      ).contains(format(nextMonth, calendarTitleTimeFormat));
    });

    it('should contains this month when click prev button', () => {
      cy.get(
        '[data-testid="companyPayrollCalendar-calendarHeader-prevButton"]'
      ).click();

      cy.get(
        '[data-testid="companyPayrollCalendar-calendarHeader-title"]'
      ).contains(format(new Date(), calendarTitleTimeFormat));
    });

    it('should open event information modal', () => {
      cy.get(
        ':nth-child(1) > .fc-event > .fc-event-main > .fc-event-main-frame > .fc-event-title-container'
      ).click();

      cy.get(
        '[data-testid="companyPayrollCalendar-calendarEvent-modal"]'
      ).should('be.visible');
    });
  });

  describe('when no event render', () => {
    before(() => {
      cy.mocksUseRouteVariant(
        'people/v1/company-calendar/get-calendars-generated:200-success'
      );
      cy.mocksUseRouteVariant(
        'people/v1/company-calendar/get-company-events:404-not-found'
      );
      cy.login(COMPANY_OWNER);
      cy.visit('/company/payroll/calendar');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open modal for selecting calendar ', () => {
      openAndSelectingCalendar();
    });

    it('should open modal for selecting calendar and submit successfully', () => {
      cy.get(
        '[data-testid="companyPayrollCalendar-selectionModal-field-calendar"]'
      ).click();
      cy.get('.MuiAutocomplete-popper li[data-option-index="1"]').click();

      cy.get(
        '[data-testid="companyPayrollCalendar-selectionModal-submitButton"]'
      ).click();

      const mockedData = {
        title: 'POM - Vietnam',
      };
      cy.contains(mockedData.title);
    });

    it('should close modal successfully', () => {
      cy.get('[data-testid="companyPayrollCalendar-selectionButton"]').click();

      cy.get('[data-testid="companyPayrollCalendar-selectionModal-close"]')
        .click()
        .should('not.exist');
    });

    it(
      'should display no event view',
      { viewportWidth: 400, viewportHeight: 800 },
      () => {
        cy.clickOutside();

        cy.get(
          '[data-testid="companyPayrollCalendar-calendar-noEvent"]'
        ).should('be.visible');
      }
    );
  });
});
