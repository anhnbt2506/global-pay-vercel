import { PayrollCycle, ProrateSalaryFormula } from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useMemo } from 'react';

import { BankAccount } from '@components/commons/company-pom/commons';
import { Select, TextField } from '@components/ui';
import {
  BOOLEAN_OPTIONS,
  COMPANY_POM_ID_CONTRIBUTION_FOR_BPJS_ON_SALARY_OPTIONS,
  DATE_OPTIONS,
  PAYROLL_CYCLE_OPTIONS,
  PRORATE_SALARY_FORMULA_OPTIONS,
} from '@configs/constants';

import { initialBankAccount } from '../commons/config';
import { FormValues, initialValues as defaultValues } from './config';

const IdFormFields: FC<{
  isEditing: boolean;
  dataTestId: string;
  bankOptions: Option<string>[];
}> = ({ isEditing, dataTestId, bankOptions }) => {
  const { t } = useTranslation('company-pom-id-form');

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

  const contributionForBpjsOnSalaryOptions = useMemo(
    () =>
      COMPANY_POM_ID_CONTRIBUTION_FOR_BPJS_ON_SALARY_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  useEffect(() => {
    if (!isAypAssistESubmission) {
      setFieldValue('djpTaxNumberId', null);
      setFieldValue('djpPassword', null);
      setFieldValue('eDabuId', null);
      setFieldValue('eDabuPassword', null);
      setFieldValue('sippId', null);
      setFieldValue('sippPassword', null);
    }
    if (isEditing && isAypAssistESubmission) {
      setFieldValue('djpTaxNumberId', initialValues.djpTaxNumberId);
      setFieldValue('djpPassword', initialValues.djpPassword);
      setFieldValue('eDabuId', initialValues.eDabuId);
      setFieldValue('eDabuPassword', initialValues.eDabuPassword);
      setFieldValue('sippId', initialValues.sippId);
      setFieldValue('sippPassword', initialValues.sippPassword);
      setTouched({});
    }
  }, [
    isAypAssistESubmission,
    isEditing,
    initialValues.djpTaxNumberId,
    initialValues.djpPassword,
    initialValues.eDabuId,
    initialValues.eDabuPassword,
    initialValues.sippId,
    initialValues.sippPassword,
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
          name="prorateLeaveEncashmentFormula"
          options={salaryFormulaOptions}
          label={t('form.prorateLeaveEncashmentFormula.label')}
          helperText={t('form.prorateLeaveEncashmentFormula.helperText')}
          dataTestId={`${dataTestId}-prorateLeaveEncashmentFormula`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="prorateUnpaidLeaveEncashmentFormula"
          options={salaryFormulaOptions}
          label={t('form.prorateUnpaidLeaveEncashmentFormula.label')}
          helperText={t('form.prorateUnpaidLeaveEncashmentFormula.helperText')}
          dataTestId={`${dataTestId}-prorateUnpaidLeaveEncashmentFormula`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="contributionForBpjsOnSalary"
          options={contributionForBpjsOnSalaryOptions}
          label={t('form.contributionForBpjsOnSalary.label')}
          helperText={t('form.contributionForBpjsOnSalary.helperText')}
          dataTestId={`${dataTestId}-contributionForBpjsOnSalary`}
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
              name="djpTaxNumberId"
              label={t('form.djpTaxNumberId.label')}
              helperText={t('form.djpTaxNumberId.helperText')}
              dataTestId={`${dataTestId}-djpTaxNumberId`}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              type="password"
              disableAutoComplete
              name="djpPassword"
              withFieldVisibility
              label={t('form.djpPassword.label')}
              helperText={t('form.djpPassword.helperText')}
              dataTestId={`${dataTestId}-djpPassword`}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              required
              disableAutoComplete
              withFieldVisibility
              name="eDabuId"
              label={t('form.eDabuId.label')}
              helperText={t('form.eDabuId.helperText')}
              dataTestId={`${dataTestId}-eDabuId`}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              required
              disableAutoComplete
              withFieldVisibility
              name="eDabuPassword"
              label={t('form.eDabuPassword.label')}
              helperText={t('form.eDabuPassword.helperText')}
              dataTestId={`${dataTestId}-eDabuPassword`}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              required
              disableAutoComplete
              withFieldVisibility
              name="sippId"
              label={t('form.sippId.label')}
              helperText={t('form.sippId.helperText')}
              dataTestId={`${dataTestId}-sippId`}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              disableAutoComplete
              required
              withFieldVisibility
              name="sippPassword"
              label={t('form.sippPassword.label')}
              helperText={t('form.sippPassword.helperText')}
              dataTestId={`${dataTestId}-sippPassword`}
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

export default IdFormFields;
