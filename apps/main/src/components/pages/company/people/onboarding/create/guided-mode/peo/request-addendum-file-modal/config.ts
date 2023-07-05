import { UploadedFile } from '@ayp/typings/ui';
import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

export interface RequestAddendumFormValues {
  addendumFiles: UploadedFile[];
  comment: string;
}

export const initialFormValues: RequestAddendumFormValues = {
  addendumFiles: [],
  comment: '',
};

export const validationSchema = yup.object({
  comment: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
});
