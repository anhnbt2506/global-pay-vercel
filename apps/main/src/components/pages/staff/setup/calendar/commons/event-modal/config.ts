import { CalendarEvent, CalendarTag, DateType } from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
import { format } from 'date-fns';
import * as yup from 'yup';

import { GP_BACKEND_DATE_FORMAT } from '@configs/constants';
import {
  INVALID_POSITIVE_INTEGER_FIELD_ERROR_MESSAGE,
  INVALID_TIME_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

export interface FormValues
  extends Omit<
    CalendarEvent,
    | 'status'
    | 'createdAt'
    | 'updatedAt'
    | 'id'
    | 'calendarTagId'
    | 'calendarTag'
    | 'isAutomatedReminder'
    | 'dateValue'
  > {
  calendarTagId: Nullable<Option<string>>;
  calendarTag: Nullable<CalendarTag>;
  isAutomatedReminder: Nullable<boolean>;
  dateValue: Nullable<Date> | string;
}

export type ApiRequestBody = Omit<
  CalendarEvent,
  'status' | 'createdAt' | 'updatedAt' | 'id' | 'calendarTag'
>;

export const mapToRequestBody = (values: FormValues): ApiRequestBody => {
  const { dateValue, dateType, calendarTagId, isAutomatedReminder } = values;

  return Object.assign(
    {},
    values,
    {
      calendarTagId: calendarTagId?.id,
      isAutomatedReminder: !!isAutomatedReminder,
    },
    dateType === DateType.CALENDAR_DATE && {
      dateValue: dateValue
        ? format(new Date(dateValue), GP_BACKEND_DATE_FORMAT)
        : null,
    },
    dateType !== DateType.CALENDAR_DATE && {
      dateValue: dateValue,
    }
  );
};

export const validationSchema = yup.object({
  name: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  description: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  dateType: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  dateValue: yup
    .string()
    .nullable()
    .when('dateType', (dateType, schema) => {
      if (dateType === DateType.CALENDAR_DATE) {
        return yup
          .date()
          .nullable()
          .required(REQUIRED_FIELD_ERROR_MESSAGE)
          .typeError(INVALID_TIME_FIELD_ERROR_MESSAGE);
      }
      if (dateType === DateType.SPECIFIC_DAY) {
        return yup.number().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE);
      }
      if (dateType === DateType.CLIENT_INPUT_DATE) {
        return yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE);
      }
      return schema;
    }),
  calendarTagId: yup.object().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  isAutomatedReminder: yup
    .boolean()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  reminderBasedOn: yup
    .string()
    .nullable()
    .when('isAutomatedReminder', (isAutomatedReminder, schema) => {
      if (isAutomatedReminder) {
        return yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE);
      }
      return schema;
    }),
  reminderDayBeforeEvent: yup
    .number()
    .nullable()
    .when('isAutomatedReminder', (isAutomatedReminder, schema) => {
      if (isAutomatedReminder) {
        return yup
          .number()
          .nullable()
          .positive(INVALID_POSITIVE_INTEGER_FIELD_ERROR_MESSAGE)
          .required(REQUIRED_FIELD_ERROR_MESSAGE);
      }
      return schema;
    }),
});

export const initialValues: FormValues = {
  name: '',
  description: '',
  dateType: null,
  dateValue: null,
  calendarTagId: null,
  calendarEventId: '',
  calendarTag: null,
  isAutomatedReminder: null,
  reminderBasedOn: null,
  reminderDayBeforeEvent: null,
};

export const mapToEventFormValues = (event: FormValues) => ({
  ...event,
  ...(event.dateType === DateType.CALENDAR_DATE && {
    dateValue: event?.dateValue ? new Date(event.dateValue) : null,
  }),
});
