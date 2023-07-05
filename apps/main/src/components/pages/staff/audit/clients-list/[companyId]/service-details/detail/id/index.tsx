import { FC, useCallback } from 'react';
import { get } from 'lodash-es';
import { TFunction } from 'next-i18next';
import { Typography } from '@mui/material';
import { CompanyIndonesia } from '@ayp/typings/entities';

import {
  PAYROLL_CYCLE_LABEL_PREFIX,
  PRORATE_SALARY_FORMULA_LABEL_PREFIX,
  COMPANY_POM_ID_CONTRIBUTION_FOR_BPJS_ON_SALARY_PREFIX,
} from '@configs/constants';

import { SERVICE_DETAILS_FIELDS } from './config';
import { DecryptedText, LineSection } from '../commons';

const IdDetailFields: FC<{
  values: CompanyIndonesia;
  t: TFunction;
  isDecrypted: boolean;
}> = ({ t, values, isDecrypted }) => {
  const mapValueForDisplay = useCallback<(fieldName: string) => string>(
    (fieldName) => {
      const {
        payrollCycle,
        prorateSalaryFormula,
        prorateLeaveEncashmentFormula,
        prorateUnpaidLeaveEncashmentFormula,
        contributionForBpjsOnSalary,
        isAypAssistESubmission,
        djpTaxNumberId,
        djpPassword,
        eDabuId,
        eDabuPassword,
        sippId,
        sippPassword,
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
        case 'prorateLeaveEncashmentFormula':
          return prorateLeaveEncashmentFormula
            ? t(
                `${PRORATE_SALARY_FORMULA_LABEL_PREFIX}${prorateLeaveEncashmentFormula}`
              )
            : '-';
        case 'prorateUnpaidLeaveEncashmentFormula':
          return prorateLeaveEncashmentFormula
            ? t(
                `${PRORATE_SALARY_FORMULA_LABEL_PREFIX}${prorateUnpaidLeaveEncashmentFormula}`
              )
            : '-';
        case 'contributionForBpjsOnSalary':
          return contributionForBpjsOnSalary
            ? t(
                `${COMPANY_POM_ID_CONTRIBUTION_FOR_BPJS_ON_SALARY_PREFIX}${contributionForBpjsOnSalary}`
              )
            : '-';
        case 'isAypAssistESubmission':
          return isAypAssistESubmission ? t('common:yes') : t('common:no');
        case 'djpTaxNumberId':
          return djpTaxNumberId ? (
            <DecryptedText text={djpTaxNumberId} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'djpPassword':
          return djpPassword ? (
            <DecryptedText text={djpPassword} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'eDabuId':
          return eDabuId ? (
            <DecryptedText text={eDabuId} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'eDabuPassword':
          return eDabuPassword ? (
            <DecryptedText text={eDabuPassword} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'sippId':
          return sippId ? (
            <DecryptedText text={sippId} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'sippPassword':
          return sippPassword ? (
            <DecryptedText text={sippPassword} isDecrypted={isDecrypted} />
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
          title={t(`serviceDetailsForm.idFields.${field.labelKey}`)}
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

export default IdDetailFields;
