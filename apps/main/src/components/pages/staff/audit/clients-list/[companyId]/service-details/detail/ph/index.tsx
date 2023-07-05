import { FC, useCallback, useMemo } from 'react';
import { get } from 'lodash-es';
import { TFunction } from 'next-i18next';
import { Typography } from '@mui/material';
import { CompanyPhilippines, PayrollCycle } from '@ayp/typings/entities';

import {
  COMPANY_POM_PH_STATUTORY_DEDUCTIONS_LABEL_PREFIX,
  PAYROLL_CYCLE_LABEL_PREFIX,
  PRORATE_SALARY_FORMULA_LABEL_PREFIX,
} from '@configs/constants';

import { SERVICE_DETAILS_FIELDS } from './config';
import { DecryptedText, LineSection } from '../commons';

const PhDetailFields: FC<{
  values: CompanyPhilippines;
  t: TFunction;
  isDecrypted: boolean;
}> = ({ t, values, isDecrypted }) => {
  const mapValueForDisplay = useCallback<(fieldName: string) => string>(
    (fieldName) => {
      const {
        payrollCycle,
        prorateSalaryFormula,
        statutoryDeductions,
        isAypAssistESubmission,
        sssUserId,
        sssPassword,
        penId,
        penPassword,
        birTinId,
        birUsername,
        birPassword,
        birSecurityQuestionAnswer,
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
        case 'statutoryDeductions':
          return statutoryDeductions
            ? t(
                `${COMPANY_POM_PH_STATUTORY_DEDUCTIONS_LABEL_PREFIX}${statutoryDeductions}`
              )
            : '-';
        case 'sssUserId':
          return sssUserId ? (
            <DecryptedText text={sssUserId} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'sssPassword':
          return sssPassword ? (
            <DecryptedText text={sssPassword} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'penId':
          return penId ? (
            <DecryptedText text={penId} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'penPassword':
          return penPassword ? (
            <DecryptedText text={penPassword} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'birTinId':
          return birTinId ? (
            <DecryptedText text={birTinId} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'birUsername':
          return birUsername ? (
            <DecryptedText text={birUsername} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'birPassword':
          return birPassword ? (
            <DecryptedText text={birPassword} isDecrypted={isDecrypted} />
          ) : (
            '-'
          );
        case 'birSecurityQuestionAnswer':
          return birSecurityQuestionAnswer ? (
            <DecryptedText
              text={birSecurityQuestionAnswer}
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

  const mapLabelForDisplay = useCallback<
    (
      field:
        | {
            fieldName: string;
            labelKey: string;
            semiLabelKey?: undefined;
          }
        | {
            fieldName: string;
            labelKey: string;
            semiLabelKey: string;
          }
    ) => string
  >(
    (field) => {
      const { payrollCycle } = values;
      if (payrollCycle === PayrollCycle.MONTHLY) {
        return t(`serviceDetailsForm.phFields.${field.labelKey}`);
      }

      return t(
        `serviceDetailsForm.phFields.${field.semiLabelKey || field.labelKey}`
      );
    },
    [t, values]
  );

  const commonFields = useMemo(() => {
    if (values.payrollCycle === PayrollCycle.MONTHLY) {
      return SERVICE_DETAILS_FIELDS.commonFields.filter(
        ({ fieldName }) =>
          fieldName !== 'statutoryDeductions' &&
          fieldName !== 'secondPayrollCutOffDate' &&
          fieldName !== 'secondPayrollDate'
      );
    }

    return SERVICE_DETAILS_FIELDS.commonFields;
  }, [values.payrollCycle]);

  return (
    <>
      {commonFields.map((field, key) => (
        <LineSection
          key={key}
          title={mapLabelForDisplay(field)}
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

export default PhDetailFields;
