import type { EventInput, EventSourceFuncArg } from '@fullcalendar/core';

export type CalendarEventInput = EventInput;

export enum CALENDAR_TIME_FORMAT {
  SELECT_MONTH_INPUT = 'MM/yyyy',
  HEADER_TITLE = 'MMMM yyyy',
  GO_TO_DATE_INPUT = 'yyyy-MM',
  POPOVER_DESCRIPTION = 'dd/MM/yyyy',
}

export const DAY_MAX_EVENT_ROWS = 3;

export type FetchEventsApi = (
  arg: EventSourceFuncArg
) => Promise<CalendarEventInput[]>;
