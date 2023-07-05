import { FC, useCallback } from 'react';
import { get } from 'lodash-es';
import { TFunction } from 'next-i18next';
import { Typography } from '@mui/material';
import { CompanySingapore } from '@ayp/typings/entities';

import {
  COMPANY_POM_SG_E_SUBMISSION_SERVICE_LABEL_PREFIX,
  COMPANY_POM_SG_CPF_PAYMENT_MODE_LABEL_PREFIX,
  PAYROLL_CYCLE_LABEL_PREFIX,
  PRORATE_SALARY_FORMULA_LABEL_PREFIX,
  COMPANY_POM_SG_CPF_SUBMISSION_PLATFORM_LABEL_PREFIX,
} from '@configs/constants';

import { SERVICE_DETAILS_FIELDS } from './config';
import { DecryptedText, LineSection } from '../commons';

const SgDetailFields: FC<{
  values: CompanySingapore;
  t: TFunction;
  isDecrypted: boolean;
}> = ({ t, values, isDecrypted }) => {
  const mapValueForDisplay = useCallback<(fieldName: string) => string>(
    (fieldName) => {
      const {
        payrollCycle,
        prorateSalaryFormula,
        cpfPaymentMode,
        cpfSubmissionPlatform,
        crimsonLogicPassword,
        crimsonLogicUsername,
        eSubmissionServices,
        isAypAssistESubmission,
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
        case 'cpfPaymentMode':
          return cpfPaymentMode
            ? t(
                `${COMPANY_POM_SG_CPF_PAYMENT_MODE_LABEL_PREFIX}${cpfPaymentMode}`
              )
            : '-';
        case 'eSubmissionServices':
          return eSubmissionServices
            ? eSubmissionServices
                .map((item) =>
                  t(
                    `${COMPANY_POM_SG_E_SUBMISSION_SERVICE_LABEL_PREFIX}${item}`
                  )
                )
                .join(', ')
            : '-';
        case 'cpfSubmissionPlatform':
          return cpfSubmissionPlatform
            ? t(
                `${COMPANY_POM_SG_CPF_SUBMISSION_PLATFORM_LABEL_PREFIX}${cpfSubmissionPlatform}`
              )
            : '-';
        case 'crimsonLogicUsername':
          return crimsonLogicUsername ? (
            <DecryptedText
              text={crimsonLogicUsername}
              isDecrypted={isDecrypted}
            />
          ) : (
            '-'
          );
        case 'crimsonLogicPassword':
          return crimsonLogicPassword ? (
            <DecryptedText
              text={crimsonLogicPassword}
              isDecrypted={isDecrypted}
            />
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
          title={t(`serviceDetailsForm.sgFields.${field.labelKey}`)}
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

export default SgDetailFields;
