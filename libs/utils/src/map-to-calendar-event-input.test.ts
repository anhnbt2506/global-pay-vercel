import { mapToCalendarEventInput } from './map-to-calendar-event-input';

describe('mapToCalendarEventInput', () => {
  it('should return correct list event input', () => {
    const rawData = [
      {
        calendarEventId: 'w8je69dp',
        date: '2022-12-20',
        name: 'TH event',
        description: 'TH event',
      },
      {
        calendarEventId: 'n42eobql',
        date: '2022-12-30',
        name: 'TH event 2',
        description: 'TH event 2',
      },
    ];
    const expectData = [
      {
        id: 'w8je69dp',
        start: '2022-12-20',
        title: 'TH event',
        extendedProps: { description: 'TH event' },
      },
      {
        id: 'n42eobql',
        start: '2022-12-30',
        title: 'TH event 2',
        extendedProps: { description: 'TH event 2' },
      },
    ];

    expect(mapToCalendarEventInput(rawData)).toEqual(expectData);
  });
});
