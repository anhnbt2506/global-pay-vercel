import { Option } from '@ayp/typings/ui';
import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

export enum ServiceAgreementOptionsTabs {
  AGREEMENT = 'agreement',
}

export const COMPANY_DETAIL_LABEL_TABS_PREFIX =
  'staff-audit-client-service-agreements-id:';

export const SERVICE_AGREEMENT_TAB_OPTIONS: Option<string>[] = [
  {
    id: ServiceAgreementOptionsTabs.AGREEMENT,
    label: `${COMPANY_DETAIL_LABEL_TABS_PREFIX}${ServiceAgreementOptionsTabs.AGREEMENT}`,
  },
];

export interface StaffAuditClientServiceAgreementFormValues {
  content: string;
}

export const validationSchema = yup.object({
  content: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
});
