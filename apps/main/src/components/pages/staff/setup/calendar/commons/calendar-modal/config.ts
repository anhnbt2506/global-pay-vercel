import {
  CalendarConfig,
  CalendarConfigContext,
  CalendarConfigTriggerPoint,
  CalendarPeriod,
  HireType,
} from '@ayp/typings/entities';
import { CountryOption } from '@ayp/typings/ui';
import { yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

export enum ERROR_MESSAGE {
  SAME_CALENDAR_CONFIGURATION_HAS_BEEN_GENERATED = 'SameCalendarConfigurationHasBeenGenerated',
}

export interface FormValues
  extends Omit<
    CalendarConfig,
    'id' | 'createdAt' | 'updatedAt' | 'calendarConfigId' | 'status' | 'context'
  > {
  context: {
    hireType: Nullable<HireType>;
    triggerPoint: Nullable<CalendarConfigTriggerPoint>;
    calendarPeriod: Nullable<CalendarPeriod>;
    countryCode: Nullable<CountryOption>;
  };
  calendarConfigId: Nullable<string>;
}

export type ApiRequestBody = Omit<
  CalendarConfig,
  'id' | 'createdAt' | 'updatedAt' | 'calendarConfigId' | 'status'
>;

export const mapToRequestBody = (values: FormValues): ApiRequestBody => {
  const { context, calendarTags } = values;
  return Object.assign({}, values, {
    context: {
      hireType: context.hireType,
      triggerPoint: context.triggerPoint,
      calendarPeriod: context.calendarPeriod,
      countryCode: context.countryCode?.code,
    } as CalendarConfigContext,
    calendarTags: calendarTags?.map((calendarTag) => calendarTag.id),
  });
};

export const validationSchema = yup.object({
  name: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  description: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  context: yup.object({
    hireType: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    triggerPoint: yup
      .string()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    calendarPeriod: yup
      .string()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    countryCode: yup.object().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
  calendarTags: yup.array().test({
    message: REQUIRED_FIELD_ERROR_MESSAGE,
    test: (value) => yupCustomValidation.isNotEmptyArray(value),
  }),
});

export const initialValues: FormValues = {
  name: '',
  description: '',
  context: {
    hireType: null,
    triggerPoint: null,
    countryCode: null,
    calendarPeriod: null,
  },
  calendarTags: [],
  calendarConfigId: null,
};
