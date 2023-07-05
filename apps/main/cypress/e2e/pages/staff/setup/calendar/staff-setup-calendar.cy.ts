import { STAFF_AUDITOR } from '@fixtures/users';

describe('staff/setup/calendar', () => {
  describe('when accessing /staff/setup/calendar', () => {
    before(() => {
      cy.login(STAFF_AUDITOR);
      cy.visit('/staff/setup/calendar');
    });

    it('should redirects to the staff home page', () => {
      cy.url().should('include', '/staff/setup/calendar');
    });
  });

  describe('when return value is empty', () => {
    before(() => {
      cy.login(STAFF_AUDITOR);
      cy.visit('/staff/setup/calendar');
      cy.mocksUseRouteVariant(
        'people/v1/calendar-event/get-list:200-success-return-empty'
      );
    });

    it('should show NoRowOverLay table', () => {
      cy.get('[data-testid="staffSetupCalendar-noRowsOverLay-title"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffSetupCalendar-noRowsOverLay-description"]'
      ).should('be.visible');
    });
  });

  describe('when user select Events section', () => {
    before(() => {
      cy.login(STAFF_AUDITOR);
      cy.visit('/staff/setup/calendar');
      cy.get('[data-testid="staffSetupCalendar-editSectionIcon"]').click();
      cy.mocksUseRouteVariant('people/v1/calendar-event/get-list:200-success');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open modal for selecting Events', () => {
      cy.get('[data-testid="staffSetupCalendar-selectionModal-title"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffSetupCalendar-selectionModal-description"]'
      ).should('be.visible');

      cy.get(
        '[data-testid="staffSetupCalendar-sectionNameSelectField"]'
      ).click();
      cy.get(
        '[data-testid="staffSetupCalendar-sectionNameSelectField-EVENT"]'
      ).click();
      cy.get(
        '[data-testid="staffSetupCalendar-selectionModal-submitButton"]'
      ).click();
    });

    it('should display correctly data of Events', () => {
      cy.contains('Selection selected: Events');

      const columnNames = [
        'Name',
        'Description',
        'Calendar Date',
        'Specific Day',
        'Client Input Date',
        'Associated Tag',
        'Status',
      ];
      const firstRowData = [
        'Event A',
        'Event A Description',
        '01/12/2022',
        '-',
        '-',
        'ID - Payroll',
        'Active',
      ];

      columnNames.forEach((name) => cy.contains(name));
      firstRowData.forEach((value) => cy.contains(value));
    });

    describe('when get list events failed', () => {
      before(() => {
        cy.login(STAFF_AUDITOR);
        cy.mocksUseRouteVariant(
          'people/v1/calendar-event/get-list:500-internal-server-error'
        );

        cy.visit('/staff/setup/calendar');
        cy.get('[data-testid="staffSetupCalendar-editSectionIcon"]').click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField-EVENT"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-selectionModal-submitButton"]'
        ).click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show toast error message when API is not responding', () => {
        cy.get('[data-testid="staffSetupCalendar-toast"]').should('be.visible');
        cy.get('[data-testid="staffSetupCalendar-toast-errorAlert"]').should(
          'be.visible'
        );
      });
    });

    describe('when create a new calendar event success', () => {
      before(() => {
        cy.login(STAFF_AUDITOR);
        cy.mocksUseRouteVariant(
          'people/v1/calendar-event/get-selection:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/calendar-event/create:200-create-event-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/calendar-event/get-list:200-success'
        );

        cy.visit('/staff/setup/calendar');
        cy.get('[data-testid="staffSetupCalendar-editSectionIcon"]').click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField-EVENT"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-selectionModal-submitButton"]'
        ).click();

        cy.get(
          '[data-testid="staffSetupCalendar-dataGrid-MoreVertButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-newSectionIcon"]').click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show toast success message and close modal', () => {
        const mockedSelectedTag = '1p7ttli5';
        cy.get('[data-testid="staffSetupCalendar-eventFields-name"]')
          .type('Abc')
          .find('input')
          .should('have.value', 'Abc');

        cy.get('[data-testid="staffSetupCalendar-eventFields-description"]')
          .type('description')
          .find('input')
          .should('have.value', 'description');

        cy.get(
          '[data-testid="staffSetupCalendar-eventFields-dateType"]'
        ).click();
        cy.get(
          `[data-testid=staffSetupCalendar-eventFields-dateType-optionId-SPECIFIC_DAY]`
        ).click();

        cy.get(
          '[data-testid="staffSetupCalendar-eventFields-dateValue"]'
        ).click();
        cy.get(
          `[data-testid=staffSetupCalendar-eventFields-dateValue-optionId-10]`
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-eventFields-calendarTagId"]'
        ).click();
        cy.get(
          `[data-testid=staffSetupCalendar-eventFields-calendarTagId-${mockedSelectedTag}]`
        ).click();
        cy.getSelectFieldClickOption(
          'staffSetupCalendar-eventFields-isAutomatedReminder',
          '1'
        );
        cy.getSelectFieldClickOption(
          'staffSetupCalendar-eventFields-reminderBasedOn',
          'WORKING_DAYS'
        );
        cy.get(
          '[data-testid="staffSetupCalendar-eventFields-reminderDayBeforeEvent"]'
        )
          .type('12')
          .find('input')
          .should('have.value', '12');

        cy.get(
          '[data-testid="staffSetupCalendar-eventModal-submitButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-toast"]').should('be.visible');
        cy.get('[data-testid="staffSetupCalendar-toast-successAlert"]').should(
          'be.visible'
        );
      });
    });

    describe('when create a new calendar event fail', () => {
      before(() => {
        cy.login(STAFF_AUDITOR);
        cy.mocksUseRouteVariant(
          'people/v1/calendar-event/get-selection:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/calendar-event/create:500-create-event-internal-server-error'
        );
        cy.mocksUseRouteVariant(
          'people/v1/calendar-event/get-list:200-success'
        );

        cy.visit('/staff/setup/calendar');
        cy.get('[data-testid="staffSetupCalendar-editSectionIcon"]').click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField-EVENT"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-selectionModal-submitButton"]'
        ).click();

        cy.get(
          '[data-testid="staffSetupCalendar-dataGrid-MoreVertButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-newSectionIcon"]').click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show toast error message', () => {
        const mockedSelectedTag = '1p7ttli5';
        cy.get('[data-testid="staffSetupCalendar-eventFields-name"]')
          .type('Abc')
          .find('input')
          .should('have.value', 'Abc');

        cy.get('[data-testid="staffSetupCalendar-eventFields-description"]')
          .type('description')
          .find('input')
          .should('have.value', 'description');

        cy.get(
          '[data-testid="staffSetupCalendar-eventFields-dateType"]'
        ).click();
        cy.get(
          `[data-testid=staffSetupCalendar-eventFields-dateType-optionId-SPECIFIC_DAY]`
        ).click();

        cy.get(
          '[data-testid="staffSetupCalendar-eventFields-dateValue"]'
        ).click();
        cy.get(
          `[data-testid=staffSetupCalendar-eventFields-dateValue-optionId-10]`
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-eventFields-calendarTagId"]'
        ).click();
        cy.get(
          `[data-testid=staffSetupCalendar-eventFields-calendarTagId-${mockedSelectedTag}]`
        ).click();
        cy.getSelectFieldClickOption(
          'staffSetupCalendar-eventFields-isAutomatedReminder',
          '0'
        );
        cy.get(
          '[data-testid="staffSetupCalendar-eventModal-submitButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-toast"]').should('be.visible');
        cy.get('[data-testid="staffSetupCalendar-toast-errorAlert"]').should(
          'be.visible'
        );
      });
    });

    describe('when update event status', () => {
      before(() => {
        cy.login(STAFF_AUDITOR);
        cy.mocksUseRouteVariant(
          'people/v1/calendar-event/get-selection:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/calendar-event/update:500-internal-server-error'
        );
        cy.mocksUseRouteVariant(
          'people/v1/calendar-event/get-list:200-success'
        );

        cy.visit('/staff/setup/calendar');
        cy.get('[data-testid="staffSetupCalendar-editSectionIcon"]').click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField-EVENT"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-selectionModal-submitButton"]'
        ).click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show toast error message', () => {
        cy.get('[data-testid="staffSetupCalendar-eventRow-itemOptions"]')
          .first()
          .click();
        cy.get(
          '[data-testid="staffSetupCalendar-eventRow-itemUpdate"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-field-status"]').type(
          'Active'
        );
        cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();

        cy.get(
          '[data-testid="staffSetupCalendar-updateStatusModal-submitButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-toast"]').should('be.visible');
        cy.get('[data-testid="staffSetupCalendar-toast-errorAlert"]').should(
          'be.visible'
        );
      });

      it('should update success and close modal', () => {
        const newStatus = 'Active';
        cy.mocksUseRouteVariant(
          'people/v1/calendar-event/update:200-update-event-success'
        );

        cy.get('[data-testid="staffSetupCalendar-eventRow-itemOptions"]')
          .first()
          .click();
        cy.get(
          '[data-testid="staffSetupCalendar-eventRow-itemUpdate"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-field-status"]').type(
          newStatus
        );
        cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();

        cy.get(
          '[data-testid="staffSetupCalendar-updateStatusModal-submitButton"]'
        ).click();
        cy.contains(newStatus);
      });
    });

    describe('when edit a event', () => {
      before(() => {
        cy.login(STAFF_AUDITOR);
        cy.mocksUseRouteVariant(
          'people/v1/calendar-event/get-selection:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/calendar-event/update:500-internal-server-error'
        );
        cy.mocksUseRouteVariant(
          'people/v1/calendar-event/get-list:200-success'
        );

        cy.visit('/staff/setup/calendar');
        cy.get('[data-testid="staffSetupCalendar-editSectionIcon"]').click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField-EVENT"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-selectionModal-submitButton"]'
        ).click();

        cy.get('[data-testid="staffSetupCalendar-eventRow-itemOptions"]')
          .first()
          .click();
        cy.get('[data-testid="staffSetupCalendar-eventRow-itemEdit"]').click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show toast error message', () => {
        const mockedSelectedTag = '1p7ttli5';
        cy.get('[data-testid="staffSetupCalendar-eventFields-name"]')
          .find('input')
          .should('have.value', 'Event A');

        cy.get('[data-testid="staffSetupCalendar-eventFields-description"]')
          .find('input')
          .should('have.value', 'Event A Description');

        cy.get(
          '[data-testid="staffSetupCalendar-eventFields-dateType"]'
        ).click();
        cy.get(
          `[data-testid=staffSetupCalendar-eventFields-dateType-optionId-SPECIFIC_DAY]`
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-eventFields-dateValue"]'
        ).click();
        cy.get(
          `[data-testid=staffSetupCalendar-eventFields-dateValue-optionId-10]`
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-eventFields-calendarTagId"]'
        ).click();
        cy.get(
          `[data-testid=staffSetupCalendar-eventFields-calendarTagId-${mockedSelectedTag}]`
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-eventModal-submitButton"]'
        ).click();

        cy.get('[data-testid="staffSetupCalendar-toast"]').should('be.visible');
        cy.get('[data-testid="staffSetupCalendar-toast-errorAlert"]').should(
          'be.visible'
        );
      });

      it('should show toast success message and close modal', () => {
        cy.mocksUseRouteVariant(
          'people/v1/calendar-event/update:200-update-event-success'
        );
        cy.getSelectFieldClickOption(
          'staffSetupCalendar-eventFields-isAutomatedReminder',
          '0'
        );

        cy.get(
          '[data-testid="staffSetupCalendar-eventModal-submitButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-toast"]').should('be.visible');
        cy.get('[data-testid="staffSetupCalendar-toast-successAlert"]').should(
          'be.visible'
        );
      });
    });
  });

  describe('when user select tags section', () => {
    describe('when get list tags successfully', () => {
      before(() => {
        cy.mocksUseRouteVariant('people/v1/calendar-tag/get-list:200-success');
        cy.login(STAFF_AUDITOR);
        cy.visit('/staff/setup/calendar');
        cy.get('[data-testid="staffSetupCalendar-editSectionIcon"]').click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should open modal for selecting Tags', () => {
        cy.get(
          '[data-testid="staffSetupCalendar-selectionModal-title"]'
        ).should('be.visible');
        cy.get(
          '[data-testid="staffSetupCalendar-selectionModal-description"]'
        ).should('be.visible');

        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField-TAG"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-selectionModal-submitButton"]'
        ).click();
      });

      it('should display correctly data of Tags', () => {
        cy.contains('Selection selected: Tags');

        const columnNames = [
          'Name',
          'Description',
          'Require Adjustment',
          'Tag Adjusted Against',
          'Status',
        ];
        const firstRowData = [
          'Alpha',
          'Alpha Description',
          'No',
          '-',
          'Active',
        ];

        columnNames.forEach((name) => cy.contains(name));
        firstRowData.forEach((value) => cy.contains(value));
      });
    });

    describe('when get list tags failed', () => {
      before(() => {
        cy.login(STAFF_AUDITOR);
        cy.mocksUseRouteVariant(
          'people/v1/calendar-tag/get-list:500-internal-server-error'
        );

        cy.visit('/staff/setup/calendar');
        cy.get('[data-testid="staffSetupCalendar-editSectionIcon"]').click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField-TAG"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-selectionModal-submitButton"]'
        ).click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show toast error message when API is not responding', () => {
        cy.get('[data-testid="staffSetupCalendar-toast"]').should('be.visible');
        cy.get('[data-testid="staffSetupCalendar-toast-errorAlert"]').should(
          'be.visible'
        );
      });
    });

    describe('when create new tag', () => {
      before(() => {
        cy.login(STAFF_AUDITOR);
        cy.mocksUseRouteVariant(
          'people/v1/calendar-tag/get-selection:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/calendar-tag/create:200-create-tag-success'
        );
        cy.mocksUseRouteVariant('people/v1/calendar-tag/get-list:200-success');

        cy.visit('/staff/setup/calendar');
        cy.get('[data-testid="staffSetupCalendar-editSectionIcon"]').click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField-TAG"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-selectionModal-submitButton"]'
        ).click();

        cy.get(
          '[data-testid="staffSetupCalendar-dataGrid-MoreVertButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-newSectionIcon"]').click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show toast success message and close modal', () => {
        const mockedSelectedTag = '1p7ttli5';
        cy.get('[data-testid="staffSetupCalendar-tagFields-name"]')
          .type('Abc')
          .find('input')
          .should('have.value', 'Abc');

        cy.get('[data-testid="staffSetupCalendar-tagFields-description"]')
          .type('description')
          .find('input')
          .should('have.value', 'description');

        cy.get(
          '[data-testid="staffSetupCalendar-tagFields-isAdjustmentRequired"]'
        ).click();
        cy.get(
          `[data-testid=staffSetupCalendar-tagFields-isAdjustmentRequired-optionId-1]`
        ).click();

        cy.get(
          '[data-testid="staffSetupCalendar-tagFields-adjustmentCalendarTagId"]'
        ).click();
        cy.get(
          `[data-testid=staffSetupCalendar-tagFields-adjustmentCalendarTagId-${mockedSelectedTag}]`
        ).click();

        cy.get(
          '[data-testid="staffSetupCalendar-tagFields-adjustmentEvent"]'
        ).click();
        cy.get(
          `[data-testid=staffSetupCalendar-tagFields-adjustmentEvent-optionId-BEFORE_AFFECTED_EVENT]`
        ).click();

        cy.get(
          '[data-testid="staffSetupCalendar-tagFields-adjustmentMethod"]'
        ).click();
        cy.get(
          `[data-testid=staffSetupCalendar-tagFields-adjustmentMethod-optionId-WORKING_DAYS]`
        ).click();

        cy.get('[data-testid="staffSetupCalendar-tagFields-adjustmentDays"]')
          .type('3')
          .find('input')
          .should('have.value', '3');

        cy.get(
          '[data-testid="staffSetupCalendar-tagModal-submitButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-toast"]').should('be.visible');
        cy.get('[data-testid="staffSetupCalendar-toast-successAlert"]').should(
          'be.visible'
        );
      });
    });

    describe('when update a tag', () => {
      before(() => {
        cy.login(STAFF_AUDITOR);
        cy.mocksUseRouteVariant(
          'people/v1/calendar-tag/get-selection:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/calendar-tag/update:500-internal-server-error'
        );
        cy.mocksUseRouteVariant('people/v1/calendar-tag/get-list:200-success');

        cy.visit('/staff/setup/calendar');
        cy.get('[data-testid="staffSetupCalendar-editSectionIcon"]').click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField-TAG"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-selectionModal-submitButton"]'
        ).click();

        cy.get('[data-testid="staffSetupCalendar-tagRow-itemOptions"]')
          .first()
          .click();
        cy.get('[data-testid="staffSetupCalendar-tagRow-itemEdit"]').click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show toast error message', () => {
        const mockedSelectedTag = '1p7ttli5';
        cy.get('[data-testid="staffSetupCalendar-tagFields-name"]')
          .find('input')
          .should('have.value', 'Alpha');

        cy.get('[data-testid="staffSetupCalendar-tagFields-description"]')
          .find('input')
          .should('have.value', 'Alpha Description');

        cy.get(
          '[data-testid="staffSetupCalendar-tagFields-isAdjustmentRequired"]'
        ).click();
        cy.get(
          `[data-testid=staffSetupCalendar-tagFields-isAdjustmentRequired-optionId-1]`
        ).click();

        cy.get(
          '[data-testid="staffSetupCalendar-tagFields-adjustmentCalendarTagId"]'
        ).click();
        cy.get(
          `[data-testid=staffSetupCalendar-tagFields-adjustmentCalendarTagId-${mockedSelectedTag}]`
        ).click();

        cy.get(
          '[data-testid="staffSetupCalendar-tagFields-adjustmentEvent"]'
        ).click();
        cy.get(
          `[data-testid=staffSetupCalendar-tagFields-adjustmentEvent-optionId-BEFORE_AFFECTED_EVENT]`
        ).click();

        cy.get(
          '[data-testid="staffSetupCalendar-tagFields-adjustmentMethod"]'
        ).click();
        cy.get(
          `[data-testid=staffSetupCalendar-tagFields-adjustmentMethod-optionId-WORKING_DAYS]`
        ).click();

        cy.get('[data-testid="staffSetupCalendar-tagFields-adjustmentDays"]')
          .type('3')
          .find('input')
          .should('have.value', '3');

        cy.get(
          '[data-testid="staffSetupCalendar-tagModal-submitButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-toast"]').should('be.visible');
        cy.get('[data-testid="staffSetupCalendar-toast-errorAlert"]').should(
          'be.visible'
        );
      });

      it('should show toast error message for TagCannotBeAdjusted', () => {
        cy.mocksUseRouteVariant(
          'people/v1/calendar-tag/update:400-invalid-error'
        );
        cy.get(
          '[data-testid="staffSetupCalendar-tagModal-submitButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-toast"]').should('be.visible');
        cy.get('[data-testid="staffSetupCalendar-toast-errorAlert"]').should(
          'be.visible'
        );
      });

      it('should show toast success message and close modal', () => {
        cy.mocksUseRouteVariant(
          'people/v1/calendar-tag/update:200-update-tag-success'
        );
        cy.get(
          '[data-testid="staffSetupCalendar-tagModal-submitButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-toast"]').should('be.visible');
        cy.get('[data-testid="staffSetupCalendar-toast-successAlert"]').should(
          'be.visible'
        );
      });
    });

    describe('when update tag status', () => {
      before(() => {
        cy.login(STAFF_AUDITOR);
        cy.mocksUseRouteVariant(
          'people/v1/calendar-tag/get-selection:200-success'
        );
        cy.mocksUseRouteVariant('people/v1/calendar-tag/get-list:200-success');

        cy.visit('/staff/setup/calendar');
        cy.get('[data-testid="staffSetupCalendar-editSectionIcon"]').click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField-TAG"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-selectionModal-submitButton"]'
        ).click();

        cy.get('[data-testid="staffSetupCalendar-tagRow-itemOptions"]')
          .first()
          .click();
        cy.get('[data-testid="staffSetupCalendar-tagRow-itemUpdate"]').click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show toast error message', () => {
        cy.mocksUseRouteVariant(
          'people/v1/calendar-tag/update:500-internal-server-error'
        );
        cy.typeAutocompleteClickOptionIndex(
          'staffSetupCalendar-field-status',
          'Inactive',
          0
        );
        cy.get(
          '[data-testid="staffSetupCalendar-updateStatusModal-submitButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-toast"]').should('be.visible');
        cy.get('[data-testid="staffSetupCalendar-toast-errorAlert"]').should(
          'be.visible'
        );
      });

      it('should update success and close modal', () => {
        const newStatus = 'Active';
        cy.mocksUseRouteVariant(
          'people/v1/calendar-tag/update:200-update-tag-success'
        );

        cy.get('[data-testid="staffSetupCalendar-tagRow-itemOptions"]')
          .first()
          .click();
        cy.get('[data-testid="staffSetupCalendar-tagRow-itemUpdate"]').click();

        cy.typeAutocompleteClickOptionIndex(
          'staffSetupCalendar-field-status',
          newStatus,
          0
        );

        cy.get(
          '[data-testid="staffSetupCalendar-updateStatusModal-submitButton"]'
        ).click();
        cy.contains(newStatus);
      });
    });
  });

  describe('when user select Calendar section', () => {
    const inputCorrectData = () => {
      const mockedSelectedTag = '1p7ttli5';
      cy.get('[data-testid="staffSetupCalendar-calendarFields-name"]')
        .type('Abc')
        .find('input')
        .should('have.value', 'Abc');

      cy.get('[data-testid="staffSetupCalendar-calendarFields-description"]')
        .type('description')
        .find('input')
        .should('have.value', 'description');

      cy.get(
        '[data-testid="staffSetupCalendar-calendarFields-hireType"]'
      ).click();
      cy.get(
        '[data-testid="staffSetupCalendar-calendarFields-hireType-optionId-POM"]'
      ).click();

      cy.get(
        '[data-testid="staffSetupCalendar-calendarFields-triggerPoint"]'
      ).click();
      cy.get(
        `[data-testid="staffSetupCalendar-calendarFields-triggerPoint-optionId-COUNTRY_DATA_SUBMISSION"]`
      ).click();
      cy.get(
        '[data-testid="staffSetupCalendar-calendarFields-countryCode"]'
      ).click();
      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
      cy.get(
        '[data-testid="staffSetupCalendar-calendarFields-calendarPeriod"]'
      ).click();
      cy.get(
        '[data-testid="staffSetupCalendar-calendarFields-calendarPeriod-optionId-MONTHLY"]'
      ).click();
      cy.get(
        '[data-testid="staffSetupCalendar-calendarFields-calendarTags"]'
      ).click();
      cy.get(
        `[data-testid=staffSetupCalendar-calendarFields-calendarTags-${mockedSelectedTag}]`
      ).click();
    };

    before(() => {
      cy.login(STAFF_AUDITOR);
      cy.visit('/staff/setup/calendar');
      cy.get('[data-testid="staffSetupCalendar-editSectionIcon"]').click();
      cy.mocksUseRouteVariant('people/v1/calendar-config/get-list:200-success');
    });

    after(() => {
      cy.mocksRestoreRouteVariants();
    });

    it('should open modal for selecting Calendar', () => {
      cy.get('[data-testid="staffSetupCalendar-selectionModal-title"]').should(
        'be.visible'
      );
      cy.get(
        '[data-testid="staffSetupCalendar-selectionModal-description"]'
      ).should('be.visible');

      cy.get(
        '[data-testid="staffSetupCalendar-sectionNameSelectField"]'
      ).click();
      cy.get(
        '[data-testid="staffSetupCalendar-sectionNameSelectField-CALENDAR"]'
      ).click();
      cy.get(
        '[data-testid="staffSetupCalendar-selectionModal-submitButton"]'
      ).click();
    });

    it('should display correctly data of Calendar', () => {
      cy.contains('Selection selected: Calendar');

      const columnNames = [
        'Name',
        'Description',
        'Total Tags',
        'Calendar Period',
        'Status',
      ];
      const firstRowData = [
        'Calendar 1',
        'Calendar 1 Description',
        '-',
        'Monthly',
        'Active',
      ];

      columnNames.forEach((name) => cy.contains(name));
      firstRowData.forEach((value) => cy.contains(value));
    });

    describe('when get list calendar failed', () => {
      before(() => {
        cy.login(STAFF_AUDITOR);
        cy.mocksUseRouteVariant(
          'people/v1/calendar-config/get-list:500-internal-server-error'
        );

        cy.visit('/staff/setup/calendar');
        cy.get('[data-testid="staffSetupCalendar-editSectionIcon"]').click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField-CALENDAR"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-selectionModal-submitButton"]'
        ).click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show toast error message when API is not responding', () => {
        cy.get('[data-testid="staffSetupCalendar-toast"]').should('be.visible');
        cy.get('[data-testid="staffSetupCalendar-toast-errorAlert"]').should(
          'be.visible'
        );
      });
    });

    describe('when create a new calendar config success', () => {
      before(() => {
        cy.login(STAFF_AUDITOR);
        cy.mocksUseRouteVariant(
          'people/v1/calendar-config/get-selection:200-success'
        );
        cy.mocksUseRouteVariant('people/v1/country/get-countries:200-success');
        cy.mocksUseRouteVariant(
          'people/v1/calendar-config/create:200-create-calendar-config-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/calendar-config/get-list:200-success'
        );

        cy.visit('/staff/setup/calendar');
        cy.get('[data-testid="staffSetupCalendar-editSectionIcon"]').click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField-CALENDAR"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-selectionModal-submitButton"]'
        ).click();

        cy.get(
          '[data-testid="staffSetupCalendar-dataGrid-MoreVertButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-newSectionIcon"]').click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show toast success message and close modal', () => {
        inputCorrectData();

        cy.get(
          '[data-testid="staffSetupCalendar-calendarModal-submitButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-toast"]').should('be.visible');
        cy.get('[data-testid="staffSetupCalendar-toast-successAlert"]').should(
          'be.visible'
        );
      });
    });
    describe('when create a new calendar config fail', () => {
      before(() => {
        cy.login(STAFF_AUDITOR);
        cy.mocksUseRouteVariant(
          'people/v1/calendar-config/get-selection:200-success'
        );
        cy.mocksUseRouteVariant('people/v1/country/get-countries:200-success');
        cy.mocksUseRouteVariant(
          'people/v1/calendar-config/create:500-create-config-internal-server-error'
        );
        cy.visit('/staff/setup/calendar');
        cy.get('[data-testid="staffSetupCalendar-editSectionIcon"]').click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField-CALENDAR"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-selectionModal-submitButton"]'
        ).click();

        cy.get(
          '[data-testid="staffSetupCalendar-dataGrid-MoreVertButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-newSectionIcon"]').click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show toast error message', () => {
        inputCorrectData();

        cy.get(
          '[data-testid="staffSetupCalendar-calendarModal-submitButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-toast"]').should('be.visible');
        cy.get('[data-testid="staffSetupCalendar-toast-errorAlert"]').should(
          'be.visible'
        );
      });
    });

    describe('when update a calendar config', () => {
      before(() => {
        cy.login(STAFF_AUDITOR);
        cy.mocksUseRouteVariant(
          'people/v1/calendar-config/get-list:200-success'
        );
        cy.mocksUseRouteVariant(
          'people/v1/calendar-config/update:500-internal-server-error'
        );
        cy.mocksUseRouteVariant(
          'people/v1/calendar-config/get-selection:200-success'
        );

        cy.visit('/staff/setup/calendar');
        cy.get('[data-testid="staffSetupCalendar-editSectionIcon"]').click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-sectionNameSelectField-CALENDAR"]'
        ).click();
        cy.get(
          '[data-testid="staffSetupCalendar-selectionModal-submitButton"]'
        ).click();

        cy.get('[data-testid="staffSetupCalendar-calendarRow-itemOptions"]')
          .first()
          .click();
        cy.get(
          '[data-testid="staffSetupCalendar-calendarRow-itemEdit"]'
        ).click();
      });

      after(() => {
        cy.mocksRestoreRouteVariants();
      });

      it('should show toast error message', () => {
        cy.mocksUseRouteVariant(
          'people/v1/calendar-config/update:500-internal-server-error'
        );

        cy.get('[data-testid="staffSetupCalendar-calendarFields-name"]')
          .find('input')
          .clear();
        cy.get('[data-testid="staffSetupCalendar-calendarFields-description"]')
          .find('input')
          .clear();
        inputCorrectData();

        cy.get(
          '[data-testid="staffSetupCalendar-calendarModal-submitButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-toast"]').should('be.visible');
        cy.get('[data-testid="staffSetupCalendar-toast-errorAlert"]').should(
          'be.visible'
        );
      });

      it('should show toast success message and close modal', () => {
        cy.mocksUseRouteVariant(
          'people/v1/calendar-config/update:200-update-success'
        );

        cy.get(
          '[data-testid="staffSetupCalendar-calendarModal-submitButton"]'
        ).click();
        cy.get('[data-testid="staffSetupCalendar-toast"]').should('be.visible');
        cy.get('[data-testid="staffSetupCalendar-toast-successAlert"]').should(
          'be.visible'
        );
      });
    });
  });
});
