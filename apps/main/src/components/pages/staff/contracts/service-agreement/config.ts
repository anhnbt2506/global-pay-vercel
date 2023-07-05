import { ServiceAgreementType } from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
import { TFunction } from 'next-i18next';
import * as yup from 'yup';

import { SERVICE_AGREEMENT_LABEL_PREFIX } from '@configs/constants';
import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

export interface StaffContractsServiceAgreementFormValues {
  content: string;
}

export const validationSchema = yup.object({
  content: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
});

export const getServiceAgreementOptions = (t: TFunction): Option[] =>
  Object.keys(ServiceAgreementType).map((key) => ({
    id: ServiceAgreementType[key as keyof typeof ServiceAgreementType],
    label: t(`${SERVICE_AGREEMENT_LABEL_PREFIX}${key}`),
  }));
