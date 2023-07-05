import { CalendarTag } from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
import { yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';

import {
  CONTAIN_ONLY_NUMERIC_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

export interface FormValues
  extends Omit<
    CalendarTag,
    | 'calendarTagId'
    | 'status'
    | 'createdAt'
    | 'updatedAt'
    | 'id'
    | 'isAdjustmentRequired'
    | 'adjustmentCalendarTagId'
  > {
  calendarTagId: Nullable<string>;
  isAdjustmentRequired: Nullable<boolean>;
  adjustmentCalendarTagId: Nullable<Option<string>>;
}

export type ApiRequestBody = Omit<
  CalendarTag,
  'calendarTagId' | 'status' | 'createdAt' | 'updatedAt' | 'id'
>;

export const mapToRequestBody = (values: FormValues): ApiRequestBody =>
  Object.assign({}, values, {
    isAdjustmentRequired: !!values.isAdjustmentRequired,
    adjustmentCalendarTagId: values?.adjustmentCalendarTagId?.id,
  });

export const validationSchema = yup.object({
  name: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  description: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  isAdjustmentRequired: yup
    .boolean()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  adjustmentCalendarTagId: yup
    .object()
    .nullable()
    .when('isAdjustmentRequired', {
      is: true,
      then: yup.object().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  adjustmentEvent: yup
    .string()
    .nullable()
    .when('isAdjustmentRequired', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  adjustmentMethod: yup
    .string()
    .nullable()
    .when('isAdjustmentRequired', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  adjustmentDays: yup
    .number()
    .nullable()
    .when('isAdjustmentRequired', {
      is: true,
      then: yup
        .number()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .test({
          message: CONTAIN_ONLY_NUMERIC_ERROR_MESSAGE,
          test: (value) => yupCustomValidation.isNumeric(value?.toString()),
        }),
    }),
});

export const initialValues: FormValues = {
  name: '',
  description: '',
  calendarTagId: null,
  isAdjustmentRequired: null,
  adjustmentCalendarTagId: null,
  adjustmentEvent: null,
  adjustmentMethod: null,
  adjustmentDays: null,
};
