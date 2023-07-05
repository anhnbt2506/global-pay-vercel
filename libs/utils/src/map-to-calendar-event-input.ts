import type { EventInput as CalendarEventInput } from '@fullcalendar/core';
import type { CompanyEvent } from '@ayp/typings/entities';

export const mapToCalendarEventInput = (
  rawData: CompanyEvent[]
): CalendarEventInput[] =>
  rawData.map((event) => ({
    id: event.calendarEventId,
    title: event.name,
    start: event.date,
    extendedProps: { description: event.description },
  }));
