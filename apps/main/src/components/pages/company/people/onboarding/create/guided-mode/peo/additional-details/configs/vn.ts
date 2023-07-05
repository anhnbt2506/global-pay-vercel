import { CountryCode } from '@ayp/typings/commons';
import { yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';

import { HIRING_COUNTRY_RULES } from '@configs/constants';
import {
  INVALID_DATE_FIELD_ERROR_MESSAGE,
  INVALID_INTEGER_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

const hiringCountryRule = HIRING_COUNTRY_RULES[CountryCode.VIETNAM];

export const mapAdditionalDetails = (
  additionalDetails: Record<string, unknown>
): Record<string, unknown> =>
  Object.assign(
    {},
    {
      terminationNoticeUnit: hiringCountryRule.terminationNotice.unit,
    },
    { additionalDetails }
  );

export const validationSchema = yup.object({
  additionalDetails: yup.object({
    probationStartDate: yup
      .date()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_DATE_FIELD_ERROR_MESSAGE),
    probationEndDate: yup
      .date()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_DATE_FIELD_ERROR_MESSAGE)
      .test({
        message:
          'company-people-onboarding-create:additionalDetails.form.probationEndDate.error.probationEndDateMustBeLaterThanProbationStartDate',
        test: function (value) {
          return yupCustomValidation.isDateAfter(
            value,
            this.parent.probationStartDate
          );
        },
      }),
    paidTimeOff: yup
      .number()
      .integer(INVALID_INTEGER_FIELD_ERROR_MESSAGE)
      .min(hiringCountryRule.paidTimeOff.min ?? 0, '')
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_INTEGER_FIELD_ERROR_MESSAGE),
    sickTimeOff: yup
      .number()
      .integer(INVALID_INTEGER_FIELD_ERROR_MESSAGE)
      .min(hiringCountryRule.sickTimeOff.min ?? 0, '')
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_INTEGER_FIELD_ERROR_MESSAGE),
    terminationNotice: yup
      .number()
      .integer(INVALID_INTEGER_FIELD_ERROR_MESSAGE)
      .min(hiringCountryRule.terminationNotice.min ?? 0, '')
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_INTEGER_FIELD_ERROR_MESSAGE),
    isEligibleForInsurance: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
});
