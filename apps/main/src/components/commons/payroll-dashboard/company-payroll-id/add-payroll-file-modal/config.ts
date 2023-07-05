import { FileKey, UploadedFile } from '@ayp/typings/ui';
import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';
import { CreateCompanyPayrollFilesRequest } from '@services/apis/fintech';

export const mapToRequestBody = (
  values: AddFileFormValues & { fileKeys: FileKey[] }
): CreateCompanyPayrollFilesRequest => ({
  fileKeys: values.fileKeys,
  comment: values.comment,
});

export interface AddFileFormValues {
  payrollFiles: UploadedFile[];
  notifyChange?: boolean;
  comment?: string;
}

export const initialFormValues: AddFileFormValues = {
  payrollFiles: [],
  notifyChange: false,
  comment: undefined,
};

export const validationSchema = yup.object({
  payrollFiles: yup.array().min(1, '').required(REQUIRED_FIELD_ERROR_MESSAGE),
  notifyChange: yup.boolean(),
  comment: yup.string().when('notifyChange', {
    is: true,
    then: yup.string().trim().required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
});
