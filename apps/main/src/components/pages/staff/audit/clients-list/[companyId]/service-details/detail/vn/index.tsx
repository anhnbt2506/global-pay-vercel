import { FC, useCallback } from 'react';
import { Typography } from '@mui/material';
import { get } from 'lodash-es';
import { TFunction } from 'next-i18next';
import { CompanyVietnam } from '@ayp/typings/entities';

import {
  COMPANY_POM_VN_SHUI_PROVIDER_LABEL_PREFIX,
  PAYROLL_CYCLE_LABEL_PREFIX,
  PRORATE_SALARY_FORMULA_LABEL_PREFIX,
} from '@configs/constants';

import { SERVICE_DETAILS_FIELDS } from './config';
import { DecryptedText, LineSection } from '../commons';

const VnDetailFields: FC<{
  values: CompanyVietnam;
  t: TFunction;
  isDecrypted: boolean;
}> = ({ values, t, isDecrypted }) => {
  const mapValueForDisplay = useCallback<(fieldName: string) => string>(
    (fieldName) => {
      const {
        payrollCycle,
        prorateSalaryFormula,
        shuiProvider,
        isAypAssistESubmission,
        shuiUserId,
        shuiPassword,
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
        case 'shuiProvider':
          return shuiProvider
            ? t(`${COMPANY_POM_VN_SHUI_PROVIDER_LABEL_PREFIX}${shuiProvider}`)
            : '-';
        case 'isAypAssistESubmission':
          return isAypAssistESubmission ? t('common:yes') : t('common:no');
        case 'shuiUserId':
          return shuiUserId ? (
            <DecryptedText text={shuiUserId} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'shuiPassword':
          return shuiPassword ? (
            <DecryptedText text={shuiPassword} isDecrypted={isDecrypted} />
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
          title={t(`serviceDetailsForm.vnFields.${field.labelKey}`)}
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

export default VnDetailFields;
