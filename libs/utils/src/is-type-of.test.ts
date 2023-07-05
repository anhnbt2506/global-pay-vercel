import { CalendarEvent, CalendarStatus } from '@ayp/typings/entities';

import { isTypeOf } from '.';

describe('isTypeOf', () => {
  it('should return true when correct type given', () => {
    const obj = {
      id: 4,
      calendarEventId: 'xaodx1om',
      calendarTagId: 'wpr615z0',
      name: 'ID - Calendar 1',
      description: 'this is test tag',
      dateType: 'CALENDAR_DATE',
      dateValue: '2022-12-31',
      createdAt: '2022-12-29T07:50:27.000000Z',
      status: 'ACTIVE',
    };
    expect(
      isTypeOf<CalendarEvent>(obj, [
        'calendarEventId',
        'calendarTagId',
        'dateType',
      ])
    ).toBe(true);
  });

  it('should return true when sending checkFunc with correct type given', () => {
    const obj = {
      id: 4,
      calendarEventId: 'xaodx1om',
      calendarTagId: 'wpr615z0',
      name: 'ID - Calendar 1',
      description: 'this is test tag',
      dateType: 'CALENDAR_DATE',
      dateValue: '2022-12-31',
      createdAt: '2022-12-29T07:50:27.000000Z',
      status: 'ACTIVE',
    };

    expect(
      isTypeOf<CalendarEvent>(
        obj,
        ['calendarEventId', 'calendarTagId', 'dateType'],
        () => obj.status in CalendarStatus
      )
    ).toBe(true);
  });

  it('should return false when sending checkFunc with correct type given', () => {
    const obj = {
      id: 4,
      calendarEventId: 'xaodx1om',
      calendarTagId: 'wpr615z0',
      name: 'ID - Calendar 1',
      description: 'this is test tag',
      dateType: 'CALENDAR_DATE',
      dateValue: '2022-12-31',
      createdAt: '2022-12-29T07:50:27.000000Z',
      status: 'ACTIVE',
    };

    expect(
      isTypeOf<CalendarEvent>(
        obj,
        ['calendarId'],
        () => obj.status in CalendarStatus
      )
    ).toBe(false);
  });
});
