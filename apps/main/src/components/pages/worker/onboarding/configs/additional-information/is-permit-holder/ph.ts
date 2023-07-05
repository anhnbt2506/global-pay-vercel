import * as yup from 'yup';
import { format } from 'date-fns';
import { WorkerPhilippines } from '@ayp/typings/entities';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';
import { GP_BACKEND_DATE_FORMAT } from '@configs/constants';

export const mapAdditionalInformation = (
  additionalInfo: WorkerPhilippines
): { additionalInfo: WorkerPhilippines } =>
  Object.assign(
    {},
    {
      additionalInfo: {
        ...additionalInfo,
        fatherDateOfBirth:
          additionalInfo.fatherDateOfBirth &&
          format(
            new Date(additionalInfo.fatherDateOfBirth),
            GP_BACKEND_DATE_FORMAT
          ),
        motherDateOfBirth:
          additionalInfo.motherDateOfBirth &&
          format(
            new Date(additionalInfo.motherDateOfBirth),
            GP_BACKEND_DATE_FORMAT
          ),
      },
    }
  );

export const validationSchema = yup.object({
  additionalInfo: yup.object({
    fatherName: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    fatherDateOfBirth: yup
      .date()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    motherName: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    motherDateOfBirth: yup
      .date()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    tinIdFile: yup.mixed().required(REQUIRED_FIELD_ERROR_MESSAGE),
    sssIdFile: yup.mixed().required(REQUIRED_FIELD_ERROR_MESSAGE),
    birthCertificateFile: yup.mixed().required(REQUIRED_FIELD_ERROR_MESSAGE),
    healthIdFile: yup.mixed().required(REQUIRED_FIELD_ERROR_MESSAGE),
    hdmfIdFile: yup.mixed().required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
  workerIdentity: yup.object({
    permitIdFile: yup.mixed().required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
});
