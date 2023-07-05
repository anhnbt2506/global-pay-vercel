import { BankAccount, HireType } from '@ayp/typings/entities';
import { CountryOption } from '@ayp/typings/ui';
import { TFunction } from 'next-i18next';
import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

export interface SelectionCountry {
  values?: Record<string, unknown>;
  isDecrypted: boolean;
  t: TFunction;
}

export interface ServiceSelectionsFormValue {
  hireType: Nullable<HireType>;
  country: Nullable<CountryOption>;
  shouldDecrypt: Nullable<boolean>;
  password?: Nullable<string>;
}

export const validationSchema = yup.object({
  hireType: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  country: yup.object().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  shouldDecrypt: yup
    .boolean()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  password: yup
    .string()
    .nullable()
    .when('shouldDecrypt', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
});

export const initialValues: ServiceSelectionsFormValue = {
  hireType: null,
  country: null,
  shouldDecrypt: null,
  password: null,
};

export const mapInitialServiceDetails = (
  data: Record<string, unknown> & { bankAccount: Nullable<BankAccount> }
): Record<string, unknown> => {
  return {
    ...data,
    bankAccount: data.bankAccount
      ? {
          ...data.bankAccount,
          bankId: {
            id: data.bankAccount?.bankId,
            label: data.bankAccount?.bank.bankName,
          },
        }
      : null,
  };
};
