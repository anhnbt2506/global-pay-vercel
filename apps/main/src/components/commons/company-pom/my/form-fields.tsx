import { FC, useMemo, useEffect } from 'react';
import { Grid } from '@mui/material';
import { Option } from '@ayp/typings/ui';
import { useTranslation } from 'next-i18next';
import { useFormikContext } from 'formik';
import { PayrollCycle, ProrateSalaryFormula } from '@ayp/typings/entities';

import { Select, TextField } from '@components/ui';
import { BankAccount } from '@components/commons/company-pom/commons';
import {
  BOOLEAN_OPTIONS,
  DATE_OPTIONS,
  PAYROLL_CYCLE_OPTIONS,
  PRORATE_SALARY_FORMULA_OPTIONS,
} from '@configs/constants';

import { FormValues, initialValues as defaultValues } from './config';
import { initialBankAccount } from '../commons/config';

const MyFormFields: FC<{
  isEditing: boolean;
  dataTestId: string;
  bankOptions: Option<string>[];
}> = ({ isEditing, dataTestId, bankOptions }) => {
  const { t } = useTranslation('company-pom-my-form');
  const {
    values: {
      isAypAssistESubmission,
      isUsingDisbursementService,
      isGenerateBankFile,
    },
    setFieldValue,
    initialValues,
    setTouched,
  } = useFormikContext<FormValues>();

  useEffect(() => {
    if (!isAypAssistESubmission) {
      setFieldValue('socsoEmail', null);
      setFieldValue('socsoPassword', null);
      setFieldValue('epfUserId', null);
      setFieldValue('epfPassword', null);
      setFieldValue('cp39UserId', null);
      setFieldValue('cp39Password', null);
    }
    if (isEditing && isAypAssistESubmission) {
      setFieldValue('socsoEmail', initialValues.socsoEmail);
      setFieldValue('socsoPassword', initialValues.socsoPassword);
      setFieldValue('epfUserId', initialValues.epfUserId);
      setFieldValue('epfPassword', initialValues.epfPassword);
      setFieldValue('cp39UserId', initialValues.cp39UserId);
      setFieldValue('cp39Password', initialValues.cp39Password);
      setTouched({});
    }
  }, [
    isAypAssistESubmission,
    setFieldValue,
    setTouched,
    initialValues.socsoEmail,
    initialValues.socsoPassword,
    initialValues.epfUserId,
    initialValues.epfPassword,
    initialValues.cp39UserId,
    initialValues.cp39Password,
    isEditing,
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
        (option) => ({
          ...option,
          label: t(option.label),
        })
      ),
    [t]
  );

  const prorateSalaryFormulaOptions = useMemo(
    () =>
      PRORATE_SALARY_FORMULA_OPTIONS.filter(
        ({ id }) =>
          id === ProrateSalaryFormula['26_DAYS'] ||
          id === ProrateSalaryFormula.CALENDAR_DAYS
      ).map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const eSubmissionServicesField = useMemo(
    () => (
      <>
        <Grid item xs={12}>
          <TextField
            required
            disableAutoComplete
            name="socsoEmail"
            type="password"
            withFieldVisibility
            label={t('form.socsoEmail.label')}
            helperText={t('form.socsoEmail.helperText')}
            dataTestId={`${dataTestId}-socsoEmail`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            disableAutoComplete
            name="socsoPassword"
            type="password"
            withFieldVisibility
            label={t('form.socsoPassword.label')}
            helperText={t('form.socsoPassword.helperText')}
            dataTestId={`${dataTestId}-socsoPassword`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            disableAutoComplete
            name="epfUserId"
            type="password"
            withFieldVisibility
            label={t('form.epfUserId.label')}
            helperText={t('form.epfUserId.helperText')}
            dataTestId={`${dataTestId}-epfUserId`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            disableAutoComplete
            name="epfPassword"
            type="password"
            withFieldVisibility
            label={t('form.epfPassword.label')}
            helperText={t('form.epfPassword.helperText')}
            dataTestId={`${dataTestId}-epfPassword`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            disableAutoComplete
            name="cp39UserId"
            type="password"
            withFieldVisibility
            label={t('form.cp39UserId.label')}
            helperText={t('form.cp39UserId.helperText')}
            dataTestId={`${dataTestId}-cp39UserId`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            disableAutoComplete
            name="cp39Password"
            type="password"
            withFieldVisibility
            label={t('form.cp39Password.label')}
            helperText={t('form.cp39Password.helperText')}
            dataTestId={`${dataTestId}-cp39Password`}
          />
        </Grid>
      </>
    ),
    [t, dataTestId]
  );

  const fields = useMemo(
    () => (
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
            options={prorateSalaryFormulaOptions}
            label={t('form.prorateSalaryFormula.label')}
            helperText={t('form.prorateSalaryFormula.helperText')}
            dataTestId={`${dataTestId}-prorateSalaryFormula`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="epfNumber"
            label={t('form.epfNumber.label')}
            helperText={t('form.epfNumber.helperText')}
            dataTestId={`${dataTestId}-epfNumber`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="socsoNumber"
            label={t('form.socsoNumber.label')}
            helperText={t('form.socsoNumber.helperText')}
            dataTestId={`${dataTestId}-socsoNumber`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="eisNumber"
            label={t('form.eisNumber.label')}
            helperText={t('form.eisNumber.helperText')}
            dataTestId={`${dataTestId}-eisNumber`}
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
        {!!isAypAssistESubmission && eSubmissionServicesField}
        <Grid item xs={12}>
          <Select
            required
            name="isUsingDisbursementService"
            options={yesNoOptions}
            label={t('form.isUsingDisbursementService.label')}
            helperText={t('form.isUsingDisbursementService.helperText')}
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
    ),
    [
      payrollCycleOptions,
      t,
      dataTestId,
      prorateSalaryFormulaOptions,
      yesNoOptions,
      isAypAssistESubmission,
      eSubmissionServicesField,
      isUsingDisbursementService,
      isGenerateBankFileOptions,
      isGenerateBankFile,
      bankOptions,
    ]
  );

  return fields;
};

export default MyFormFields;
