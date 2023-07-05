import { FileManagementUploadResponse } from '@ayp/typings/commons';
import { HireType } from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
import { getAssetUrl } from '@ayp/utils';
import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

export const WORKER_BULK_UPLOAD_TEMPLATE_LINK = getAssetUrl(
  'shared/doc/worker-bulk-upload-template.xlsx'
);

export interface StaffAuditClientHiresFormValues {
  hireType: Nullable<HireType>;
  company: Nullable<Option<string>>;
  csvBulkUpload?: File;
  uploadContext?: FileManagementUploadResponse;
}

export const initialValues: StaffAuditClientHiresFormValues = {
  hireType: null,
  company: null,
};

export const validationSchema = yup.object({
  hireType: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
  company: yup.object().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  csvBulkUpload: yup.mixed().required(REQUIRED_FIELD_ERROR_MESSAGE),
});
