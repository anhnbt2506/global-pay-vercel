import { FC, useCallback } from 'react';
import { Typography } from '@mui/material';
import { TFunction } from 'next-i18next';
import { get } from 'lodash-es';
import { CompanyHongKong } from '@ayp/typings/entities';

import {
  PAYROLL_CYCLE_LABEL_PREFIX,
  PRORATE_SALARY_FORMULA_LABEL_PREFIX,
  COMPANY_POM_HK_MPF_PROVIDER_PREFIX,
} from '@configs/constants';

import { SERVICE_DETAILS_FIELDS } from './config';
import { DecryptedText, LineSection } from '../commons';

const HkDetailFields: FC<{
  values: CompanyHongKong;
  t: TFunction;
  isDecrypted: boolean;
}> = ({ t, values, isDecrypted }) => {
  const mapValueForDisplay = useCallback<(fieldName: string) => string>(
    (fieldName) => {
      const {
        bankAccount,
        isAypAssistESubmission,
        isUsingDisbursementService,
        mpfPassword,
        mpfProvider,
        mpfUsername,
        payrollCycle,
        prorateSalaryFormula,
      } = values;

      switch (fieldName) {
        case 'payrollCycle':
          return payrollCycle
            ? t(`${PAYROLL_CYCLE_LABEL_PREFIX}${payrollCycle}`)
            : '-';
        case 'prorateSalaryFormula':
          return prorateSalaryFormula
            ? t(`${PRORATE_SALARY_FORMULA_LABEL_PREFIX}${prorateSalaryFormula}`)
            : '-';
        case 'mpfProvider':
          return mpfProvider
            ? t(`${COMPANY_POM_HK_MPF_PROVIDER_PREFIX}${mpfProvider}`)
            : '-';
        case 'isAypAssistESubmission':
          return isAypAssistESubmission ? t('common:yes') : t('common:no');
        case 'mpfUsername':
          return mpfUsername ? (
            <DecryptedText text={mpfUsername} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'mpfPassword':
          return mpfPassword ? (
            <DecryptedText text={mpfPassword} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'isUsingDisbursementService':
          return isUsingDisbursementService ? t('common:yes') : t('common:no');
        case 'bankName':
          const bankName = get(bankAccount?.bank, 'bankName');
          return bankName ?? '-';
        case 'beneficiaryName':
          const beneficiaryName = get(bankAccount, 'beneficiaryName');
          return beneficiaryName ?? '-';
        case 'accountNumber':
          const accountNumber = get(bankAccount, 'accountNumber');
          return accountNumber ?? '-';
        case 'branchCode':
          const branchCode = get(bankAccount, 'branchCode');
          return branchCode ?? '-';
        default:
          return get(values, fieldName) ?? '-';
      }
    },
    [values, t, isDecrypted]
  );

  return (
    <>
      {SERVICE_DETAILS_FIELDS.commonFields.map((field, key) => (
        <LineSection
          key={key}
          title={t(`serviceDetailsForm.hkFields.${field.labelKey}`)}
          value={<Typography>{mapValueForDisplay(field.fieldName)}</Typography>}
        />
      ))}

      {SERVICE_DETAILS_FIELDS.bankAccount.map((field, key) => (
        <LineSection
          key={key}
          title={t(`serviceDetailsForm.bankAccount.${field.labelKey}`)}
          value={<Typography>{mapValueForDisplay(field.fieldName)}</Typography>}
        />
      ))}
    </>
  );
};

export default HkDetailFields;
