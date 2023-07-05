import { FC, useCallback } from 'react';
import { Typography } from '@mui/material';
import { get } from 'lodash-es';
import { TFunction } from 'next-i18next';
import { CompanyThailand } from '@ayp/typings/entities';

import {
  PAYROLL_CYCLE_LABEL_PREFIX,
  PRORATE_SALARY_FORMULA_LABEL_PREFIX,
} from '@configs/constants';

import { SERVICE_DETAILS_FIELDS } from './config';
import { DecryptedText, LineSection } from '../commons';

const ThDetailFields: FC<{
  values: CompanyThailand;
  t: TFunction;
  isDecrypted: boolean;
}> = ({ values, t, isDecrypted }) => {
  const mapValueForDisplay = useCallback<(fieldName: string) => string>(
    (fieldName) => {
      const {
        payrollCycle,
        prorateSalaryFormula,
        isAypAssistESubmission,
        ssoEFilingUsername,
        ssoEFilingPassword,
        revenueEFilingUsername,
        revenueEFilingPassword,
        isUsingDisbursementService,
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
        case 'isAypAssistESubmission':
          return isAypAssistESubmission ? t('common:yes') : t('common:no');
        case 'ssoEFilingUsername':
          return ssoEFilingUsername ? (
            <DecryptedText
              text={ssoEFilingUsername}
              isDecrypted={isDecrypted}
            />
          ) : (
            '-'
          );
        case 'ssoEFilingPassword':
          return ssoEFilingPassword ? (
            <DecryptedText
              text={ssoEFilingPassword}
              isDecrypted={isDecrypted}
            />
          ) : (
            '-'
          );
        case 'revenueEFilingUsername':
          return revenueEFilingUsername ? (
            <DecryptedText
              text={revenueEFilingUsername}
              isDecrypted={isDecrypted}
            />
          ) : (
            '-'
          );
        case 'revenueEFilingPassword':
          return revenueEFilingPassword ? (
            <DecryptedText
              text={revenueEFilingPassword}
              isDecrypted={isDecrypted}
            />
          ) : (
            '-'
          );
        case 'isUsingDisbursementService':
          return isUsingDisbursementService ? t('common:yes') : t('common:no');

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
          title={t(`serviceDetailsForm.thFields.${field.labelKey}`)}
          value={<Typography>{mapValueForDisplay(field.fieldName)}</Typography>}
        />
      ))}
      {SERVICE_DETAILS_FIELDS.bankAccount.map((field, key) => (
        <LineSection
          key={key}
          title={t(`serviceDetailsForm.bankAccount.${field.labelKey}`)}
          value={<Typography>-</Typography>}
        />
      ))}
    </>
  );
};

export default ThDetailFields;
