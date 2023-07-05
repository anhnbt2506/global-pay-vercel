import { format } from 'date-fns';
import {
  CalendarEvent,
  CalendarStatus,
  CalendarTag,
  DateType,
} from '@ayp/typings/entities';

import { GP_BACKEND_DATE_FORMAT } from '@configs/constants';

export type FormValuesUpdateEvent = Omit<
  CalendarEvent,
  'createdAt' | 'updatedAt' | 'id' | 'calendarTag'
>;

export type ValuesSubmitEventToBE = Omit<
  CalendarEvent,
  'calendarEventId' | 'createdAt' | 'updatedAt' | 'id' | 'calendarTag'
>;

export const mapToRequestBodyForEvents = (
  values: FormValuesUpdateEvent,
  status: CalendarStatus
): ValuesSubmitEventToBE => {
  const {
    name,
    description,
    dateType,
    dateValue,
    calendarTagId,
    isAutomatedReminder,
    reminderBasedOn,
    reminderDayBeforeEvent,
  } = values;
  return Object.assign(
    {},
    {
      name,
      description,
      dateType,
      dateValue,
      calendarTagId,
      status,
      isAutomatedReminder,
      reminderBasedOn,
      reminderDayBeforeEvent,
    },
    {
      dateValue:
        dateType === DateType.CALENDAR_DATE
          ? format(new Date(dateValue), GP_BACKEND_DATE_FORMAT)
          : dateValue,
    }
  );
};

export const initialValues: FormValuesUpdateEvent = {
  name: '',
  description: '',
  dateType: null,
  dateValue: '',
  calendarTagId: '',
  calendarEventId: '',
  status: CalendarStatus.ACTIVE,
  isAutomatedReminder: false,
  reminderBasedOn: null,
  reminderDayBeforeEvent: null,
};

export type FormValuesUpdateTag = Omit<
  CalendarTag,
  'createdAt' | 'updatedAt' | 'id'
>;

export type ValuesSubmitTagToBE = Omit<
  CalendarTag,
  'calendarTagId' | 'createdAt' | 'updatedAt' | 'id'
>;

export const mapToRequestBodyForTag = (
  values: FormValuesUpdateTag,
  status: CalendarStatus
): ValuesSubmitTagToBE => {
  return Object.assign(
    {},
    {
      ...values,
      status,
    }
  );
};
