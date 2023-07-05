import * as yup from 'yup';
import { yupCustomValidation } from '@ayp/utils';
import { format } from 'date-fns';

import {
  CONTAIN_ONLY_NUMERIC_ERROR_MESSAGE,
  CONTAIN_SPACES_ERROR_MESSAGE,
  INVALID_DATE_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';
import { GP_BACKEND_DATE_FORMAT } from '@configs/constants';

import { WorkerEmploymentFormValues } from '../../../../config';

export const mapToRequestBody = (
  state: WorkerEmploymentFormValues
): Record<string, unknown> =>
  Object.assign(
    {},
    {
      additionalInfo: {
        socialInsuranceBookNo: state.additionalInfo.socialInsuranceBookNo,
        localHospitalForStatutoryMedicalInsurance:
          state.additionalInfo.localHospitalForStatutoryMedicalInsurance,
      },
    },
    state.probationStartDate && {
      probationStartDate: format(
        state.probationStartDate,
        GP_BACKEND_DATE_FORMAT
      ),
    },
    state.probationEndDate && {
      probationEndDate: format(state.probationEndDate, GP_BACKEND_DATE_FORMAT),
    }
  );

export const validationSchema = yup.object({
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
        'staff-audit-client-hires-employment-id:informationForm.editModals.addOnEmploymentDetails.vn.probationEndDate.error.probationEndDateMustBeLaterThanProbationStartDate',
      test: function (value) {
        return yupCustomValidation.isDateAfter(
          value,
          this.parent.probationStartDate
        );
      },
    }),
  additionalInfo: yup.object({
    socialInsuranceBookNo: yup
      .string()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .test({
        message: CONTAIN_ONLY_NUMERIC_ERROR_MESSAGE,
        test: (value) => yupCustomValidation.isNumeric(value),
      })
      .test({
        message: CONTAIN_SPACES_ERROR_MESSAGE,
        test: (value) => yupCustomValidation.isNotContainSpaces(value),
      }),
    localHospitalForStatutoryMedicalInsurance: yup
      .string()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
});
