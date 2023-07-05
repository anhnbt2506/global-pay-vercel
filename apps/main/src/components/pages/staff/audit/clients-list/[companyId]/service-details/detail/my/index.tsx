import { FC, useCallback } from 'react';
import { get } from 'lodash-es';
import { TFunction } from 'next-i18next';
import { Typography } from '@mui/material';
import { CompanyMalaysia } from '@ayp/typings/entities';

import {
  PAYROLL_CYCLE_LABEL_PREFIX,
  PRORATE_SALARY_FORMULA_LABEL_PREFIX,
} from '@configs/constants';

import { SERVICE_DETAILS_FIELDS } from './config';
import { DecryptedText, LineSection } from '../commons';

const MyDetailFields: FC<{
  values: CompanyMalaysia;
  t: TFunction;
  isDecrypted: boolean;
}> = ({ t, values, isDecrypted }) => {
  const mapValueForDisplay = useCallback<(fieldName: string) => string>(
    (fieldName) => {
      const {
        payrollCycle,
        prorateSalaryFormula,
        isAypAssistESubmission,
        socsoEmail,
        socsoPassword,
        epfUserId,
        epfPassword,
        cp39UserId,
        cp39Password,
        isUsingDisbursementService,
        bankAccount,
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
        case 'socsoEmail':
          return socsoEmail ? (
            <DecryptedText text={socsoEmail} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'socsoPassword':
          return socsoPassword ? (
            <DecryptedText text={socsoPassword} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'epfUserId':
          return epfUserId ? (
            <DecryptedText text={epfUserId} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'epfPassword':
          return epfPassword ? (
            <DecryptedText text={epfPassword} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'cp39UserId':
          return cp39UserId ? (
            <DecryptedText text={cp39UserId} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'cp39Password':
          return cp39Password ? (
            <DecryptedText text={cp39Password} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'isAypAssistESubmission':
          return isAypAssistESubmission ? t('common:yes') : t('common:no');
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
          title={t(`serviceDetailsForm.myFields.${field.labelKey}`)}
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

export default MyDetailFields;
