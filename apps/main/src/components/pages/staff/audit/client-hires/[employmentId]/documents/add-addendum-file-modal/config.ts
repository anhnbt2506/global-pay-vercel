import { FileKey, UploadedFile } from '@ayp/typings/ui';
import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

export const mapToRequestBody = (
  values: AddAddendumFileFormValues & { addendumFileKeys: FileKey[] }
): {
  addendumFileKeys: FileKey[];
  comment?: string;
} => ({
  addendumFileKeys: values.addendumFileKeys,
  comment: values.notifyChange ? values.comment : undefined,
});

export interface AddAddendumFileFormValues {
  addendumFiles: UploadedFile[];
  notifyChange?: boolean;
  comment?: string;
}

export const initialFormValues: AddAddendumFileFormValues = {
  addendumFiles: [],
  notifyChange: true,
  comment: undefined,
};

export const validationSchema = yup.object({
  addendumFiles: yup.array().min(1, '').required(REQUIRED_FIELD_ERROR_MESSAGE),
  notifyChange: yup.boolean(),
  comment: yup.string().when('notifyChange', {
    is: true,
    then: yup.string().trim().required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
});
