import { PayrollCycle, ProrateSalaryFormula } from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useMemo } from 'react';

import { Select, TextField } from '@components/ui';
import {
  BOOLEAN_OPTIONS,
  COMPANY_POM_HK_MPF_PROVIDER_OPTIONS,
  DATE_OPTIONS,
  PAYROLL_CYCLE_OPTIONS,
  PRORATE_SALARY_FORMULA_OPTIONS,
} from '@configs/constants';

import { BankAccount } from '../commons';
import { initialBankAccount } from '../commons/config';
import { FormValues, initialValues as defaultValues } from './config';

const HkFormFields: FC<{
  isEditing: boolean;
  dataTestId: string;
  bankOptions: Option<string>[];
}> = ({ isEditing, dataTestId, bankOptions }) => {
  const { t } = useTranslation('company-pom-hk-form');

  const {
    values: {
      isAypAssistESubmission,
      isUsingDisbursementService,
      isGenerateBankFile,
    },
    initialValues,
    setFieldValue,
    setTouched,
  } = useFormikContext<FormValues>();

  useEffect(() => {
    if (!isAypAssistESubmission) {
      setFieldValue('mpfUsername', null);
      setFieldValue('mpfPassword', null);
    }
    if (isEditing && isAypAssistESubmission) {
      setFieldValue('mpfUsername', initialValues.mpfUsername);
      setFieldValue('mpfPassword', initialValues.mpfPassword);
      setTouched({});
    }
  }, [
    isAypAssistESubmission,
    initialValues.mpfPassword,
    initialValues.mpfUsername,
    isEditing,
    setFieldValue,
    setTouched,
  ]);

  useEffect(() => {
    if (
      initialValues.isUsingDisbursementService !== isUsingDisbursementService
    ) {
      setFieldValue('isGenerateBankFile', defaultValues.isGenerateBankFile);
      setTouched({});
    }

    if (
      isEditing &&
      !isUsingDisbursementService &&
      initialValues.isGenerateBankFile
    ) {
      setFieldValue('isGenerateBankFile', initialValues.isGenerateBankFile);
    }
  }, [
    initialValues.isUsingDisbursementService,
    initialValues.isGenerateBankFile,
    isUsingDisbursementService,
    isEditing,
    initialValues.bankAccount,
    setFieldValue,
    setTouched,
  ]);

  useEffect(() => {
    if (!!isGenerateBankFile) {
      setFieldValue('bankAccount', initialBankAccount);
      setTouched({});
    }
    if (isEditing && !!isGenerateBankFile && initialValues.bankAccount) {
      setFieldValue('bankAccount', initialValues.bankAccount);
    }
  }, [
    isGenerateBankFile,
    isEditing,
    initialValues.bankAccount,
    setFieldValue,
    setTouched,
  ]);

  const yesNoOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const isGenerateBankFileOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.filter(({ id }) => bankOptions.length || !id).map(
        (option) => ({
          ...option,
          label: t(option.label),
        })
      ),
    [t, bankOptions.length]
  );

  const payrollCycleOptions = useMemo(
    () =>
      PAYROLL_CYCLE_OPTIONS.filter(({ id }) => id === PayrollCycle.MONTHLY).map(
        (payrollCycle) => ({
          ...payrollCycle,
          label: t(payrollCycle.label),
        })
      ),
    [t]
  );

  const salaryFormulaOptions = useMemo(
    () =>
      PRORATE_SALARY_FORMULA_OPTIONS.filter(
        ({ id }) =>
          id === ProrateSalaryFormula.CALENDAR_DAYS ||
          id === ProrateSalaryFormula.WORKING_DAYS
      ).map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const mpfProviderOptions = useMemo(
    () =>
      COMPANY_POM_HK_MPF_PROVIDER_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Select
          required
          name="payrollCycle"
          options={payrollCycleOptions}
          label={t('form.payrollCycle.label')}
          helperText={t('form.payrollCycle.helperText')}
          dataTestId={`${dataTestId}-payrollCycle`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="payrollCutOffDate"
          options={DATE_OPTIONS}
          label={t('form.payrollCutOffDate.label')}
          helperText={t('form.payrollCutOffDate.helperText')}
          dataTestId={`${dataTestId}-payrollCutOffDate`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="payrollDate"
          options={DATE_OPTIONS}
          label={t('form.payrollDate.label')}
          helperText={t('form.payrollDate.helperText')}
          dataTestId={`${dataTestId}-payrollDate`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="prorateSalaryFormula"
          options={salaryFormulaOptions}
          label={t('form.prorateSalaryFormula.label')}
          helperText={t('form.prorateSalaryFormula.helperText')}
          dataTestId={`${dataTestId}-prorateSalaryFormula`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="mpfProvider"
          options={mpfProviderOptions}
          label={t('form.mpfProvider.label')}
          helperText={t('form.mpfProvider.helperText')}
          dataTestId={`${dataTestId}-mpfProvider`}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="mpfSubSchemeNumber"
          label={t('form.mpfSubSchemeNumber.label')}
          helperText={t(`form.mpfSubSchemeNumber.helperText`)}
          dataTestId={`${dataTestId}-mpfSubSchemeNumber`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="isAypAssistESubmission"
          options={yesNoOptions}
          label={t('form.isAypAssistESubmission.label')}
          helperText={t('form.isAypAssistESubmission.helperText')}
          dataTestId={`${dataTestId}-isAypAssistESubmission`}
        />
      </Grid>
      {!!isAypAssistESubmission && (
        <>
          <Grid item xs={12}>
            <TextField
              type="password"
              required
              withFieldVisibility
              disableAutoComplete
              name="mpfUsername"
              label={t('form.mpfUsername.label')}
              helperText={t('form.mpfUsername.helperText')}
              dataTestId={`${dataTestId}-mpfUsername`}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              type="password"
              disableAutoComplete
              name="mpfPassword"
              withFieldVisibility
              label={t('form.mpfPassword.label')}
              helperText={t('form.mpfPassword.helperText')}
              dataTestId={`${dataTestId}-mpfPassword`}
            />
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <Select
          required
          name="isUsingDisbursementService"
          options={yesNoOptions}
          label={t('form.isUsingDisbursementService.label')}
          helperText={t(`form.isUsingDisbursementService.helperText`)}
          dataTestId={`${dataTestId}-isUsingDisbursementService`}
        />
      </Grid>
      {!isUsingDisbursementService && isUsingDisbursementService !== null && (
        <Grid item xs={12}>
          <Select
            required
            name="isGenerateBankFile"
            options={isGenerateBankFileOptions}
            label={t('form.isGenerateBankFile.label')}
            helperText={t(`form.isGenerateBankFile.helperText`)}
            dataTestId={`${dataTestId}-isGenerateBankFile`}
          />
        </Grid>
      )}
      {!!isGenerateBankFile && (
        <BankAccount dataTestId={dataTestId} bankOptions={bankOptions} />
      )}
    </Grid>
  );
};

export default HkFormFields;
