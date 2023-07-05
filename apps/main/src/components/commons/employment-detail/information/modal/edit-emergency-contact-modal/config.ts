import { EmergencyContactRelationship } from '@ayp/typings/entities';
import { mapFilterObject, yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';

import {
  CONTAIN_SPACES_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
  INVALID_EMERGENCY_CONTACT_RELATIONSHIP_FIELD_ERROR_MESSAGE,
  CONTAIN_ONLY_NUMERIC_ERROR_MESSAGE,
} from '@configs/forms';

import { WorkerEmploymentFormValues } from '../../config';

export const mapToRequestBody = (
  state: WorkerEmploymentFormValues
): Record<string, unknown> =>
  mapFilterObject(
    Object.assign(
      {},
      {
        workerContact: {
          emergencyContactName: state.workerContact.emergencyContactName,
          emergencyContactRelationship:
            state.workerContact.emergencyContactRelationship,
          emergencyContactNumber: state.workerContact.emergencyContactNumber,
          emergencyContactNumberCountryCode:
            state.workerContact.emergencyContactNumberCountryCode?.code,
        },
      }
    ),
    (value) => (value !== '' ? value : null)
  );

export const validationSchema = yup.object({
  workerContact: yup.object().shape({
    emergencyContactName: yup
      .string()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    emergencyContactRelationship: yup
      .mixed()
      .nullable()
      .oneOf(Object.values(EmergencyContactRelationship))
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_EMERGENCY_CONTACT_RELATIONSHIP_FIELD_ERROR_MESSAGE),
    emergencyContactNumberCountryCode: yup
      .object()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    emergencyContactNumber: yup
      .string()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .test({
        message: CONTAIN_ONLY_NUMERIC_ERROR_MESSAGE,
        test: (value) => yupCustomValidation.isAlphaNumeric(value),
      })
      .test({
        message: CONTAIN_SPACES_ERROR_MESSAGE,
        test: (value) => yupCustomValidation.isNotContainSpaces(value),
      }),
  }),
});
