import { FileManagementUploadResponse } from '@ayp/typings/commons';
import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

export interface FileManagementReUploadValues {
  reUploadFile?: File;
  uploadContext?: FileManagementUploadResponse;
}

export const initialValues: FileManagementReUploadValues = {};

export const validationSchema = yup.object({
  reUploadFile: yup.mixed().required(REQUIRED_FIELD_ERROR_MESSAGE),
});
